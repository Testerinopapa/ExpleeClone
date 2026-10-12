import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse CLI arguments
const args = process.argv.slice(2);
function getArg(flag, defaultValue = null) {
  const idx = args.indexOf(flag);
  if (idx !== -1 && idx + 1 < args.length) return args[idx + 1];
  return defaultValue;
}
const isForce = args.includes('--force');
const filterArg = getArg('--filter', 'autogtm'); // default to autogtm & intro as requested
const startIdx = parseInt(getArg('--start', '1'), 10);
const limitCount = getArg('--limit') ? parseInt(getArg('--limit'), 10) : null;
const onlyIdx = getArg('--only') ? parseInt(getArg('--only'), 10) : null;

// Output paths
const outputDir = path.resolve(__dirname, '../explee-docs-capture');
const pagesDir = path.join(outputDir, 'pages');

if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true });
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/http method:\s*[a-z]+/gi, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  const startTime = Date.now();
  console.log('=====================================================');
  console.log('  Explee API Docs Automated Capture Pipeline');
  console.log('=====================================================');
  console.log(`Output Directory: ${outputDir}`);
  console.log(`Force Overwrite:  ${isForce}`);
  console.log(`Filter Mode:      ${filterArg}`);
  console.log(`Start Index:      ${startIdx}`);
  if (onlyIdx) console.log(`Only Index:       ${onlyIdx}`);
  if (limitCount) console.log(`Limit:            ${limitCount}`);
  console.log('-----------------------------------------------------\n');

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await chromium.launch({
    executablePath: fs.existsSync(chromePath) ? chromePath : undefined,
    headless: true,
    args: ['--disable-dev-shm-usage', '--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();

  console.log('Loading Explee API Documentation...');
  try {
    await page.goto('https://api.explee.com/public/api/docs', {
      waitUntil: 'commit',
      timeout: 60000
    });
  } catch (err) {
    console.error('Initial goto error:', err.message);
  }

  // Wait for Scalar sidebar to render
  console.log('Waiting for Scalar SPA to stabilize...');
  await page.waitForSelector('aside a[href*="#"], [class*="sidebar"] a[href*="#"]', {
    timeout: 30000
  });
  await page.waitForTimeout(2000);

  // 1. Discover all routes from sidebar
  console.log('Discovering sidebar routes...');
  const discoveredRoutes = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('aside a[href*="#"], [class*="sidebar"] a[href*="#"]'));
    const seen = new Set();
    const list = [];

    anchors.forEach(a => {
      const href = a.getAttribute('href') || '';
      if (!href.startsWith('#') || seen.has(href)) return;
      seen.add(href);

      // Extract raw text and clean it
      const fullText = a.textContent.trim().replace(/\s+/g, ' ');
      
      // Method badge detection
      let method = null;
      const methodMatch = fullText.match(/HTTP Method:\s*([A-Z]+)/i) || href.match(/\/(GET|POST|PATCH|PUT|DELETE)\//);
      if (methodMatch) {
        method = methodMatch[1].toUpperCase();
      }

      // Clean label
      let label = fullText.replace(/HTTP Method:\s*[A-Z]+/gi, '').trim();
      if (!label && href.includes('introduction')) label = 'Introduction';
      if (!label && href.endsWith('/autogtm')) label = 'AutoGTM Overview';

      // Endpoint path
      let endpointPath = null;
      if (href.includes('/public/api/')) {
        endpointPath = href.substring(href.indexOf('/public/api/'));
      }

      // Tag
      let tag = 'general';
      const tagMatch = href.match(/#tag\/([^/]+)/);
      if (tagMatch) tag = tagMatch[1];
      else if (href.includes('introduction')) tag = 'description';

      list.push({
        href,
        hash: href,
        label,
        method,
        endpointPath,
        tag,
        url: window.location.origin + window.location.pathname + href
      });
    });

    return list;
  });

  console.log(`Discovered ${discoveredRoutes.length} total unique routes.`);

  // Write routes.json
  const routesManifest = discoveredRoutes.map((r, i) => ({
    index: i + 1,
    ...r
  }));
  fs.writeFileSync(path.join(outputDir, 'routes.json'), JSON.stringify(routesManifest, null, 2));
  console.log('Saved routes.json\n');

  // Filter routes: supports comma-separated tags e.g. "search,contact,agents,tasks,billing,feedback,deduplication"
  let targetRoutes = routesManifest;
  if (filterArg && filterArg !== 'all') {
    const filters = filterArg.toLowerCase().split(',').map(s => s.trim());
    targetRoutes = routesManifest.filter(r => 
      filters.some(f => 
        (r.tag && r.tag.toLowerCase().includes(f)) ||
        (r.hash && r.hash.toLowerCase().includes(f)) ||
        (r.label && r.label.toLowerCase().includes(f))
      )
    );
  }

  if (onlyIdx) {
    targetRoutes = targetRoutes.filter(r => r.index === onlyIdx);
  } else {
    if (startIdx > 1) {
      targetRoutes = targetRoutes.filter(r => r.index >= startIdx);
    }
    if (limitCount) {
      targetRoutes = targetRoutes.slice(0, limitCount);
    }
  }

  console.log(`Targeting ${targetRoutes.length} routes for capture:\n`);

  // Shared report metrics
  const report = {
    startedAt: new Date().toISOString(),
    routesDiscovered: discoveredRoutes.length,
    routesTargeted: targetRoutes.length,
    routesCaptured: 0,
    screenshotSuccesses: 0,
    screenshotFailures: 0,
    jsonCaptureFailures: 0,
    errors: [],
    elapsedMs: 0
  };

  const allPagesMaster = [];

  // Sequential capture loop
  for (let idx = 0; idx < targetRoutes.length; idx++) {
    const route = targetRoutes[idx];
    const prefix = String(route.index).padStart(3, '0');
    const slug = slugify(route.label || route.tag);
    const folderName = `${prefix}-${slug}`;
    const pageFolder = path.join(pagesDir, folderName);
    const jsonPath = path.join(pageFolder, 'capture.json');
    const pngPath = path.join(pageFolder, 'full-page.png');

    const methodDisplay = route.method ? `[${route.method}] ` : '';
    console.log(`[${idx + 1}/${targetRoutes.length}] (Route #${route.index}) ${methodDisplay}${route.label}`);

    // Resume check
    if (!isForce && fs.existsSync(jsonPath) && fs.existsSync(pngPath)) {
      console.log('   ⏭ Skipped (Already captured, use --force to overwrite)');
      try {
        const existingData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        allPagesMaster.push(existingData);
        report.routesCaptured++;
        report.screenshotSuccesses++;
      } catch (e) {}
      continue;
    }

    if (!fs.existsSync(pageFolder)) {
      fs.mkdirSync(pageFolder, { recursive: true });
    }

    // Attempt capture with up to 2 retries
    let success = false;
    let lastError = null;

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        // Navigate via hash or link click
        await page.evaluate((h) => {
          window.location.hash = h;
        }, route.hash);

        // Also attempt clicking sidebar item if present
        const linkSelector = `a[href$="${route.hash}"], a[href*="${route.hash}"]`;
        const link = page.locator(linkSelector).first();
        if (await link.count() > 0) {
          try { await link.click({ timeout: 2000 }); } catch (e) {}
        }

        // Wait for DOM content to settle
        await page.waitForTimeout(1000);

        // Clean hash for DOM ID lookup
        const cleanHash = route.hash.replace(/^#/, '');

        // Extract DOM data, content, visual metrics, typography, parameters
        const captureData = await page.evaluate((info) => {
          const rawHash = info.cleanHash;
          const sectionEl = document.getElementById('api-1/' + rawHash) || 
                            document.getElementById(rawHash) ||
                            document.querySelector(`[id*="${rawHash}"]`) ||
                            document.querySelector('main') ||
                            document.body;

          // Headings
          const headings = Array.from(sectionEl.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => ({
            tag: h.tagName,
            text: h.textContent.trim().replace(/\s+/g, ' '),
            id: h.id || null,
            className: h.className || null
          }));

          // Paragraphs & descriptions
          const paragraphs = Array.from(sectionEl.querySelectorAll('p, .description, [class*="description"]')).map(p => 
            p.textContent.trim().replace(/\s+/g, ' ')
          ).filter(t => t.length > 0 && !t.includes('HTTP Method:'));

          // Parameters & Request attributes
          const parameters = [];
          const paramRows = sectionEl.querySelectorAll('tr, [class*="parameter"], [class*="property"]');
          paramRows.forEach(row => {
            const nameEl = row.querySelector('[class*="name"], code, strong, b');
            const typeEl = row.querySelector('[class*="type"]');
            const descEl = row.querySelector('[class*="description"], td:last-child');
            const reqEl = row.querySelector('[class*="required"], [class*="badge"]');
            if (nameEl) {
              const name = nameEl.textContent.trim();
              if (name && !parameters.some(p => p.name === name)) {
                parameters.push({
                  name,
                  type: typeEl ? typeEl.textContent.trim() : null,
                  required: reqEl ? reqEl.textContent.toLowerCase().includes('required') : false,
                  description: descEl ? descEl.textContent.trim().replace(/\s+/g, ' ') : null
                });
              }
            }
          });

          // Responses
          const responses = [];
          const responseBadges = sectionEl.querySelectorAll('[class*="response"] [class*="status"], [class*="status-code"], button[class*="status"]');
          responseBadges.forEach(badge => {
            const text = badge.textContent.trim();
            const codeMatch = text.match(/\b([1-5]\d\d)\b/);
            if (codeMatch && !responses.some(r => r.statusCode === codeMatch[1])) {
              responses.push({
                statusCode: codeMatch[1],
                rawLabel: text
              });
            }
          });

          // Code blocks & examples
          const codeBlocks = Array.from(sectionEl.querySelectorAll('pre, code')).map(c => ({
            text: c.textContent.slice(0, 2000),
            className: c.className || null
          })).filter(c => c.text.length > 5).slice(0, 10);

          // Tabs
          const tabs = Array.from(sectionEl.querySelectorAll('[role="tab"], button[class*="tab"]')).map(t => ({
            text: t.textContent.trim(),
            active: t.getAttribute('aria-selected') === 'true' || t.className.includes('active')
          }));

          // Buttons (excluding test/send/try)
          const buttons = Array.from(sectionEl.querySelectorAll('button')).map(b => b.textContent.trim()).filter(Boolean);

          // Visual & Layout Geometry
          const rect = sectionEl.getBoundingClientRect();
          const computed = window.getComputedStyle(sectionEl);

          // Computed typography of the main heading
          const mainHeading = sectionEl.querySelector('h1, h2, h3') || sectionEl;
          const hStyle = window.getComputedStyle(mainHeading);

          // SVG assets
          const svgs = Array.from(sectionEl.querySelectorAll('svg')).slice(0, 15).map(svg => ({
            className: svg.getAttribute('class'),
            viewBox: svg.getAttribute('viewBox'),
            width: svg.getAttribute('width') || svg.getBoundingClientRect().width,
            height: svg.getAttribute('height') || svg.getBoundingClientRect().height
          }));

          return {
            documentTitle: document.title,
            pageHeading: headings[0]?.text || info.label,
            headings,
            paragraphs: paragraphs.slice(0, 10),
            parameters,
            responses,
            codeBlocksCount: codeBlocks.length,
            codeBlocksSample: codeBlocks.slice(0, 3),
            tabs,
            buttonsCount: buttons.length,
            buttonsSample: buttons.slice(0, 8),
            svgCount: svgs.length,
            svgsSample: svgs.slice(0, 5),
            visual: {
              geometry: {
                x: Math.round(rect.x),
                y: Math.round(rect.y),
                width: Math.round(rect.width),
                height: Math.round(rect.height)
              },
              typography: {
                fontFamily: hStyle.fontFamily,
                fontSize: hStyle.fontSize,
                fontWeight: hStyle.fontWeight,
                lineHeight: hStyle.lineHeight,
                color: hStyle.color
              },
              styling: {
                background: computed.backgroundColor,
                border: computed.border,
                borderRadius: computed.borderRadius
              }
            }
          };
        }, { cleanHash, label: route.label });

        const fullJson = {
          routeIndex: route.index,
          label: route.label,
          url: route.url,
          hashRoute: route.hash,
          httpMethod: route.method,
          endpointPath: route.endpointPath,
          tag: route.tag,
          capturedAt: new Date().toISOString(),
          ...captureData
        };

        // Write capture.json immediately to disk
        fs.writeFileSync(jsonPath, JSON.stringify(fullJson, null, 2));
        console.log('   ✓ JSON saved');

        // Measure exact section height to capture the full-length endpoint
        const sectionMetrics = await page.evaluate((ch) => {
          const el = document.getElementById('api-1/' + ch) || document.getElementById(ch) || document.querySelector(`[id*="${ch}"]`);
          if (el) {
            el.scrollIntoView({ behavior: 'instant', block: 'start' });
            const rect = el.getBoundingClientRect();
            return {
              height: Math.ceil(Math.max(el.scrollHeight, rect.height))
            };
          }
          return { height: 1000 };
        }, cleanHash);

        const targetViewportHeight = Math.max(1000, Math.min(sectionMetrics.height + 60, 15000));
        await page.setViewportSize({ width: 1440, height: targetViewportHeight });
        await page.waitForTimeout(300);

        // Re-align section to top of viewport
        await page.evaluate((ch) => {
          const el = document.getElementById('api-1/' + ch) || document.getElementById(ch) || document.querySelector(`[id*="${ch}"]`);
          if (el) {
            el.scrollIntoView({ behavior: 'instant', block: 'start' });
          }
        }, cleanHash);
        await page.waitForTimeout(300);

        // Native Playwright screenshot of the full-length endpoint
        await page.screenshot({
          path: pngPath,
          fullPage: false
        });
        console.log(`   ✓ PNG saved (${targetViewportHeight}px height)`);

        allPagesMaster.push(fullJson);
        report.routesCaptured++;
        report.screenshotSuccesses++;
        success = true;
        break;
      } catch (err) {
        lastError = err.message;
        console.warn(`   ⚠ Attempt ${attempt} failed: ${err.message}`);
        await page.waitForTimeout(1000);
      }
    }

    if (!success) {
      report.errors.push({ route: route.hash, error: lastError });
      report.jsonCaptureFailures++;
      report.screenshotFailures++;
      console.error(`   ✗ Route failed after 2 attempts: ${route.hash}`);
    }

    // Force memory release
    if (idx % 10 === 0 && global.gc) {
      global.gc();
    }
  }

  // Calculate elapsed time
  report.elapsedMs = Date.now() - startTime;
  report.elapsedFormatted = `${(report.elapsedMs / 1000).toFixed(1)}s`;
  report.completedAt = new Date().toISOString();

  // Merge all existing pages from pagesDir into allPagesMaster
  const masterMap = new Map();
  if (fs.existsSync(pagesDir)) {
    const folders = fs.readdirSync(pagesDir).filter(f => fs.statSync(path.join(pagesDir, f)).isDirectory());
    for (const f of folders) {
      const cPath = path.join(pagesDir, f, 'capture.json');
      if (fs.existsSync(cPath)) {
        try {
          const doc = JSON.parse(fs.readFileSync(cPath, 'utf8'));
          if (doc && doc.routeIndex) {
            masterMap.set(doc.routeIndex, doc);
          }
        } catch (e) {}
      }
    }
  }

  for (const p of allPagesMaster) {
    if (p && p.routeIndex) {
      masterMap.set(p.routeIndex, p);
    }
  }

  const sortedMaster = Array.from(masterMap.values()).sort((a, b) => (a.routeIndex || 0) - (b.routeIndex || 0));

  fs.writeFileSync(
    path.join(outputDir, 'all-pages-master.json'),
    JSON.stringify(sortedMaster, null, 2)
  );
  console.log(`\nSaved all-pages-master.json (${sortedMaster.length} total pages)`);

  // Write capture-report.json
  fs.writeFileSync(
    path.join(outputDir, 'capture-report.json'),
    JSON.stringify(report, null, 2)
  );
  console.log('Saved capture-report.json');

  // Generate README.md
  const readmeContent = `# Explee Public API Documentation Capture

Automated capture of the Explee Public API documentation site ([https://api.explee.com/public/api/docs](https://api.explee.com/public/api/docs)).

## Summary
- **Routes Discovered:** ${report.routesDiscovered}
- **Routes Captured:** ${report.routesCaptured}
- **Screenshots Succeeded:** ${report.screenshotSuccesses}
- **Failures:** ${report.errors.length}
- **Elapsed Time:** ${report.elapsedFormatted}
- **Date:** ${report.completedAt}

## Output Structure
\`\`\`
explee-docs-capture/
  all-pages-master.json      # Complete combined JSON of all captured pages
  routes.json                # Manifest of all discovered routes & methods
  capture-report.json        # Execution metrics and error logs
  README.md                  # This file
  pages/
    001-introduction/
      full-page.png          # High-fidelity visual screenshot
      capture.json           # Typography, bounding box, parameters, response schema
    002-autogtm-overview/
      full-page.png
      capture.json
    ...
\`\`\`

## Reproduction Commands
To rerun or extend this capture:
\`\`\`bash
# Install dependencies
npm install

# Run default capture (Introduction & AutoGTM)
npm run capture

# Force re-capture all existing files
npm run capture -- --force

# Capture all 64 routes across all tags
npm run capture -- --filter all

# Capture specific route
npm run capture -- --only 3
\`\`\`
`;

  fs.writeFileSync(path.join(outputDir, 'README.md'), readmeContent);
  console.log('Saved README.md\n');

  // Disk usage calculation
  let totalBytes = 0;
  function getFolderSize(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) getFolderSize(full);
      else totalBytes += fs.statSync(full).size;
    }
  }
  getFolderSize(outputDir);
  const diskMb = (totalBytes / (1024 * 1024)).toFixed(2);

  await browser.close();

  console.log('=====================================================');
  console.log('  CAPTURE COMPLETED SUCCESSFULLY');
  console.log('=====================================================');
  console.log(`- Total routes discovered:   ${report.routesDiscovered}`);
  console.log(`- Total routes captured:     ${report.routesCaptured}`);
  console.log(`- Screenshot successes:      ${report.screenshotSuccesses}`);
  console.log(`- Failures:                  ${report.errors.length}`);
  console.log(`- Output folder path:        ${outputDir}`);
  console.log(`- Approximate disk usage:    ${diskMb} MB`);
  console.log(`- Elapsed time:              ${report.elapsedFormatted}`);
  console.log('=====================================================\n');
}

main().catch(err => {
  console.error('Fatal crawler error:', err);
  process.exit(1);
});
