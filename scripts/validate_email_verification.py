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
    # Desktop 1920x1080 viewport matching Windows screenshot
    page = browser.new_page(viewport={'width': 1920, 'height': 1080}, device_scale_factor=1)

    print("--- 1. Direct visit to /register/verification-code ---")
    page.goto('http://127.0.0.1:3000/register/verification-code?app_id=yb37qgq72o4s2o8kao78v', wait_until='networkidle')
    time.sleep(1)

    # Check title
    title = page.title()
    print(f"Page title: {title}")
    assert 'Verify your email' in title, f"Expected 'Verify your email', got {title}"

    # Screenshot default verification page
    page.screenshot(path='verification_screenshots/email_verification_default.png')
    print("Saved verification_screenshots/email_verification_default.png")

    # Check Back button & Badge
    back_btn = page.locator('button[aria-label="Back"]')
    assert back_btn.count() > 0, "Back button not found"

    badge = page.locator('text=Work emails only')
    assert badge.count() > 0, "Work emails only badge not found"

    # Check title & description
    heading = page.locator('h1:has-text("Verify your email")')
    assert heading.count() > 0, "Heading not found"

    # Check inputs (should be 6)
    inputs = page.locator('input[id^="passcode-input-"]')
    print(f"Number of passcode inputs: {inputs.count()}")
    assert inputs.count() == 6, f"Expected 6 inputs, found {inputs.count()}"

    # 2. Type digits into inputs
    print("--- 2. Testing typing digits ---")
    inputs.nth(0).fill('1')
    time.sleep(0.1)
    inputs.nth(1).fill('2')
    time.sleep(0.1)
    inputs.nth(2).fill('3')
    time.sleep(0.1)
    page.screenshot(path='verification_screenshots/email_verification_typed.png')

    # 3. Test Back button navigation
    print("--- 3. Testing Back button ---")
    back_btn.click()
    time.sleep(0.5)
    print(f"URL after Back button: {page.url}")
    assert '/register' in page.url

    # 4. Test Forward navigation
    page.go_forward()
    time.sleep(0.5)
    print(f"URL after go_forward(): {page.url}")
    assert '/verification-code' in page.url

    browser.close()

# 5. Side-by-side comparison with user reference screenshot
user_ref_path = r'C:\Users\null\.gemini\antigravity\brain\7dcdec01-10bc-4cfb-8d5b-60887dc80085\.user_uploaded\media_1790741460809.png'
if os.path.exists(user_ref_path):
    ref_img = Image.open(user_ref_path)
    loc_img = Image.open('verification_screenshots/email_verification_default.png')
    print(f"Ref size: {ref_img.size}, Local size: {loc_img.size}")

    # Crop card area from both:
    # In ref (1920x995 or 1024x576):
    # Let's crop relative card area
    w_ref, h_ref = ref_img.size
    # Center of reference card
    ref_card = ref_img.crop((int(w_ref * 0.31), int(h_ref * 0.18), int(w_ref * 0.69), int(h_ref * 0.84)))

    w_loc, h_loc = loc_img.size
    loc_card = loc_img.crop((int(w_loc * 0.34), int(h_loc * 0.18), int(w_loc * 0.66), int(h_loc * 0.84)))
    loc_card = loc_card.resize(ref_card.size, Image.Resampling.LANCZOS)

    comp_w = ref_card.width + loc_card.width + 10
    comp_h = max(ref_card.height, loc_card.height)
    comp = Image.new('RGB', (comp_w, comp_h), (25, 25, 25))
    comp.paste(ref_card, (0, 0))
    comp.paste(loc_card, (ref_card.width + 10, 0))
    comp.save('verification_screenshots/email_verification_side_by_side.png')
    print("Saved verification_screenshots/email_verification_side_by_side.png")

print("EMAIL VERIFICATION TEST SUITE PASSED!")
