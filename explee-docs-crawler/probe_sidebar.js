import { chromium } from 'playwright';
import fs from 'fs';

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await chromium.launch({
    executablePath: fs.existsSync(chromePath) ? chromePath : undefined,
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto('https://api.explee.com/public/api/docs', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Inspect the first few anchors in detail
  const details = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('aside a[href*="#"], [class*="sidebar"] a[href*="#"]'));
    return anchors.slice(0, 5).map(a => ({
      href: a.getAttribute('href'),
      outerHTML: a.outerHTML.slice(0, 300),
      children: Array.from(a.children).map(c => ({
        tag: c.tagName,
        cls: c.className,
        text: c.textContent.trim()
      }))
    }));
  });

  console.log('Sidebar Anchor Details:', JSON.stringify(details, null, 2));

  // Now test navigation to an autogtm endpoint
  const targetHash = '#tag/autogtm/GET/public/api/v1/autogtm/projects';
  console.log(`Setting location.hash = ${targetHash}...`);
  await page.evaluate((h) => { location.hash = h; }, targetHash);
  await page.waitForTimeout(1500);

  // Check what changed in the DOM
  const afterNav = await page.evaluate((h) => {
    // Look for active sidebar item
    const active = document.querySelector('[aria-current="true"], .sidebar-item--active, [class*="active"]');
    
    // Look for the target content section
    // In Scalar, sections often have id matching the hash without '#' or with 'api-1/' or similar
    const cleanHash = h.replace(/^#/, '');
    const section1 = document.getElementById(cleanHash);
    const section2 = document.getElementById('api-1/' + cleanHash);
    const section3 = document.querySelector(`[data-endpoint-id*="${cleanHash}"]`);

    // Heading elements currently visible or in DOM
    const headings = Array.from(document.querySelectorAll('h1, h2, h3')).map(el => ({
      tag: el.tagName,
      text: el.textContent.trim(),
      id: el.id,
      rect: el.getBoundingClientRect()
    })).filter(h => h.rect.top >= 0 && h.rect.top < 1000);

    return {
      activeSidebarText: active ? active.textContent.trim() : null,
      activeSidebarHref: active ? active.getAttribute('href') : null,
      hasSection1: !!section1,
      hasSection2: !!section2,
      hasSection3: !!section3,
      section2Tag: section2 ? section2.tagName : null,
      section2Classes: section2 ? section2.className : null,
      section2Rect: section2 ? section2.getBoundingClientRect() : null,
      visibleHeadings: headings
    };
  }, targetHash);

  console.log('After Nav State:', JSON.stringify(afterNav, null, 2));

  await browser.close();
}

main().catch(console.error);
