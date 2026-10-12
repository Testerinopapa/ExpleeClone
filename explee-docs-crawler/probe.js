import { chromium } from 'playwright';
import fs from 'fs';

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await chromium.launch({
    executablePath: fs.existsSync(chromePath) ? chromePath : undefined,
    headless: true
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();

  console.log('Navigating to Explee docs...');
  await page.goto('https://api.explee.com/public/api/docs', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  const sidebarLinks = await page.evaluate(() => {
    // Check all anchors
    const anchors = Array.from(document.querySelectorAll('a[href*="#"]'));
    return anchors.map(a => {
      const href = a.getAttribute('href') || '';
      const text = a.textContent.trim().replace(/\s+/g, ' ');
      // Detect method badge if present
      const badge = a.querySelector('[class*="badge"], [class*="method"]')?.textContent?.trim() || null;
      // Get parent or section context
      const section = a.closest('[class*="group"], [class*="section"], li, div')?.querySelector('[class*="title"], [class*="heading"]')?.textContent?.trim() || null;
      return {
        href,
        text,
        badge,
        section,
        className: a.className,
        parentTag: a.parentElement?.tagName
      };
    });
  });

  console.log(`Discovered ${sidebarLinks.length} sidebar anchors:`);
  console.log(JSON.stringify(sidebarLinks.slice(0, 15), null, 2));

  // Also check openapi.json availability
  const openapiStatus = await page.evaluate(async () => {
    try {
      const res = await fetch('/public/api/openapi.json');
      const data = await res.json();
      return {
        ok: res.ok,
        title: data.info?.title,
        version: data.info?.version,
        pathsCount: Object.keys(data.paths || {}).length,
        tags: (data.tags || []).map(t => t.name)
      };
    } catch (e) {
      return { error: e.message };
    }
  });

  console.log('OpenAPI fetch status:', JSON.stringify(openapiStatus, null, 2));

  await browser.close();
}

main().catch(console.error);
