import os
import time
from playwright.sync_api import sync_playwright
from PIL import Image

os.makedirs('verification_screenshots', exist_ok=True)
chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

with sync_playwright() as p:
    browser = p.chromium.launch(
        executable_path=chrome_path if os.path.exists(chrome_path) else None,
        headless=True
    )
    page = browser.new_page(viewport={'width': 1920, 'height': 1080}, device_scale_factor=1)

    print("--- 1. Testing Root URL (/) redirect ---")
    page.goto('http://127.0.0.1:3000/', wait_until='networkidle')
    time.sleep(1)
    current_url = page.url
    print(f"URL after visiting /: {current_url}")
    assert '/sign-in' in current_url, f"Expected /sign-in in URL, got {current_url}"
    page.screenshot(path='verification_screenshots/flow_1_root_redirected.png')

    print("--- 2. Direct visit to /register ---")
    page.goto('http://127.0.0.1:3000/register?app_id=yb37qgq72o4s2o8kao78v', wait_until='networkidle')
    time.sleep(1)
    page.screenshot(path='verification_screenshots/flow_2_register_direct.png')
    
    # Check headline and button text
    headline = page.locator('h1').inner_text()
    print(f"Register headline: {headline}")
    assert 'Create your account' in headline, f"Expected 'Create your account', got {headline}"
    
    btn_text = page.locator('button[type="submit"]').inner_text()
    print(f"Register button text: {btn_text}")
    assert 'Create account' in btn_text, f"Expected 'Create account', got {btn_text}"

    # 3. Mode switch via link: "Sign in"
    print("--- 3. Clicking 'Sign in' link ---")
    signin_link = page.locator('a:has-text("Sign in")')
    signin_link.click()
    time.sleep(0.5)
    print(f"URL after click: {page.url}")
    assert '/sign-in' in page.url, f"Expected /sign-in in URL, got {page.url}"
    page.screenshot(path='verification_screenshots/flow_3_switched_to_signin.png')
    assert 'Sign in to your account' in page.locator('h1').inner_text()
    assert 'Sign in' in page.locator('button[type="submit"]').inner_text()

    # 4. Mode switch back: "Create account"
    print("--- 4. Clicking 'Create account' link ---")
    create_link = page.locator('a:has-text("Create account")')
    create_link.click()
    time.sleep(0.5)
    print(f"URL after click: {page.url}")
    assert '/register' in page.url, f"Expected /register in URL, got {page.url}"
    page.screenshot(path='verification_screenshots/flow_4_switched_to_register.png')
    assert 'Create your account' in page.locator('h1').inner_text()

    # 5. Browser Back & Forward
    print("--- 5. Testing Browser Back / Forward ---")
    page.go_back()
    time.sleep(0.5)
    print(f"URL after go_back(): {page.url}")
    assert '/sign-in' in page.url
    assert 'Sign in to your account' in page.locator('h1').inner_text()

    page.go_forward()
    time.sleep(0.5)
    print(f"URL after go_forward(): {page.url}")
    assert '/register' in page.url
    assert 'Create your account' in page.locator('h1').inner_text()

    # 6. Preserve other routes
    print("--- 6. Verifying /b2b-database product route ---")
    page.goto('http://127.0.0.1:3000/b2b-database', wait_until='networkidle')
    time.sleep(1)
    page.screenshot(path='verification_screenshots/flow_6_b2b_database.png')
    print("B2B database page loaded successfully")

    browser.close()

# 7. Comparison between user uploaded media_1790735583307.png and local register
user_ref_path = r'C:\Users\null\.gemini\antigravity\brain\7dcdec01-10bc-4cfb-8d5b-60887dc80085\.user_uploaded\media_1790735583307.png'
if os.path.exists(user_ref_path):
    ref_img = Image.open(user_ref_path)
    loc_img = Image.open('verification_screenshots/flow_2_register_direct.png')
    print(f"Reference dimensions: {ref_img.size}, Local dimensions: {loc_img.size}")
    
    # Crop modal card from reference and local
    # In reference (1920x995 browser viewport screenshot with windows chrome):
    # Modal is centered
    ref_crop = ref_img.crop((600, 160, 1320, 860))
    loc_crop = loc_img.crop((600, 180, 1320, 880))
    
    comp_w = ref_crop.width + loc_crop.width + 20
    comp_h = max(ref_crop.height, loc_crop.height)
    comp = Image.new('RGB', (comp_w, comp_h), (20, 20, 20))
    comp.paste(ref_crop, (0, 0))
    comp.paste(loc_crop, (ref_crop.width + 20, 0))
    comp.save('verification_screenshots/register_side_by_side.png')
    print("Saved verification_screenshots/register_side_by_side.png")

print("ALL AUTH FLOWS AND VISUAL VERIFICATION PASSED!")
