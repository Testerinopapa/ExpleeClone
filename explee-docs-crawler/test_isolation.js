import { chromium } from 'playwright';
import fs from 'fs';

async function testIsolation() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await chromium.launch({
    executablePath: fs.existsSync(chromePath) ? chromePath : undefined,
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  
  const targetHash = '#tag/autogtm/GET/public/api/v1/autogtm/projects';
  await page.goto('https://api.explee.com/public/api/docs' + targetHash, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // Check the DOM structure of sections
  const info = await page.evaluate((h) => {
    const rawHash = h.replace(/^#/, '');
    const target = document.getElementById('api-1/' + rawHash) || document.getElementById(rawHash);
    if (!target) return { found: false };

    // Find parent container that holds all sections
    const parent = target.parentElement;
    const allSections = Array.from(parent.children);

    return {
      found: true,
      parentTag: parent.tagName,
      parentClass: parent.className,
      totalSiblingSections: allSections.length,
      targetTag: target.tagName,
      targetId: target.id,
      targetScrollHeight: target.scrollHeight,
      targetBoundingBox: target.getBoundingClientRect()
    };
  }, targetHash);

  console.log('Section Info:', JSON.stringify(info, null, 2));

  // Now let's test isolating the target section
  await page.evaluate((h) => {
    const rawHash = h.replace(/^#/, '');
    const target = document.getElementById('api-1/' + rawHash) || document.getElementById(rawHash);
    if (!target) return;

    // Store original styles to restore if needed
    window.__hiddenElements = [];
    const parent = target.parentElement;
    for (const child of parent.children) {
      if (child !== target && child.tagName === target.tagName) {
        window.__hiddenElements.push({ el: child, prevDisplay: child.style.display });
        child.style.display = 'none';
      }
    }
    // Also scroll target into view / window to top
    window.scrollTo(0, 0);
  }, targetHash);

  await page.waitForTimeout(500);

  const isolatedDims = await page.evaluate(() => {
    return {
      bodyHeight: document.body.scrollHeight,
      docHeight: document.documentElement.scrollHeight,
      scrollY: window.scrollY
    };
  });
  console.log('Isolated Dims:', isolatedDims);

  await page.screenshot({ path: 'test_isolated_endpoint.png', fullPage: true });
  console.log('Saved test_isolated_endpoint.png, size:', fs.statSync('test_isolated_endpoint.png').size);

  await browser.close();
}

testIsolation().catch(console.error);
