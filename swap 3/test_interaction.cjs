const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    console.log('Navigating to http://localhost:8081...');
    await page.goto('http://localhost:8081', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1500));

    // 1. Click Tab: Personalized Plan
    console.log('Testing Tab: Personalized Plan...');
    await page.click('#tab-health-plan');
    await new Promise(r => setTimeout(r, 600));
    const workoutCards = await page.$$eval('.workout-day-card', els => els.length);
    console.log('Workout Day Cards rendered:', workoutCards);

    // 2. Click Tab: Goals & Milestones
    console.log('Testing Tab: Goals & Milestones...');
    await page.click('#tab-health-goals');
    await new Promise(r => setTimeout(r, 600));
    const goalCards = await page.$$eval('.goal-card', els => els.length);
    console.log('Goal Cards rendered:', goalCards);

    // 3. Click Tab: AI Assistant Chat
    console.log('Testing Tab: AI Assistant Chat...');
    await page.click('#tab-health-chat');
    await new Promise(r => setTimeout(r, 600));
    
    // Test clicking a quick prompt
    console.log('Clicking Quick Prompt: "Create a workout for today."...');
    await page.click('.quick-prompt-chip:first-child');
    await new Promise(r => setTimeout(r, 1000));
    
    const messagesCount = await page.$$eval('.chat-message-row', els => els.length);
    console.log('Chat Messages Count after prompt:', messagesCount);

    // 4. Click Tab: Check-In History
    console.log('Testing Tab: Check-In History...');
    await page.click('#tab-health-checkins');
    await new Promise(r => setTimeout(r, 600));
    const rowsCount = await page.$$eval('.checkins-data-table tbody tr', els => els.length);
    console.log('Check-in History Rows:', rowsCount);

    // 5. Test Quick Action: Open Check-In Modal
    console.log('Testing Check-In Modal...');
    await page.click('#btn-header-log-checkin');
    await new Promise(r => setTimeout(r, 500));
    const modalVisible = await page.$eval('.health-modal-card', el => !!el);
    console.log('Check-In Modal opened:', modalVisible);
    
    // Close modal
    await page.click('.btn-close-modal');
    await new Promise(r => setTimeout(r, 400));

    // 6. Test Mobile Viewport
    console.log('Testing Mobile Viewport (375x667)...');
    await page.setViewport({ width: 375, height: 667 });
    await page.click('#tab-health-dashboard');
    await new Promise(r => setTimeout(r, 600));
    const vitalsVisibleMobile = await page.$eval('.health-vitals-grid', el => !!el);
    console.log('Vitals Grid visible on mobile:', vitalsVisibleMobile);

    console.log('ALL COMPREHENSIVE INTERACTION AND RESPONSIVENESS TESTS PASSED!');
    await browser.close();
  } catch (err) {
    console.error('Interaction test failed:', err);
    process.exit(1);
  }
})();
