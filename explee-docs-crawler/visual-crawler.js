import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse CLI flags
const args = process.argv.slice(2);
function getArg(flag, defaultValue = null) {
  const idx = args.indexOf(flag);
  if (idx !== -1 && idx + 1 < args.length) return args[idx + 1];
  return defaultValue;
}
const isForce = args.includes('--force');
const isTestMode = args.includes('--test');
const skipScreenshots = args.includes('--skip-screenshot') || args.includes('--skip-screenshots') || args.includes('--no-screenshot') || args.includes('--no-screenshots');
const filterArg = getArg('--filter'); // optional filter
const startIdx = parseInt(getArg('--start', '1'), 10);
const limitCount = getArg('--limit') ? parseInt(getArg('--limit'), 10) : null;
const onlyIdx = getArg('--only') ? parseInt(getArg('--only'), 10) : null;

// Output paths
const outputDir = path.resolve(__dirname, '../explee-visual-capture');
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

// In-browser visual extraction script
const extractVisualDataInBrowser = () => {
  const rawHash = window.location.hash.replace(/^#/, '');
  const activeSection = document.getElementById('api-1/' + rawHash) ||
                        document.getElementById(rawHash) ||
                        document.querySelector(`[id*="${rawHash}"]`) ||
                        document.querySelector('main') ||
                        document.body;

  const sidebar = document.querySelector('aside, .sidebar, [class*="sidebar"]');

  // Helper for stable CSS selector
  function getSelector(el) {
    if (el.id) return `#${el.id}`;
    let path = [];
    let curr = el;
    while (curr && curr.nodeType === Node.ELEMENT_NODE && curr !== document.body && path.length < 5) {
      let selector = curr.tagName.toLowerCase();
      if (curr.className && typeof curr.className === 'string') {
        const classes = curr.className.trim().split(/\s+/).filter(c => c && !c.includes(':') && !c.startsWith('!'));
        if (classes.length > 0) selector += '.' + classes.slice(0, 2).join('.');
      }
      path.unshift(selector);
      curr = curr.parentElement;
    }
    return path.join(' > ');
  }

  // Extract element metrics
  function inspectElement(el) {
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);

    // Skip invisible
    if (rect.width === 0 && rect.height === 0 && style.display === 'none') return null;

    const hasDirectText = Array.from(el.childNodes).some(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 0);
    const shortText = hasDirectText ? el.textContent.trim().slice(0, 80) : null;

    return {
      identity: {
        tag: el.tagName.toLowerCase(),
        id: el.id || null,
        classes: Array.from(el.classList),
        selector: getSelector(el),
        text: shortText
      },
      geometry: {
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        top: Math.round(rect.top),
        right: Math.round(rect.right),
        bottom: Math.round(rect.bottom),
        left: Math.round(rect.left),
        documentX: Math.round(rect.left + window.scrollX),
        documentY: Math.round(rect.top + window.scrollY)
      },
      typography: {
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        fontStyle: style.fontStyle,
        lineHeight: style.lineHeight,
        letterSpacing: style.letterSpacing,
        wordSpacing: style.wordSpacing,
        textAlign: style.textAlign,
        textTransform: style.textTransform,
        textDecoration: style.textDecoration,
        color: style.color,
        whiteSpace: style.whiteSpace
      },
      background: {
        background: style.background,
        backgroundColor: style.backgroundColor,
        backgroundImage: style.backgroundImage !== 'none' ? style.backgroundImage : null,
        backgroundSize: style.backgroundSize,
        backgroundPosition: style.backgroundPosition,
        backgroundRepeat: style.backgroundRepeat
      },
      border: {
        border: style.border,
        borderTop: style.borderTop,
        borderRight: style.borderRight,
        borderBottom: style.borderBottom,
        borderLeft: style.borderLeft,
        borderColor: style.borderColor,
        borderWidth: style.borderWidth,
        borderStyle: style.borderStyle,
        borderRadius: style.borderRadius
      },
      shadowAndEffects: {
        boxShadow: style.boxShadow !== 'none' ? style.boxShadow : null,
        textShadow: style.textShadow !== 'none' ? style.textShadow : null,
        opacity: style.opacity,
        filter: style.filter !== 'none' ? style.filter : null,
        backdropFilter: style.backdropFilter !== 'none' ? style.backdropFilter : null,
        mixBlendMode: style.mixBlendMode,
        clipPath: style.clipPath !== 'none' ? style.clipPath : null
      },
      layout: {
        display: style.display,
        position: style.position,
        zIndex: style.zIndex !== 'auto' ? style.zIndex : null,
        width: style.width,
        height: style.height,
        minWidth: style.minWidth,
        maxWidth: style.maxWidth,
        minHeight: style.minHeight,
        maxHeight: style.maxHeight,
        margin: style.margin,
        marginTop: style.marginTop,
        marginRight: style.marginRight,
        marginBottom: style.marginBottom,
        marginLeft: style.marginLeft,
        padding: style.padding,
        paddingTop: style.paddingTop,
        paddingRight: style.paddingRight,
        paddingBottom: style.paddingBottom,
        paddingLeft: style.paddingLeft,
        gap: style.gap,
        rowGap: style.rowGap,
        columnGap: style.columnGap,
        flexDirection: style.flexDirection,
        flexWrap: style.flexWrap,
        flexGrow: style.flexGrow,
        flexShrink: style.flexShrink,
        flexBasis: style.flexBasis,
        justifyContent: style.justifyContent,
        alignItems: style.alignItems,
        alignContent: style.alignContent,
        gridTemplateColumns: style.gridTemplateColumns !== 'none' ? style.gridTemplateColumns : null,
        gridTemplateRows: style.gridTemplateRows !== 'none' ? style.gridTemplateRows : null,
        gridAutoFlow: style.gridAutoFlow,
        overflow: style.overflow,
        overflowX: style.overflowX,
        overflowY: style.overflowY
      },
      transform: {
        transform: style.transform !== 'none' ? style.transform : null,
        transformOrigin: style.transformOrigin,
        translate: style.translate !== 'none' ? style.translate : null,
        scale: style.scale !== 'none' ? style.scale : null,
        rotate: style.rotate !== 'none' ? style.rotate : null
      },
      transitions: {
        transitionProperty: style.transitionProperty !== 'all' ? style.transitionProperty : null,
        transitionDuration: style.transitionDuration,
        transitionDelay: style.transitionDelay,
        transitionTimingFunction: style.transitionTimingFunction
      },
      animations: {
        animationName: style.animationName !== 'none' ? style.animationName : null,
        animationDuration: style.animationDuration,
        animationDelay: style.animationDelay,
        animationTimingFunction: style.animationTimingFunction,
        animationIterationCount: style.animationIterationCount,
        animationDirection: style.animationDirection,
        animationFillMode: style.animationFillMode,
        animationPlayState: style.animationPlayState
      },
      stateAndInteraction: {
        cursor: style.cursor,
        pointerEvents: style.pointerEvents,
        visibility: style.visibility,
        willChange: style.willChange,
        outline: style.outline,
        outlineColor: style.outlineColor,
        outlineWidth: style.outlineWidth
      }
    };
  }

  // Collect elements from active section and sidebar
  const elements = [];
  const roots = [sidebar, activeSection].filter(Boolean);
  const seenElements = new Set();

  for (const root of roots) {
    const all = [root, ...Array.from(root.querySelectorAll('*'))];
    for (const el of all) {
      if (seenElements.has(el)) continue;
      seenElements.add(el);
      const data = inspectElement(el);
      if (data) elements.push(data);
    }
  }

  // Collect SVGs
  const svgs = Array.from(document.querySelectorAll('svg')).slice(0, 50).map(s => ({
    viewBox: s.getAttribute('viewBox'),
    width: s.getAttribute('width') || s.getBoundingClientRect().width,
    height: s.getAttribute('height') || s.getBoundingClientRect().height,
    className: s.getAttribute('class'),
    outerHTML: s.outerHTML.slice(0, 1000)
  }));

  // Collect Fonts used
  const fonts = Array.from(document.fonts || []).map(f => ({
    family: f.family,
    weight: f.weight,
    status: f.status
  }));

  // Stylesheet URLs
  const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(l => l.href);

  // Sidebar specific summary
  const sidebarRect = sidebar ? sidebar.getBoundingClientRect() : null;
  const sidebarStyle = sidebar ? window.getComputedStyle(sidebar) : null;
  const sidebarData = sidebar ? {
    geometry: {
      width: Math.round(sidebarRect.width),
      height: Math.round(sidebarRect.height),
      position: sidebarStyle.position,
      top: sidebarStyle.top
    },
    styling: {
      background: sidebarStyle.backgroundColor,
      borderRight: sidebarStyle.borderRight
    },
    activeItem: sidebar.querySelector('[aria-current="true"], .sidebar-item--active, [class*="active"]')?.textContent?.trim() || null
  } : null;

  return {
    url: window.location.href,
    hash: window.location.hash,
    documentTitle: document.title,
    sidebar: sidebarData,
    totalElementsCaptured: elements.length,
    elements,
    svgs,
    fonts,
    stylesheets
  };
};

