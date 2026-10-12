"""Local mocked browser checks. No emails sent and no provider credits consumed.
Run: python tests/autogtm-browser.py (Vite must be running on port 4180).
Requires Python Playwright and installed Google Chrome.
"""
import base64
import json
import os
import re
import tempfile
import time
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright, expect

BASE = 'http://127.0.0.1:4180'
REF = 'cvpeezzkzsbosyuhmhmf'
AUTH_REF = 'hpkmrpezybhtyjcsxfiq'
JOB = 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb'
USER = {'id': 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', 'email': 'test@company.com', 'aud': 'authenticated', 'role': 'authenticated'}
PROFILE = {'job_id': JOB, 'project_id': JOB, 'company_name': 'Test Company', 'business_description': 'Makes useful widgets.',
    'descriptions': [{'text': 'Makes useful widgets.', 'source_urls': ['https://company.com/']}],
    'products': [{'name': 'Widget', 'description': 'A useful product.', 'source_urls': ['https://company.com/products']}],
    'customers': [], 'locations': [], 'source_urls': ['https://company.com/', 'https://company.com/products'], 'warnings': []}
CAMPAIGN = {'id': 'cccccccc-cccc-4ccc-cccc-cccccccccccc', 'name': 'Widget manufacturers', 'target_audience': 'Manufacturing businesses',
            'target_industry': 'Manufacturing', 'ideal_customer': 'Factories looking for useful widgets.', 'keywords': ['widget manufacturer'],
            'target_locations': [], 'reasoning': 'Suggested from the saved widget research.', 'source_urls': ['https://company.com/'], 'origin': 'suggested'}

def session():
    enc = lambda obj: base64.urlsafe_b64encode(json.dumps(obj).encode()).decode().rstrip('=')
    token = enc({'alg': 'HS256', 'typ': 'JWT'}) + '.' + enc({'sub': USER['id'], 'exp': int(time.time()) + 3600, 'role': 'authenticated'}) + '.test'
    return {'access_token': token, 'refresh_token': 'test-refresh', 'expires_at': int(time.time()) + 3600,
            'expires_in': 3600, 'token_type': 'bearer', 'user': USER}

def check_width(page):
    assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth'), 'Document overflows viewport'
    assert page.evaluate("Array.from(document.querySelectorAll('main')).every(e => e.scrollWidth <= e.clientWidth + 1)"), 'Main content overflows'

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe', headless=True)
    state = {'status': 'scraping', 'starts': 0, 'otp_error': True, 'verify_error': True, 'domain': 'company.com', 'websites': [], 'saved': set(),
             'competitors': 'searching', 'competitor_requests': 0, 'competitor_results': [
                 {'domain': 'real-rival.com', 'name': 'Real Rival', 'description': 'Makes useful widgets.', 'products': [], 'customers': [],
                  'features': [], 'pricing': [], 'source_urls': ['https://real-rival.com/'], 'relationship': 'direct', 'relevance_score': 80, 'ranking_reason': 'Shared widget products.'}]}
    state['campaign_failure'] = True
    state['campaign_conflict'] = False
    state['campaign_plan'] = {'status': 'completed', 'version': 1, 'campaigns': [dict(CAMPAIGN)], 'selected_ids': [CAMPAIGN['id']], 'warnings': []}
    def route(request_route):
        req = request_route.request
        url = urlparse(req.url)
        if url.hostname == '127.0.0.1':
            request_route.continue_(); return
        if url.hostname not in [REF + '.supabase.co', AUTH_REF + '.supabase.co']:
            request_route.abort(); return
        payload = {}
        code = 200
        path = url.path
        if path.startswith('/auth/'):
            assert url.hostname == AUTH_REF + '.supabase.co'
        elif path.startswith('/functions/'):
            assert url.hostname == REF + '.supabase.co'
        if path.endswith('/start-research'):
            state['starts'] += 1
            state['websites'].append(req.post_data_json['website'])
            state['domain'] = urlparse(req.post_data_json['website']).hostname.replace('www.', '', 1)
            state['saved'].add(state['domain'])
            payload = {'job': {'id': JOB}}
        elif path.endswith('/research-status'):
            payload = {'job': {'id': JOB, 'project_id': JOB, 'status': state['status'], 'selected_urls': ['https://company.com/', 'https://company.com/products'],
                              'pages_completed': 2 if state['status'] == 'completed' else 1, 'error_message': 'Website blocked scraping.'},
                       'project': {'id': JOB, 'domain': state['domain'], 'website_url': 'https://' + state['domain'] + '/'},
                       'profile': json.loads(json.dumps(PROFILE).replace('company.com', state['domain']).replace('Test Company', 'Profile for ' + state['domain'])) if state['status'] == 'completed' else None,
                       'events': [{'id': 1, 'message': 'Finding company pages', 'pages_completed': 0, 'created_at': '2026-10-12T12:00:00Z'}]}
        elif path.endswith('/competitor-research'):
            assert req.post_data_json['job_id'] == JOB
            state['competitor_requests'] += 1
            payload = {'job_id': JOB, 'project_id': JOB, 'research': {
                'status': state['competitors'], 'queries': ['useful widget alternatives'], 'searches_used': 1,
                'candidates_count': 1, 'pages_completed': 1 if state['competitors'] == 'completed' else 0,
                'results': state['competitor_results'] if state['competitors'] == 'completed' else [], 'warnings': [],
                'error': 'Firecrawl is busy. Please retry.' if state['competitors'] == 'failed' else None, 'can_retry': True}}
        elif path.endswith('/campaigns'):
            body = req.post_data_json
            assert body['job_id'] == JOB
            action = body.get('action', 'load')
            plan = state['campaign_plan']
            if state['campaign_failure']:
                code = 503
                payload = {'error': {'code': 'NOT_DEPLOYED', 'message': 'Phase 3 backend is not deployed yet.'}}
            elif action != 'load' and (state['campaign_conflict'] or body.get('version') != plan['version']):
                state['campaign_conflict'] = False
                code = 409
                plan['version'] += 1
                payload = {'error': {'code': 'CONFLICT', 'message': 'Campaigns changed in another tab. Reload the latest plan before saving.'}}
            else:
                if action == 'create':
                    plan['campaigns'].append({**body['campaign'], 'id': body['campaign_id'], 'source_urls': [], 'origin': 'custom'})
                elif action == 'update':
                    plan['campaigns'] = [{**c, **body['campaign']} if c['id'] == body['campaign_id'] else c for c in plan['campaigns']]
                elif action == 'delete':
                    plan['campaigns'] = [c for c in plan['campaigns'] if c['id'] != body['campaign_id']]
                    plan['selected_ids'] = [value for value in plan['selected_ids'] if value != body['campaign_id']]
                elif action == 'select':
                    plan['selected_ids'] = body['selected_ids']
                if action != 'load':
                    plan['version'] += 1
                payload = {'job_id': JOB, 'project_id': JOB, 'plan': plan, 'targets': [
                    {'campaign_id': c['id'], 'name': c['name'], 'audience': c['target_audience'], 'industry': c['target_industry'],
                     'keywords': c['keywords'], 'locations': c['target_locations'], 'plan_version': plan['version']}
                    for c in plan['campaigns'] if c['id'] in plan['selected_ids']]}
        elif path.endswith('/research-projects'):
            domain = req.post_data_json.get('domain')
            payload = {'projects': [{'id': JOB, 'domain': domain, 'updated_at': '2026-10-12T12:00:00Z',
                        'latestJob': {'id': JOB, 'status': state['status'], 'created_at': '2026-10-12T12:00:00Z'}}] if domain in state['saved'] else []}
        elif path.endswith('/otp'):
            code = 429 if state['otp_error'] else 200
            payload = {'msg': 'Email rate limit exceeded', 'error_code': 'over_email_send_rate_limit'} if code != 200 else {}
        elif path.endswith('/verify'):
            code = 403 if state['verify_error'] else 200
            payload = {'msg': 'Token has expired or is invalid', 'error_code': 'otp_expired'} if code != 200 else session()
        elif path.endswith('/user'):
            payload = USER
        else:
            raise AssertionError('Unexpected backend request: ' + path)
        request_route.fulfill(status=code, content_type='application/json', body=json.dumps(payload), headers={'Access-Control-Allow-Origin': '*'})

    context = browser.new_context(viewport={'width': 320, 'height': 720})
    context.route('**/*', route)
    context.add_init_script('localStorage.setItem(' + json.dumps('sb-' + AUTH_REF + '-auth-token') + ', ' + json.dumps(json.dumps(session())) + ');')
    page = context.new_page()
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto(BASE + '/app-auto-gtm')
    expect(page.get_by_role('button', name='Create my project')).to_be_enabled()
    check_width(page)
    page.get_by_role('textbox', name='Company website').fill('company.com')
    page.get_by_role('button', name='Create my project').click()
    expect(page.get_by_role('status')).to_have_text('Researching')
    expect(page.locator('main').get_by_text('company.com', exact=True)).to_be_visible()
    expect(page).to_have_url(re.compile('job=' + JOB))
    assert state['starts'] == 1
    check_width(page)
    # The original animation must stay visible beyond its old demo deadline.
    page.wait_for_timeout(5100)
    expect(page.get_by_role('status')).to_have_text('Researching')
    expect(page.get_by_role('button', name='Next Phase')).to_be_disabled()
    page.get_by_role('button', name='Pause Auto-play').click()
    state['status'] = 'completed'
    expect(page.get_by_role('button', name='Next Phase')).to_be_enabled(timeout=12000)
    expect(page.get_by_role('status')).to_have_text('Researching')
    page.get_by_role('button', name='Resume Auto-play').click()
    expect(page.get_by_role('heading', name='Profile for company.com', exact=True)).to_be_visible()
    page.get_by_role('button', name='Pause Auto-play').click()
    profile_card = page.locator('main')
    expect(profile_card).to_contain_text('Makes useful widgets.')
    expect(profile_card).to_contain_text('Found')
    expect(profile_card.get_by_role('button', name='Continue to competitors')).to_be_enabled()
    expect(page.get_by_role('heading', name='Products and services')).to_have_count(0)
    expect(page.get_by_role('heading', name='Research activity')).to_have_count(0)
    expect(page.get_by_role('heading', name='Researched sources')).to_have_count(0)
    check_width(page)
    for width in [320, 375, 390, 768, 1440]:
        page.set_viewport_size({'width': width, 'height': 900})
        check_width(page)
    page.set_viewport_size({'width': 390, 'height': 844})
    page.get_by_role('button', name='Open project menu').click()
    expect(page.get_by_role('dialog', name='Project menu')).to_be_visible()
    page.get_by_role('button', name='Close project menu').click()
    expect(page.get_by_role('dialog', name='Project menu')).not_to_be_visible()
    screenshot = os.path.join(tempfile.gettempdir(), 'autogtm-company-research-mobile.png')
    page.screenshot(path=screenshot, full_page=True)
    page.reload()
    expect(page.get_by_role('heading', name='Profile for company.com', exact=True)).to_be_visible()
    page.get_by_role('button', name='Pause Auto-play').click()
    assert state['starts'] == 1, 'Reload resubmitted a crawl'
    # Step 2 waits for real results, keeping the original card and skeleton.
    page.get_by_role('button', name='Continue to competitors').click()
    expect(page.get_by_role('button', name='Next Phase')).to_be_disabled()
    expect(page.locator('main').get_by_text('COMPETITORS', exact=True)).to_be_visible()
    page.wait_for_timeout(5100)
    expect(page.get_by_role('button', name='Next Phase')).to_be_disabled()
    expect(page.locator('main').get_by_text('langly.es', exact=True)).to_have_count(0)
    check_width(page)
    state['competitors'] = 'failed'
    expect(page.get_by_role('alert')).to_contain_text('Firecrawl is busy', timeout=12000)
    state['competitors'] = 'completed'
    page.get_by_role('button', name='Retry research').click()
    expect(page.locator('main').get_by_role('link', name='real-rival.com', exact=True)).to_be_visible(timeout=10000)
    page.get_by_role('button', name='Pause Auto-play').click()
    expect(page.locator('main')).to_contain_text('1 found')
    expect(page.locator('main')).to_contain_text('useful widget alternatives')
    expect(page.locator('main').get_by_role('link', name='real-rival.com', exact=True)).to_have_attribute('href', 'https://real-rival.com/')
    for width in [320, 375, 390, 768, 1440]:
        page.set_viewport_size({'width': width, 'height': 900})
        check_width(page)
    page.set_viewport_size({'width': 390, 'height': 844})
    competitor_screenshot = os.path.join(tempfile.gettempdir(), 'autogtm-competitor-research-mobile.png')
    page.screenshot(path=competitor_screenshot, full_page=True)
    page.reload()
    expect(page.locator('main').get_by_role('link', name='real-rival.com', exact=True)).to_be_visible(timeout=10000)
    page.get_by_role('button', name='Pause Auto-play').click()
    assert state['starts'] == 1, 'Competitor reload restarted company research'
    state['competitor_results'] = []
    page.reload()
    expect(page.locator('main')).to_contain_text('0 found', timeout=10000)
    page.get_by_role('button', name='Pause Auto-play').click()
    expect(page.locator('main')).to_contain_text('No competitors with enough supporting evidence')
    expect(page.locator('main').get_by_text('langly.es', exact=True)).to_have_count(0)
    # Phase 3 uses saved campaigns and waits for review instead of auto-advancing.
    page.get_by_role('button', name='Continue to campaigns').click()
    expect(page.get_by_role('alert')).to_contain_text('Phase 3 backend')
    state['campaign_failure'] = False
    page.get_by_role('button', name='Retry research').click()
    expect(page.get_by_role('button', name='Next Phase')).to_be_enabled()
    page.get_by_role('button', name='Next Phase').click()
    expect(page.get_by_role('heading', name='Widget manufacturers', exact=True)).to_be_visible()
    expect(page.locator('main')).not_to_contain_text('5.0K')
    expect(page.get_by_role('checkbox', name='Select Widget manufacturers')).to_be_checked()
    page.get_by_role('button', name='Resume Auto-play').click()
    page.wait_for_timeout(3800)
    expect(page.get_by_role('heading', name='Widget manufacturers', exact=True)).to_be_visible()
    page.get_by_role('button', name='Pause Auto-play').click()
    page.get_by_role('checkbox', name='Select Widget manufacturers').uncheck()
    expect(page.get_by_role('button', name='Continue to find companies')).to_be_disabled()
    page.reload()
    expect(page.get_by_role('heading', name='Widget manufacturers', exact=True)).to_be_visible(timeout=10000)
    expect(page.get_by_role('checkbox', name='Select Widget manufacturers')).not_to_be_checked()
    page.get_by_role('button', name='New campaign').click()
    editor = page.get_by_role('dialog', name='Create campaign')
    expect(editor).to_be_visible()
    editor.get_by_label('Campaign name', exact=True).fill('Brazil distributors')
    editor.get_by_label('Target audience', exact=True).fill('Widget distributors')
    editor.get_by_label('Target industry', exact=True).fill('Manufacturing')
    editor.get_by_label('Ideal customer', exact=True).fill('Distributors seeking widgets in Brazil.')
    editor.get_by_label('Keywords (one per line, up to 10)', exact=True).fill('widget distributor\nindustrial components')
    editor.get_by_label('Target locations (optional, one per line)', exact=True).fill('Brazil')
    editor.get_by_label('Reasoning', exact=True).fill('Test the researched product in this user-chosen market.')
    check_width(page)
    editor.get_by_role('button', name='Save campaign').click()
    expect(editor).not_to_be_visible()
    expect(page.get_by_role('heading', name='Brazil distributors', exact=True)).to_be_visible()
    page.get_by_role('button', name='Edit Brazil distributors', exact=True).click()
    editor = page.get_by_role('dialog', name='Edit campaign')
    editor.get_by_label('Campaign name', exact=True).fill('Brazil widget distributors')
    unsafe = '<img src=x onerror="window.campaignInjected=true">'
    editor.get_by_label('Ideal customer', exact=True).fill(unsafe)
    state['campaign_conflict'] = True
    editor.get_by_role('button', name='Save campaign').click()
    expect(editor.get_by_role('alert')).to_contain_text('another tab')
    expect(editor.get_by_label('Campaign name', exact=True)).to_have_value('Brazil widget distributors')
    editor.get_by_role('button', name='Save campaign').click()
    expect(editor).not_to_be_visible()
    expect(page.get_by_role('heading', name='Brazil widget distributors', exact=True)).to_be_visible()
    assert page.evaluate('window.campaignInjected') is None
    expect(page.locator('main').get_by_text(unsafe, exact=True)).to_be_visible()
    page.get_by_role('checkbox', name='Select Brazil widget distributors').check()
    expect(page.get_by_role('button', name='Continue to find companies')).to_be_enabled()
    page.reload()
    expect(page.get_by_role('checkbox', name='Select Brazil widget distributors')).to_be_checked(timeout=10000)
    for width in [320, 390, 768, 1440]:
        page.set_viewport_size({'width': width, 'height': 900})
        check_width(page)
    page.set_viewport_size({'width': 390, 'height': 844})
    campaign_screenshot = os.path.join(tempfile.gettempdir(), 'autogtm-campaigns-mobile.png')
    page.screenshot(path=campaign_screenshot, full_page=True)
    page.get_by_role('button', name='Delete Widget manufacturers', exact=True).click()
    expect(page.get_by_role('heading', name='Widget manufacturers', exact=True)).to_have_count(0)
    page.get_by_role('button', name='Continue to find companies').click()
    expect(page).to_have_url(re.compile('phase=outreach_companies_loading'))
    assert state['campaign_plan']['selected_ids'] == [state['campaign_plan']['campaigns'][0]['id']]
    assert state['starts'] == 1, 'Later visual stages started another crawl'
    page.get_by_role('link', name='Explee home').first.click()
    page.get_by_role('textbox', name='Company website').fill('company.com')
    page.get_by_role('button', name='Create my project').click()
    expect(page.get_by_role('heading', name='Profile for company.com', exact=True)).to_be_visible(timeout=10000)
    assert state['starts'] == 1, 'Opening the same company resubmitted a crawl'
    state['status'] = 'failed'
    page.reload()
    expect(page.get_by_role('alert')).to_contain_text('Website blocked scraping.')
    assert state['starts'] == 1
    page.get_by_role('button', name='Retry research').click()
    expect(page.get_by_role('button', name='Retry research')).to_be_enabled()
    assert state['starts'] == 2
    # Regression: the exact submitted website must reach the backend from both entry forms.
    state['status'] = 'completed'
    page.goto(BASE + '/app-auto-gtm?website=google.com')
    expect(page.get_by_role('textbox', name='Company website')).to_have_value('google.com')
    page.get_by_role('button', name='Create my project').click()
    expect(page.get_by_role('heading', name='Profile for google.com', exact=True)).to_be_visible(timeout=10000)
    assert '/company/google.com/explore?' in page.url and 'job=' + JOB in page.url
    assert state['websites'][-1] == 'https://google.com/'
    expect(page.get_by_text('PrimKeet', exact=False)).to_have_count(0)
    state['saved'].discard('google.com')
    page.goto(BASE + '/app-autogtm')
    page.locator('#hero-website-input').fill('https://www.google.com/about?campaign=test')
    page.get_by_role('button', name='Launch', exact=True).click()
    expect(page.get_by_role('heading', name='Profile for google.com', exact=True)).to_be_visible(timeout=10000)
    assert state['websites'][-1] == 'https://www.google.com/'
    assert urlparse(page.url).hostname == '127.0.0.1', 'Launch left this app'
    check_width(page)
    # A stale job/profile for a different company must never replace the entered domain.
    starts_before_mismatch = state['starts']
    state['domain'] = 'keethub.lovable.app'
    page.reload()
    expect(page.get_by_role('alert')).to_contain_text('does not match this website')
    expect(page.get_by_role('heading', name='Profile for google.com', exact=True)).to_have_count(0)
    expect(page.locator('main').get_by_text('google.com', exact=True)).to_be_visible()
    assert 'keethub.lovable.app' not in page.locator('body').inner_text()
    assert state['starts'] == starts_before_mismatch
    assert not errors, errors
    context.close()

    starts_before_login = state['starts']
    # Separate unsigned browser: real OTP UI must not grant access after an error.
    context = browser.new_context(viewport={'width': 320, 'height': 720})
    context.route('**/*', route)
    page = context.new_page()
    page.goto(BASE + '/app-auto-gtm')
    page.get_by_role('textbox', name='Company website').fill('company.com')
    page.get_by_role('button', name='Create my project').click()
    page.locator('#email-input').fill('test@company.com')
    page.locator('button[type="submit"]').click()
    expect(page.get_by_role('alert')).to_contain_text('rate limit')
    assert '/sign-in' in page.url
    state['otp_error'] = False
    page.locator('button[type="submit"]').click()
    expect(page.get_by_role('textbox', name='Verification code')).to_be_visible()
    page.get_by_role('textbox', name='Verification code').fill('12345678')
    page.get_by_role('button', name='Continue', exact=True).click()
    expect(page.get_by_role('alert')).to_contain_text('invalid')
    assert 'verification-code' in page.url
    check_width(page)
    state['verify_error'] = False
    page.get_by_role('button', name='Continue', exact=True).click()
    expect(page.get_by_role('button', name='Create my project')).to_be_enabled()
    expect(page.get_by_role('textbox', name='Company website')).to_have_value('https://company.com/')
    assert state['starts'] == starts_before_login, 'Login unexpectedly started a crawl'
    context.close()
    browser.close()
    print('PASS: initial null session/job, original phase 1 and 2 animation/cards, loading, failure/retry, real competitors, empty results, refresh, mobile widths, later stages, OTP, input website and stale-profile rejection')
    print('Mobile screenshot: ' + screenshot)
    print('Competitor screenshot: ' + competitor_screenshot)
    print('Campaign screenshot: ' + campaign_screenshot)
