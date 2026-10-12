import os
import sys
import time
from playwright.sync_api import sync_playwright

BASE_URL = "http://127.0.0.1:3000"

def run_tests():
    print("=== Testing Google Maps Country Detail Experience ===")
    
    with sync_playwright() as p:
        chrome_paths = [
            r"C:\Program Files\Google\Chrome\Application\chrome.exe",
            r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
            r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
            r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
        ]
        executable_path = None
        for pth in chrome_paths:
            if os.path.exists(pth):
                executable_path = pth
                print(f"Using browser: {executable_path}")
                break

        browser = p.chromium.launch(executable_path=executable_path, headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        errors = []

        test_countries = [
            {
                "name": "India",
                "slug": "india",
                "expected_city": "Bengaluru",
                "expected_city_count": "678K+",
                "expected_category": "Hindu temple",
            },
            {
                "name": "Brazil",
                "slug": "brazil",
                "expected_city": "São Paulo",
                "expected_city_count": "742K+",
                "expected_category": "Restaurante",
            },
            {
                "name": "United States",
                "slug": "united-states",
                "expected_city": "New York, NY",
                "expected_city_count": "512K+",
                "expected_category": "Restaurant",
            },
            {
                "name": "Germany",
                "slug": "germany",
                "expected_city": "Berlin",
                "expected_city_count": "394K+",
                "expected_category": "Arzt",
            },
            {
                "name": "Japan",
                "slug": "japan",
                "expected_city": "Tokyo",
                "expected_city_count": "890K+",
                "expected_category": "Convenience store",
            },
        ]

        # -------------------------------------------------------------
        # Part 1: Click from /gm-dataset -> country detail -> Back
        # -------------------------------------------------------------
        print("\n--- Part 1: Grid click navigation, content validation & Back navigation ---")
        for tc in test_countries:
            print(f"\n[Testing {tc['name']}]")
            # 1. Start at /gm-dataset
            page.goto(f"{BASE_URL}/gm-dataset", wait_until="networkidle")
            time.sleep(0.5)

            # 2. Click the country card
            country_card = page.locator(f"a[href='/gm-dataset/locations/{tc['slug']}']").first
            if not country_card.is_visible():
                # Try clicking View all countries if not in first 21
                view_all_btn = page.locator("text=View all 244 countries").first
                if view_all_btn.is_visible():
                    view_all_btn.click()
                    time.sleep(0.5)
            
            if not country_card.is_visible():
                err = f"Country card for {tc['name']} not visible on /gm-dataset"
                print(f"  [FAIL] {err}")
                errors.append(err)
                continue

            print(f"  Clicking card for {tc['name']}...")
            country_card.click()
            time.sleep(1)

            # 3. Verify URL
            expected_url = f"{BASE_URL}/gm-dataset/locations/{tc['slug']}"
            if expected_url in page.url:
                print(f"  [PASS] URL updated to {page.url}")
            else:
                err = f"URL mismatch: expected {expected_url}, got {page.url}"
                print(f"  [FAIL] {err}")
                errors.append(err)

            # 4. Verify Heading
            heading_white = page.locator("text=Complete coverage across").first
            heading_gradient = page.locator(f"text=all cities & categories in {tc['name']}").first
            if heading_white.is_visible() and heading_gradient.is_visible():
                print(f"  [PASS] Heading correctly displays 'Complete coverage across all cities & categories in {tc['name']}'")
            else:
                err = f"Heading mismatch for {tc['name']}"
                print(f"  [FAIL] {err}")
                errors.append(err)

            # 5. Verify Left Panel: Top 10 Cities
            cities_heading = page.locator("text=Top 10 Cities by place Count").first
            expected_city_el = page.locator(f"text={tc['expected_city']}").first
            expected_count_el = page.locator(f"text={tc['expected_city_count']}").first
            if cities_heading.is_visible() and expected_city_el.is_visible() and expected_count_el.is_visible():
                print(f"  [PASS] Top 10 Cities correctly shows {tc['expected_city']} with {tc['expected_city_count']}")
            else:
                err = f"Top 10 cities data missing for {tc['name']} (expected {tc['expected_city']} {tc['expected_city_count']})"
                print(f"  [FAIL] {err}")
                errors.append(err)

            # 6. Verify Right Panel: Top 15 Categories & Treemap
            cat_heading = page.locator("text=Top 15 Categories by place Count").first
            expected_cat_el = page.locator(f"text={tc['expected_category']}").first
            if cat_heading.is_visible() and expected_cat_el.is_visible():
                print(f"  [PASS] Top 15 Categories treemap contains '{tc['expected_category']}'")
            else:
                err = f"Categories treemap missing '{tc['expected_category']}' for {tc['name']}"
                print(f"  [FAIL] {err}")
                errors.append(err)

            # 7. Test Refresh on country route
            print(f"  Reloading page to test direct refresh on {expected_url}...")
            page.reload(wait_until="networkidle")
            time.sleep(0.5)
            if heading_gradient.is_visible() and expected_city_el.is_visible():
                print(f"  [PASS] Country page successfully persisted after refresh!")
            else:
                err = f"Page refresh failed for {tc['name']}"
                print(f"  [FAIL] {err}")
                errors.append(err)

            # 8. Test Browser Back navigation
            print("  Testing browser Back navigation...")
            page.go_back(wait_until="networkidle")
            time.sleep(0.5)
            if "/gm-dataset" in page.url and "/locations/" not in page.url:
                print(f"  [PASS] Browser back returned to /gm-dataset!")
            else:
                err = f"Browser back failed, current URL: {page.url}"
                print(f"  [FAIL] {err}")
                errors.append(err)

        # -------------------------------------------------------------
        # Part 2: Direct URL navigation test
        # -------------------------------------------------------------
        print("\n--- Part 2: Direct URL access tests ---")
        for tc in test_countries:
            direct_url = f"{BASE_URL}/gm-dataset/locations/{tc['slug']}"
            print(f"Direct entry: {direct_url}")
            page.goto(direct_url, wait_until="networkidle")
            time.sleep(0.5)
            if page.locator(f"text=all cities & categories in {tc['name']}").first.is_visible():
                print(f"  [PASS] Direct URL load for {tc['name']} rendered successfully.")
            else:
                err = f"Direct load failed for {tc['name']}"
                print(f"  [FAIL] {err}")
                errors.append(err)

        # -------------------------------------------------------------
        # Part 3: Unknown / Invalid country route test
        # -------------------------------------------------------------
        print("\n--- Part 3: Invalid slug handling ---")
        invalid_url = f"{BASE_URL}/gm-dataset/locations/not-a-real-country"
        page.goto(invalid_url, wait_until="networkidle")
        time.sleep(0.5)
        if page.locator("text=Country Not Found").first.is_visible() or page.locator("text=404").first.is_visible():
            print("  [PASS] Unknown country slug cleanly handled with not found view!")
        else:
            err = "Invalid slug did not show not found view"
            print(f"  [FAIL] {err}")
            errors.append(err)

        browser.close()

        print("\n================ SUMMARY ================")
        if errors:
            print(f"Validation FAILED with {len(errors)} error(s):")
            for e in errors:
                print(f"  - {e}")
            sys.exit(1)
        else:
            print("ALL COUNTRY DETAIL ROUTING & INTERACTIVE TESTS PASSED!")
            sys.exit(0)

if __name__ == "__main__":
    run_tests()