async function main() {
  const startTime = Date.now();
  console.log('=====================================================');
  console.log('  Explee Visual-Only Documentation Crawler');
  console.log('=====================================================');
  console.log(`Output Directory: ${outputDir}`);
  console.log(`Force Overwrite:  ${isForce}`);
  console.log(`Test Mode:        ${isTestMode}`);
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

  console.log('Opening Explee docs...');
  await page.goto('https://api.explee.com/public/api/docs', {
    waitUntil: 'commit',
    timeout: 60000
  });
  await page.waitForSelector('aside a[href*="#"], [class*="sidebar"] a[href*="#"]', {
    timeout: 30000
  });
  await page.waitForTimeout(2000);

  // Discover routes
  console.log('Discovering sidebar routes...');
  const discoveredRoutes = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('aside a[href*="#"], [class*="sidebar"] a[href*="#"]'));
    const seen = new Set();
    const list = [];

    anchors.forEach(a => {
      const href = a.getAttribute('href') || '';
      if (!href.startsWith('#') || seen.has(href)) return;
      seen.add(href);

      const fullText = a.textContent.trim().replace(/\s+/g, ' ');
      let method = null;
      const methodMatch = fullText.match(/HTTP Method:\s*([A-Z]+)/i) || href.match(/\/(GET|POST|PATCH|PUT|DELETE)\//);
      if (methodMatch) method = methodMatch[1].toUpperCase();

      let label = fullText.replace(/HTTP Method:\s*[A-Z]+/gi, '').trim();
      if (!label && href.includes('introduction')) label = 'Introduction';
      if (!label && href.endsWith('/autogtm')) label = 'AutoGTM Overview';

      let tag = 'general';
      const tagMatch = href.match(/#tag\/([^/]+)/);
      if (tagMatch) tag = tagMatch[1];
      else if (href.includes('introduction')) tag = 'description';

      list.push({
        href,
        hash: href,
        label,
        method,
        tag,
        url: window.location.origin + window.location.pathname + href
      });
    });

    return list;
  });

  console.log(`Discovered ${discoveredRoutes.length} total routes.`);

  const routesManifest = discoveredRoutes.map((r, i) => ({
    index: i + 1,
    ...r
  }));

  // Selection logic: Test Mode vs Full Crawl
  let targetRoutes = routesManifest;
  if (isTestMode) {
    console.log('\n--- TEST MODE ACTIVE ---');
    console.log('Selecting: Introduction, 1 GET, 1 POST, 1 PATCH, 1 Long Page...');
    const introRoute = routesManifest.find(r => r.hash.includes('introduction'));
    const getRoute = routesManifest.find(r => r.method === 'GET' && r.hash.includes('projects'));
    const postRoute = routesManifest.find(r => r.method === 'POST' && r.hash.includes('import'));
    const patchRoute = routesManifest.find(r => r.method === 'PATCH' && r.hash.includes('campaigns'));
    const longRoute = routesManifest.find(r => r.method === 'PATCH' && r.hash.includes('campaigns/{campaign_id}'));

    targetRoutes = [introRoute, getRoute, postRoute, patchRoute, longRoute].filter(Boolean);
    // Deduplicate in case patchRoute and longRoute are identical
    targetRoutes = Array.from(new Set(targetRoutes));
  } else if (filterArg && filterArg !== 'all') {
    const filters = filterArg.toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
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
    if (startIdx > 1) targetRoutes = targetRoutes.filter(r => r.index >= startIdx);
    if (limitCount) targetRoutes = targetRoutes.slice(0, limitCount);
  }

  console.log(`Targeting ${targetRoutes.length} routes for visual capture:\n`);

  const report = {
    startedAt: new Date().toISOString(),
    routesDiscovered: discoveredRoutes.length,
    routesTargeted: targetRoutes.length,
    routesCaptured: 0,
    screenshotSuccesses: 0,
    visualJsonSuccesses: 0,
    failures: 0,
    errors: [],
    elapsedMs: 0
  };

  // Design system aggregator
  const designSystem = {
    uniqueFontFamilies: new Set(),
    uniqueFontSizes: new Set(),
    uniqueFontWeights: new Set(),
    uniqueLineHeights: new Set(),
    uniqueColors: new Set(),
    uniqueBackgroundColors: new Set(),
    uniqueBorderColors: new Set(),
    uniqueBorderRadii: new Set(),
    uniqueBoxShadows: new Set(),
    buttonHeights: new Set(),
    sidebarWidths: new Set(),
    methodBadgeStyles: {},
    typographyPatterns: []
  };

  // Seed existing design system tokens if present
  const existingDsPath = path.join(outputDir, 'design-system.json');
  if (fs.existsSync(existingDsPath)) {
    try {
      const existingDs = JSON.parse(fs.readFileSync(existingDsPath, 'utf8'));
      if (existingDs.typography?.fontFamilies) existingDs.typography.fontFamilies.forEach(v => designSystem.uniqueFontFamilies.add(v));
      if (existingDs.typography?.fontSizes) existingDs.typography.fontSizes.forEach(v => designSystem.uniqueFontSizes.add(v));
      if (existingDs.typography?.fontWeights) existingDs.typography.fontWeights.forEach(v => designSystem.uniqueFontWeights.add(v));
      if (existingDs.typography?.lineHeights) existingDs.typography.lineHeights.forEach(v => designSystem.uniqueLineHeights.add(v));
      if (existingDs.colorPalette?.textColors) existingDs.colorPalette.textColors.forEach(v => designSystem.uniqueColors.add(v));
      if (existingDs.colorPalette?.backgroundColors) existingDs.colorPalette.backgroundColors.forEach(v => designSystem.uniqueBackgroundColors.add(v));
      if (existingDs.colorPalette?.borderColors) existingDs.colorPalette.borderColors.forEach(v => designSystem.uniqueBorderColors.add(v));
      if (existingDs.bordersAndRadii) existingDs.bordersAndRadii.forEach(v => designSystem.uniqueBorderRadii.add(v));
      if (existingDs.shadows) existingDs.shadows.forEach(v => designSystem.uniqueBoxShadows.add(v));
      if (existingDs.dimensions?.buttonHeights) existingDs.dimensions.buttonHeights.forEach(v => designSystem.buttonHeights.add(v));
      if (existingDs.dimensions?.sidebarWidths) existingDs.dimensions.sidebarWidths.forEach(v => designSystem.sidebarWidths.add(v));
    } catch (e) {
      console.warn('Could not read existing design-system.json, starting fresh');
    }
  }

  // Sequential visual crawl
  for (let idx = 0; idx < targetRoutes.length; idx++) {
    const route = targetRoutes[idx];
    const prefix = String(route.index).padStart(3, '0');
    const slug = slugify(route.label || route.tag);
    const folderName = `${prefix}-${slug}`;
    const pageFolder = path.join(pagesDir, folderName);
    const jsonPath = path.join(pageFolder, 'visual.json');
    const pngPath = path.join(pageFolder, 'full-page.png');

    const methodDisplay = route.method ? `[${route.method}] ` : '';
    console.log(`[${idx + 1}/${targetRoutes.length}] (Route #${route.index}) ${methodDisplay}${route.label}`);

    // Resume check
    if (!isForce && fs.existsSync(jsonPath)) {
      console.log('   ⏭ Skipped (Already captured, use --force to overwrite)');
      report.routesCaptured++;
      if (fs.existsSync(pngPath)) report.screenshotSuccesses++;
      report.visualJsonSuccesses++;
      continue;
    }

    if (!fs.existsSync(pageFolder)) {
      fs.mkdirSync(pageFolder, { recursive: true });
    }

    let success = false;
    let lastError = null;

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        // 1. Navigate via hash
        await page.evaluate((h) => { window.location.hash = h; }, route.hash);

        // Click sidebar link if present
        const link = page.locator(`a[href$="${route.hash}"], a[href*="${route.hash}"]`).first();
        if (await link.count() > 0) {
          try { await link.click({ timeout: 2000 }); } catch (e) {}
        }
        await page.waitForTimeout(800);

        const cleanHash = route.hash.replace(/^#/, '');

        // 2. Measure section height for full-length viewport expansion
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

        // 3. Progressive scroll through entire section to trigger lazy rendering, then return to top
        await page.evaluate(async (ch) => {
          const el = document.getElementById('api-1/' + ch) || document.getElementById(ch);
          if (el) {
            const top = el.offsetTop || 0;
            const height = el.scrollHeight || 1000;
            for (let y = top; y < top + height; y += 600) {
              window.scrollTo(0, y);
              await new Promise(r => setTimeout(r, 40));
            }
            el.scrollIntoView({ behavior: 'instant', block: 'start' });
          } else {
            window.scrollTo(0, 0);
          }
        }, cleanHash);
        await page.waitForTimeout(400);

        // 4. Handle screenshot: avoid re-capturing if already downloaded in explee-docs-capture or visual capture
        const existingDocsCapturePng = path.join(__dirname, '..', 'explee-docs-capture', 'pages', folderName, 'full-page.png');
        if (fs.existsSync(pngPath)) {
          console.log(`   ⏭ full-page.png already exists (reused without re-downloading)`);
          report.screenshotSuccesses++;
        } else if (fs.existsSync(existingDocsCapturePng)) {
          fs.copyFileSync(existingDocsCapturePng, pngPath);
          console.log(`   ✓ full-page.png copied from explee-docs-capture (avoided re-downloading)`);
          report.screenshotSuccesses++;
        } else if (!skipScreenshots) {
          await page.screenshot({
            path: pngPath,
            fullPage: false
          });
          console.log(`   ✓ full-page.png saved (${targetViewportHeight}px height)`);
          report.screenshotSuccesses++;
        } else {
          console.log(`   ⏭ Screenshot skipped`);
        }

        // 5. Extract detailed per-element visual JSON
        const visualData = await page.evaluate(extractVisualDataInBrowser);
        const finalVisualJson = {
          routeIndex: route.index,
          label: route.label,
          url: route.url,
          hashRoute: route.hash,
          httpMethod: route.method,
          tag: route.tag,
          capturedAt: new Date().toISOString(),
          viewportDimensions: { width: 1440, height: targetViewportHeight },
          ...visualData
        };

        fs.writeFileSync(jsonPath, JSON.stringify(finalVisualJson, null, 2));
        console.log(`   ✓ visual.json saved (${visualData.totalElementsCaptured} elements captured)`);
        report.visualJsonSuccesses++;
        report.routesCaptured++;

        // Aggregate design system values
        for (const el of visualData.elements) {
          if (el.typography.fontFamily) designSystem.uniqueFontFamilies.add(el.typography.fontFamily);
          if (el.typography.fontSize) designSystem.uniqueFontSizes.add(el.typography.fontSize);
          if (el.typography.fontWeight) designSystem.uniqueFontWeights.add(el.typography.fontWeight);
          if (el.typography.lineHeight) designSystem.uniqueLineHeights.add(el.typography.lineHeight);
          if (el.typography.color) designSystem.uniqueColors.add(el.typography.color);
          if (el.background.backgroundColor && el.background.backgroundColor !== 'rgba(0, 0, 0, 0)') {
            designSystem.uniqueBackgroundColors.add(el.background.backgroundColor);
          }
          if (el.border.borderColor && el.border.borderWidth !== '0px') {
            designSystem.uniqueBorderColors.add(el.border.borderColor);
          }
          if (el.border.borderRadius && el.border.borderRadius !== '0px') {
            designSystem.uniqueBorderRadii.add(el.border.borderRadius);
          }
          if (el.shadowAndEffects.boxShadow) designSystem.uniqueBoxShadows.add(el.shadowAndEffects.boxShadow);
          if (el.identity.tag === 'button' && el.geometry.height > 0) {
            designSystem.buttonHeights.add(el.geometry.height);
          }
        }
        if (visualData.sidebar?.geometry?.width) {
          designSystem.sidebarWidths.add(visualData.sidebar.geometry.width);
        }

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
      report.failures++;
      console.error(`   ✗ Route failed: ${route.hash}`);
    }

    if (idx % 10 === 0 && global.gc) global.gc();
  }

  // Finalize Design System
  const serializedDesignSystem = {
    generatedAt: new Date().toISOString(),
    routesSampled: targetRoutes.length,
    typography: {
      fontFamilies: Array.from(designSystem.uniqueFontFamilies),
      fontSizes: Array.from(designSystem.uniqueFontSizes),
      fontWeights: Array.from(designSystem.uniqueFontWeights),
      lineHeights: Array.from(designSystem.uniqueLineHeights),
      colors: Array.from(designSystem.uniqueColors)
    },
    colors: {
      backgroundColors: Array.from(designSystem.uniqueBackgroundColors),
      borderColors: Array.from(designSystem.uniqueBorderColors)
    },
    bordersAndRadii: Array.from(designSystem.uniqueBorderRadii),
    shadows: Array.from(designSystem.uniqueBoxShadows),
    dimensions: {
      buttonHeights: Array.from(designSystem.buttonHeights).sort((a, b) => a - b),
      sidebarWidths: Array.from(designSystem.sidebarWidths)
    }
  };

  fs.writeFileSync(
    path.join(outputDir, 'design-system.json'),
    JSON.stringify(serializedDesignSystem, null, 2)
  );
  console.log('\nSaved design-system.json');

  // Calculate report metrics
  report.elapsedMs = Date.now() - startTime;
  report.elapsedFormatted = `${(report.elapsedMs / 1000).toFixed(1)}s`;
  report.completedAt = new Date().toISOString();

  // Measure total disk usage
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
  report.outputSizeMb = `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`;

  fs.writeFileSync(
    path.join(outputDir, 'capture-report.json'),
    JSON.stringify(report, null, 2)
  );
  console.log('Saved capture-report.json');

  await browser.close();

  console.log('=====================================================');
  console.log('  VISUAL CAPTURE COMPLETED');
  console.log('=====================================================');
  console.log(`- Routes discovered:        ${report.routesDiscovered}`);
  console.log(`- Routes captured:          ${report.routesCaptured}`);
  console.log(`- Screenshots saved:        ${report.screenshotSuccesses}`);
  console.log(`- Visual JSONs saved:       ${report.visualJsonSuccesses}`);
  console.log(`- Failures:                 ${report.failures}`);
  console.log(`- Output folder path:       ${outputDir}`);
  console.log(`- Total output size:        ${report.outputSizeMb}`);
  console.log(`- Elapsed time:             ${report.elapsedFormatted}`);
  console.log('=====================================================\n');
}

main().catch(err => {
  console.error('Fatal visual crawler error:', err);
  process.exit(1);
});
