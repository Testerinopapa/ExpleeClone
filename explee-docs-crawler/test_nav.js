import { chromium } from 'playwright';
import fs from 'fs';

async function testNav() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await chromium.launch({
    executablePath: fs.existsSync(chromePath) ? chromePath : undefined,
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  
  console.log('Opening docs...');
  await page.goto('https://api.explee.com/public/api/docs', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForSelector('aside, .sidebar, a[href*="#"]', { timeout: 15000 });
  await page.waitForTimeout(2000);

  // Test clicking a link
  const targetHash = '#tag/autogtm/GET/public/api/v1/autogtm/projects';
  const link = page.locator(`a[href$="${targetHash}"], a[href*="${targetHash}"]`).first();
  console.log('Found link count:', await link.count());
  if (await link.count() > 0) {
    await link.click();
    await page.waitForTimeout(1000);
    const navState = await page.evaluate(() => {
      return {
        url: window.location.href,
        hash: window.location.hash,
        title: document.title,
        heading: document.querySelector('h1, h2')?.textContent?.trim()
      };
    });
    console.log('Nav state after click:', navState);
  }

  await browser.close();
}

testNav().catch(console.error);
