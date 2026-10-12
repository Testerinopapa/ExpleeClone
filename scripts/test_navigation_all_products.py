import os
import sys
import time
from playwright.sync_api import sync_playwright

BASE_URL = "http://127.0.0.1:3000"

def test_routes():
    print("Starting Navigation & Routing Validation...")
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
                print(f"Using browser executable: {executable_path}")
                break

        if executable_path:
            browser = p.chromium.launch(executable_path=executable_path, headless=True)
        else:
            browser = p.chromium.launch(channel="chrome", headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        errors = []

        # ---------------------------------------------------------
        # 1. Direct URL Access & Refresh Tests
        # ---------------------------------------------------------
        test_cases = [
            {
                "name": "Outreach Agent (Landing Page)",
                "url": f"{BASE_URL}/",
                "expect_selector": "text=AI agents that find and email your buyers",
                "alt_selector": "text=Outreach Agent",
                "expected_path": "/",
            },
            {
                "name": "Database (B2B Database)",
                "url": f"{BASE_URL}/b2b-database",
                "expect_selector": "text=B2B company database",
                "alt_selector": "text=Search 60M+",
                "expected_path": "/b2b-database",
            },
            {
                "name": "Google Maps Dataset",
                "url": f"{BASE_URL}/gm-dataset",
                "expect_selector": "text=218M+ local businesses",
                "alt_selector": "text=Google Maps Dataset",
                "expected_path": "/gm-dataset",
            },
            {
                "name": "API Docs",
                "url": f"{BASE_URL}/public/api/docs",
                "expect_selector": "text=Introduction",
                "alt_selector": "text=AutoGTM",
                "expected_path": "/public/api/docs",
            },
            {
                "name": "Explorer",
                "url": f"{BASE_URL}/tools/explorer",
                "expect_selector": "text=Company Graph Explorer",
                "alt_selector": "text=Explore and filter the company graph",
                "expected_path": "/tools/explorer",
            },
        ]

        for tc in test_cases:
            print(f"\n[Test Direct Access] {tc['name']} -> {tc['url']}")
            try:
                page.goto(tc['url'], wait_until="networkidle", timeout=15000)
                time.sleep(1)
                
                # Check URL
                current_url = page.url
                print(f"  Loaded URL: {current_url}")
                
                # Check content
                content_found = False
                for sel in [tc['expect_selector'], tc['alt_selector']]:
                    if page.locator(sel).first.is_visible(timeout=3000):
                        print(f"  [PASS] Found expected content: {sel}")
                        content_found = True
                        break
                
                if not content_found:
                    err = f"[FAIL] Content not found for {tc['name']} at {tc['url']}"
                    print(f"  {err}")
                    errors.append(err)
                
                # Test Refresh
                print(f"  Testing page refresh on {tc['url']}...")
                page.reload(wait_until="networkidle", timeout=15000)
                time.sleep(1)
                refreshed_found = False
                for sel in [tc['expect_selector'], tc['alt_selector']]:
                    if page.locator(sel).first.is_visible(timeout=3000):
                        refreshed_found = True
                        break
                if refreshed_found:
                    print(f"  [PASS] Page survived refresh on {tc['name']}")
                else:
                    err = f"[FAIL] Page refresh failed to restore {tc['name']}"
                    print(f"  {err}")
                    errors.append(err)

            except Exception as e:
                err = f"[FAIL] Exception testing {tc['name']}: {e}"
                print(f"  {err}")
                errors.append(err)

        # ---------------------------------------------------------
        # 2. Interactive Dropdown Navigation Tests
        # ---------------------------------------------------------
        print("\n[Test Interactive Dropdown Navigation]")
        try:
            # Start at Landing
            page.goto(f"{BASE_URL}/", wait_until="networkidle")
            time.sleep(1)

            # Click Products button
            print("  Opening Products dropdown on Landing...")
            products_btn = page.locator("button:has-text('Products')").first
            products_btn.click()
            time.sleep(0.5)

            # Navigate to Google Maps Dataset via dropdown
            print("  Clicking 'Google Maps Dataset' in dropdown...")
            gm_item = page.locator("text=Google Maps Dataset").first
            gm_item.click()
            time.sleep(1)

            if "/gm-dataset" in page.url and page.locator("text=218M+ local businesses").first.is_visible():
                print("  [PASS] Successfully navigated to GM Dataset via dropdown!")
            else:
                err = f"[FAIL] Navigation to GM Dataset failed. URL: {page.url}"
                print(f"  {err}")
                errors.append(err)

            # From GM Dataset, open dropdown and click Database
            print("  Opening Products dropdown on GM Dataset...")
            page.locator("button:has-text('Products')").first.click()
            time.sleep(0.5)

            print("  Clicking 'Database' in dropdown...")
            page.locator("text=Database").first.click()
            time.sleep(1)

            if "/b2b-database" in page.url:
                print("  [PASS] Successfully navigated to B2B Database via dropdown!")
            else:
                err = f"[FAIL] Navigation to B2B Database failed. URL: {page.url}"
                print(f"  {err}")
                errors.append(err)

            # From B2B Database, open dropdown and click Explorer
            print("  Opening Products dropdown on B2B Database...")
            page.locator("button:has-text('Products')").first.click()
            time.sleep(0.5)

            print("  Clicking 'Explorer' in dropdown...")
            page.locator("text=Explorer").first.click()
            time.sleep(1)

            if "/tools/explorer" in page.url and page.locator("text=Company Graph Explorer").first.is_visible():
                print("  [PASS] Successfully navigated to Explorer via dropdown!")
            else:
                err = f"[FAIL] Navigation to Explorer failed. URL: {page.url}"
                print(f"  {err}")
                errors.append(err)

            # ---------------------------------------------------------
            # 3. Browser History Back & Forward Navigation Tests
            # ---------------------------------------------------------
            print("\n[Test Browser Back & Forward Navigation]")
            print("  Executing page.go_back() (expecting B2B Database)...")
            page.go_back()
            time.sleep(1)
            if "/b2b-database" in page.url:
                print("  [PASS] Browser back returned to B2B Database!")
            else:
                err = f"[FAIL] Browser back failed. URL: {page.url}"
                print(f"  {err}")
                errors.append(err)

            print("  Executing page.go_back() (expecting GM Dataset)...")
            page.go_back()
            time.sleep(1)
            if "/gm-dataset" in page.url:
                print("  [PASS] Browser back returned to GM Dataset!")
            else:
                err = f"[FAIL] Browser back failed. URL: {page.url}"
                print(f"  {err}")
                errors.append(err)

            print("  Executing page.go_forward() (expecting B2B Database)...")
            page.go_forward()
            time.sleep(1)
            if "/b2b-database" in page.url:
                print("  [PASS] Browser forward returned to B2B Database!")
            else:
                err = f"[FAIL] Browser forward failed. URL: {page.url}"
                print(f"  {err}")
                errors.append(err)

        except Exception as e:
            err = f"[FAIL] Dropdown/History exception: {e}"
            print(f"  {err}")
            errors.append(err)

        browser.close()

        print("\n================ SUMMARY ================")
        if errors:
            print(f"FAILED with {len(errors)} error(s):")
            for e in errors:
                print(f"  - {e}")
            sys.exit(1)
        else:
            print("ALL 5 PRODUCTS ROUTING AND NAVIGATION TESTS PASSED SUCCESSFULLY!")
            sys.exit(0)

if __name__ == "__main__":
    test_routes()
