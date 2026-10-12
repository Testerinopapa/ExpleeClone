"""Local mocked browser checks. No emails sent and no provider credits consumed.
Run: python tests/autogtm-browser.py (Vite must be running on port 4180).
Requires Python Playwright and installed Google Chrome.
"""
import base64
import json
import os
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
    state = {'status': 'scraping', 'starts': 0, 'otp_error': True, 'verify_error': True, 'domain': 'company.com', 'websites': []}
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
            payload = {'job': {'id': JOB}}
        elif path.endswith('/research-status'):
            payload = {'job': {'id': JOB, 'project_id': JOB, 'status': state['status'], 'selected_urls': ['https://company.com/', 'https://company.com/products'],
                              'pages_completed': 2 if state['status'] == 'completed' else 1, 'error_message': 'Website blocked scraping.'},
                       'project': {'id': JOB, 'domain': state['domain'], 'website_url': 'https://' + state['domain'] + '/'},
                       'profile': json.loads(json.dumps(PROFILE).replace('company.com', state['domain']).replace('Test Company', 'Profile for ' + state['domain'])) if state['status'] == 'completed' else None,
                       'events': [{'id': 1, 'message': 'Finding company pages', 'pages_completed': 0, 'created_at': '2026-10-12T12:00:00Z'}]}
        elif path.endswith('/research-projects'):
            payload = {'projects': [{'id': JOB, 'domain': 'company.com', 'updated_at': '2026-10-12T12:00:00Z',
                        'latestJob': {'id': JOB, 'status': state['status'], 'created_at': '2026-10-12T12:00:00Z'}}]}
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
    expect(page.get_by_role('progressbar', name='Pages scraped')).to_be_visible()
    assert state['starts'] == 1
    check_width(page)
    state['status'] = 'completed'
    expect(page.get_by_role('article', name='Saved company profile')).to_be_visible(timeout=12000)
    expect(page.get_by_role('heading', name='Products and services')).to_be_visible()
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
    expect(page.get_by_role('article', name='Saved company profile')).to_be_visible()
    assert state['starts'] == 1, 'Reload resubmitted a crawl'
    page.get_by_role('button', name='All projects').click()
    page.get_by_role('button', name='company.com completed').click()
    expect(page.get_by_role('article', name='Saved company profile')).to_be_visible()
    state['status'] = 'failed'
    page.reload()
    expect(page.get_by_role('heading', name='Research could not finish')).to_be_visible()
    assert state['starts'] == 1
    page.get_by_role('button', name='Start a new attempt').click()
    expect(page.get_by_role('button', name='Start a new attempt')).to_be_enabled()
    assert state['starts'] == 2
    # Regression: the exact submitted website must reach the backend from both entry forms.
    state['status'] = 'completed'
    page.goto(BASE + '/app-auto-gtm?website=google.com')
    expect(page.get_by_role('textbox', name='Company website')).to_have_value('google.com')
    page.get_by_role('button', name='Create my project').click()
    expect(page.get_by_role('heading', name='Profile for google.com', exact=True)).to_be_visible()
    assert '/company/google.com/explore?job=' in page.url
    assert state['websites'][-1] == 'https://google.com/'
    expect(page.get_by_text('PrimKeet', exact=False)).to_have_count(0)
    page.goto(BASE + '/app-autogtm')
    page.locator('#hero-website-input').fill('https://www.google.com/about?campaign=test')
    page.get_by_role('button', name='Launch', exact=True).click()
    expect(page.get_by_role('heading', name='Profile for google.com', exact=True)).to_be_visible()
    assert state['websites'][-1] == 'https://www.google.com/'
    assert urlparse(page.url).hostname == '127.0.0.1', 'Launch left this app'
    check_width(page)
    # A stale job/profile for a different company must never replace the entered domain.
    starts_before_mismatch = state['starts']
    state['domain'] = 'keethub.lovable.app'
    page.reload()
    expect(page.get_by_role('alert')).to_contain_text('does not match this website')
    expect(page.get_by_role('article', name='Saved company profile')).to_have_count(0)
    expect(page.get_by_role('heading', name='google.com', exact=True)).to_be_visible()
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
    page.get_by_role('button', name='Sign in to research').click()
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
    print('PASS: mobile widths, live progress, sources, saved results, refresh, failure/retry, drawer, OTP, google.com from both forms and stale-profile rejection')
    print('Mobile screenshot: ' + screenshot)
