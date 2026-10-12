import { chromium } from 'playwright';
import fs from 'fs';

async function testFullCapture() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await chromium.launch({
    executablePath: fs.existsSync(chromePath) ? chromePath : undefined,
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  
  await page.goto('https://api.explee.com/public/api/docs#tag/autogtm/GET/public/api/v1/autogtm/campaigns', {
    waitUntil: 'domcontentloaded'
  });
  await page.waitForTimeout(2000);

  // Method 1: Isolating the target section and taking native fullPage: true
  const dims = await page.evaluate(() => {
    const rawHash = window.location.hash.replace(/^#/, '');
    const targetSection = document.getElementById('api-1/' + rawHash) || document.getElementById(rawHash);
    if (!targetSection) return { error: 'not found' };

    // Find the container holding the sections
    // In Scalar, each section is wrapped in a block
    let block = targetSection;
    while (block.parentElement && block.parentElement.children.length < 5 && block.parentElement.tagName !== 'MAIN') {
      block = block.parentElement;
    }
    const container = block.parentElement;

    // Hide other blocks
    for (const child of container.children) {
      if (child !== block) {
        child.style.display = 'none';
      }
    }

    // Scroll to top
    window.scrollTo(0, 0);

    return {
      scrollHeight: document.documentElement.scrollHeight,
      sectionHeight: targetSection.scrollHeight,
      sectionWidth: targetSection.scrollWidth
    };
  });

  console.log('Isolated dimensions:', dims);
  await page.waitForTimeout(500);

  await page.screenshot({ path: 'test_campaigns_full.png', fullPage: true });

  const stat = fs.statSync('test_campaigns_full.png');
  const buf = fs.readFileSync('test_campaigns_full.png');
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  console.log(`Saved test_campaigns_full.png: ${width}x${height}, size: ${(stat.size / 1024).toFixed(1)} KB`);

  await browser.close();
}

testFullCapture().catch(console.error);
