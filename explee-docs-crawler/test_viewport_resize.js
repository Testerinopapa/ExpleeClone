import { chromium } from 'playwright';
import fs from 'fs';

async function testViewportResize() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await chromium.launch({
    executablePath: fs.existsSync(chromePath) ? chromePath : undefined,
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  
  const targetHash = '#tag/autogtm/PATCH/public/api/v1/autogtm/campaigns/{campaign_id}';
  await page.goto('https://api.explee.com/public/api/docs' + targetHash, {
    waitUntil: 'domcontentloaded'
  });
  await page.waitForTimeout(2000);

  // Measure the target section's exact full height and position
  const metrics = await page.evaluate((h) => {
    const rawHash = h.replace(/^#/, '');
    const section = document.getElementById('api-1/' + rawHash) || document.getElementById(rawHash);
    if (!section) return null;

    // Scroll section into view
    section.scrollIntoView({ behavior: 'instant', block: 'start' });

    const rect = section.getBoundingClientRect();
    return {
      top: rect.top,
      height: Math.ceil(rect.height),
      width: Math.ceil(rect.width),
      scrollHeight: section.scrollHeight
    };
  }, targetHash);

  console.log('Section metrics:', metrics);

  if (metrics) {
    const targetHeight = Math.max(1000, metrics.height + 100);
    console.log(`Setting viewport height to ${targetHeight}...`);
    await page.setViewportSize({ width: 1440, height: targetHeight });
    await page.waitForTimeout(500);

    // Scroll section to top again
    await page.evaluate((h) => {
      const rawHash = h.replace(/^#/, '');
      const section = document.getElementById('api-1/' + rawHash) || document.getElementById(rawHash);
      if (section) section.scrollIntoView({ behavior: 'instant', block: 'start' });
    }, targetHash);
    await page.waitForTimeout(300);

    await page.screenshot({ path: 'test_resized_viewport.png', fullPage: false });

    const stat = fs.statSync('test_resized_viewport.png');
    const buf = fs.readFileSync('test_resized_viewport.png');
    const width = buf.readUInt32BE(16);
    const height = buf.readUInt32BE(20);
    console.log(`Saved test_resized_viewport.png: ${width}x${height}, size: ${(stat.size / 1024).toFixed(1)} KB`);
  }

  await browser.close();
}

testViewportResize().catch(console.error);
