import { chromium } from 'playwright';
import fs from 'fs';

async function testIsolatedScreenshot() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await chromium.launch({
    executablePath: fs.existsSync(chromePath) ? chromePath : undefined,
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  
  await page.goto('https://api.explee.com/public/api/docs', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('aside, a[href*="#"]', { timeout: 15000 });
  await page.waitForTimeout(2000);

  // Navigate to target
  const targetHash = '#tag/autogtm/GET/public/api/v1/autogtm/projects';
  const link = page.locator(`a[href$="${targetHash}"]`).first();
  await link.click();
  await page.waitForTimeout(1000);

  // Isolate and capture
  const capturedInfo = await page.evaluate((h) => {
    const rawHash = h.replace(/^#/, '');
    const targetSection = document.getElementById('api-1/' + rawHash) || document.getElementById(rawHash);
    if (!targetSection) return { error: 'Target section not found' };

    // Find the block corresponding to this endpoint
    let block = targetSection;
    while (block.parentElement && block.parentElement.tagName !== 'MAIN' && !block.parentElement.className.includes('references-rendered') && block.parentElement.children.length < 5) {
      block = block.parentElement;
    }
    const container = block.parentElement;
    
    // Hide all sibling blocks except target block
    const hidden = [];
    for (const child of container.children) {
      if (child !== block) {
        hidden.push({ el: child, prevDisplay: child.style.display });
        child.style.display = 'none';
      }
    }
    window.scrollTo(0, 0);

    return {
      scrollHeight: document.documentElement.scrollHeight,
      targetSectionHeight: targetSection.scrollHeight,
      hiddenCount: hidden.length
    };
  }, targetHash);

  console.log('Capture info:', capturedInfo);
  await page.waitForTimeout(500);

  await page.screenshot({ path: 'test_isolated_clean.png', fullPage: true });
  console.log('Saved test_isolated_clean.png, size:', fs.statSync('test_isolated_clean.png').size);

  // Check dimensions with node
  const buf = fs.readFileSync('test_isolated_clean.png');
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  console.log('Dimensions:', width, 'x', height);

  await browser.close();
}

testIsolatedScreenshot().catch(console.error);
