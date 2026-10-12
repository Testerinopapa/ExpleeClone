import { chromium } from 'playwright';
import fs from 'fs';

async function testSectionIsolation() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await chromium.launch({
    executablePath: fs.existsSync(chromePath) ? chromePath : undefined,
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  
  await page.goto('https://api.explee.com/public/api/docs', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('aside, a[href*="#"]', { timeout: 15000 });
  await page.waitForTimeout(2000);

  // Navigate to an autogtm endpoint
  const targetHash = '#tag/autogtm/GET/public/api/v1/autogtm/projects';
  const link = page.locator(`a[href$="${targetHash}"]`).first();
  await link.click();
  await page.waitForTimeout(1000);

  const res = await page.evaluate((h) => {
    const rawHash = h.replace(/^#/, '');
    const targetSection = document.getElementById('api-1/' + rawHash) || document.getElementById(rawHash);
    if (!targetSection) return { error: 'Target section not found' };

    // Find the section wrapper that is a child of the main content column
    let block = targetSection;
    while (block.parentElement && !block.parentElement.className.includes('references') && block.parentElement.tagName !== 'MAIN' && block.parentElement !== document.body) {
      if (block.parentElement.children.length > 5) break;
      block = block.parentElement;
    }

    const container = block.parentElement;
    const totalBlocks = container ? container.children.length : 0;

    return {
      blockTag: block.tagName,
      blockClass: block.className,
      containerTag: container ? container.tagName : null,
      containerClass: container ? container.className : null,
      totalBlocks
    };
  }, targetHash);

  console.log('DOM isolation info:', res);

  await browser.close();
}

testSectionIsolation().catch(console.error);
