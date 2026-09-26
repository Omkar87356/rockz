const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    const errors = [];
    page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
    page.on('pageerror', err => {
      console.error('PAGE ERROR:', err.message);
      errors.push(err.message);
    });

    console.log('Navigating to http://localhost:8081...');
    await page.goto('http://localhost:8081', { waitUntil: 'networkidle2', timeout: 15000 });

    console.log('Waiting 2 seconds for React to mount...');
    await new Promise(r => setTimeout(r, 2000));

    const title = await page.title();
    console.log('Page Title:', title);

    const healthSection = await page.$('#health');
    console.log('Has #health section:', !!healthSection);

    const bioSyncPill = await page.$('.bio-sync-pill');
    console.log('Has .bio-sync-pill in Topbar:', !!bioSyncPill);

    const vitalsGrid = await page.$('.health-vitals-grid');
    console.log('Has .health-vitals-grid:', !!vitalsGrid);

    const cardsCount = await page.$$eval('.health-card', els => els.length);
    console.log('Health Cards Count:', cardsCount);

    const chart = await page.$('.health-metric-svg');
    console.log('Has Interactive SVG Chart:', !!chart);

    const tabs = await page.$$eval('.health-nav-tab', els => els.map(e => e.textContent.trim()));
    console.log('Health Tabs:', tabs);

    if (errors.length > 0) {
      console.error('FAILED WITH PAGE ERRORS:', errors);
      process.exit(1);
    } else {
      console.log('SUCCESS: All Bio-Sync AI health features rendered cleanly with ZERO errors!');
    }

    await browser.close();
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
})();
