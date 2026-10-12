import { chromium } from 'playwright';
import fs from 'fs';

async function testSection() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await chromium.launch({
    executablePath: fs.existsSync(chromePath) ? chromePath : undefined,
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  
  await page.goto('https://api.explee.com/public/api/docs#tag/autogtm/GET/public/api/v1/autogtm/projects', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const data = await page.evaluate(() => {
    const rawHash = window.location.hash.replace(/^#/, '');
    const candidates = [
      document.getElementById(rawHash),
      document.getElementById('api-1/' + rawHash),
      document.querySelector(`[data-endpoint-id*="${rawHash}"]`),
      document.querySelector(`section[id*="${rawHash}"]`),
      document.querySelector(`[id*="${rawHash}"]`)
    ];

    const match = candidates.find(Boolean);

    return {
      hash: window.location.hash,
      matchFound: !!match,
      matchId: match ? match.id : null,
      matchTag: match ? match.tagName : null,
      matchClass: match ? match.className : null,
      matchScrollHeight: match ? match.scrollHeight : null,
      matchBoundingBox: match ? match.getBoundingClientRect() : null,
      headings: match ? Array.from(match.querySelectorAll('h1, h2, h3, h4')).map(h => ({ tag: h.tagName, text: h.textContent.trim() })) : [],
      buttons: match ? Array.from(match.querySelectorAll('button')).map(b => b.textContent.trim()) : [],
      codeBlocksCount: match ? match.querySelectorAll('pre, code').length : 0
    };
  });

  console.log('Section data:', JSON.stringify(data, null, 2));

  await browser.close();
}

testSection().catch(console.error);
