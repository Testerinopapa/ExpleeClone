import { chromium } from 'playwright';
import fs from 'fs';

async function testScreenshot() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await chromium.launch({
    executablePath: fs.existsSync(chromePath) ? chromePath : undefined,
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  
  await page.goto('https://api.explee.com/public/api/docs#tag/autogtm/GET/public/api/v1/autogtm/projects', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // Check body scrollHeight and section scrollHeight
  const dims = await page.evaluate(() => {
    return {
      bodyHeight: document.body.scrollHeight,
      docHeight: document.documentElement.scrollHeight,
      windowInnerHeight: window.innerHeight,
      scrollY: window.scrollY
    };
  });
  console.log('Page dims before scroll:', dims);

  // Let's test the scroll top-to-bottom and back
  await page.evaluate(async () => {
    const total = document.body.scrollHeight;
    const step = 800;
    for (let y = 0; y < total; y += step) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 50));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1000);

  const dimsAfter = await page.evaluate(() => {
    return {
      bodyHeight: document.body.scrollHeight,
      docHeight: document.documentElement.scrollHeight,
      windowInnerHeight: window.innerHeight,
      scrollY: window.scrollY
    };
  });
  console.log('Page dims after scroll:', dimsAfter);

  // Let's take a fullPage screenshot
  await page.screenshot({ path: 'test_full_page.png', fullPage: true });
  const stat = fs.statSync('test_full_page.png');
  console.log('Screenshot saved, file size:', stat.size);

  await browser.close();
}

testScreenshot().catch(console.error);
