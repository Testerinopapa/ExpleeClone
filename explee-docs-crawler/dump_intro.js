import { chromium } from 'playwright';
import fs from 'fs';

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await chromium.launch({
    executablePath: fs.existsSync(chromePath) ? chromePath : undefined,
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto('https://api.explee.com/public/api/docs#description/introduction', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  const dump = await page.evaluate(() => {
    const introSection = document.getElementById('api-1/description/introduction') || document.querySelector('section');
    const sidebar = document.querySelector('aside, .sidebar');
    
    // Theme colors & CSS variables
    const computedRoot = window.getComputedStyle(document.documentElement);
    const cssVars = {};
    for (let i = 0; i < document.styleSheets.length; i++) {
      try {
        const rules = document.styleSheets[i].cssRules;
        for (let j = 0; j < rules.length; j++) {
          if (rules[j].selectorText === ':root' || rules[j].selectorText === '.light-mode' || rules[j].selectorText?.includes('scalar')) {
            const text = rules[j].cssText;
            const matches = text.match(/--[\w-]+:\s*[^;]+/g);
            if (matches) {
              matches.forEach(m => {
                const [k, v] = m.split(':');
                cssVars[k.trim()] = v.trim();
              });
            }
          }
        }
      } catch (e) {}
    }

    return {
      sectionHTML: introSection ? introSection.outerHTML : null,
      sidebarHTML: sidebar ? sidebar.outerHTML.slice(0, 3000) : null,
      cssVars
    };
  });

  fs.writeFileSync('intro_dump.json', JSON.stringify(dump, null, 2));
  console.log('Saved intro_dump.json! Section length:', dump.sectionHTML?.length);
  await browser.close();
}

main().catch(console.error);
