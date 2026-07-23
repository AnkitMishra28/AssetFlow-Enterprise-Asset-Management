const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function capture() {
  const outputDir = path.join(__dirname, '../docs/screenshots');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });

  const page = await context.newPage();

  console.log('1. Capturing login.png...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outputDir, 'login.png') });

  console.log('Logging in as Admin (admin@assetflow.com / admin123)...');
  const emailInput = page.locator('input[type="email"]').first();
  const passInput = page.locator('input[type="password"]').first();
  const submitBtn = page.locator('button[type="submit"]').first();

  if (await emailInput.isVisible()) {
    await emailInput.fill('admin@assetflow.com');
    await passInput.fill('admin123');
    await submitBtn.click();
    await page.waitForTimeout(2500);
  }

  const routes = [
    { name: 'dashboard.png', url: 'http://localhost:3000/dashboard' },
    { name: 'assets.png', url: 'http://localhost:3000/dashboard/assets' },
    { name: 'organization-setup.png', url: 'http://localhost:3000/dashboard/organization-setup' },
    { name: 'allocation-transfer.png', url: 'http://localhost:3000/dashboard/allocation-transfer' },
    { name: 'resource-booking.png', url: 'http://localhost:3000/dashboard/resource-booking' },
    { name: 'maintenance.png', url: 'http://localhost:3000/dashboard/maintenance' },
    { name: 'audit.png', url: 'http://localhost:3000/dashboard/audit' },
    { name: 'reports.png', url: 'http://localhost:3000/dashboard/reports' },
    { name: 'notifications.png', url: 'http://localhost:3000/dashboard/notifications' },
    { name: 'scanner.png', url: 'http://localhost:3000/dashboard/scanner' },
  ];

  for (const item of routes) {
    console.log(`Capturing ${item.name}...`);
    await page.goto(item.url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(outputDir, item.name) });
  }

  console.log('Capturing tara-ai.png (open chatbot)...');
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  // Click on floating avatar button to open chatbot
  const avatarButton = page.locator('button:has(img[alt="Tara"])').first();
  if (await avatarButton.isVisible()) {
    await avatarButton.click();
    await page.waitForTimeout(1500);
  }
  await page.screenshot({ path: path.join(outputDir, 'tara-ai.png') });

  await browser.close();
  console.log('ALL 12 SCREENSHOTS CAPTURED SUCCESSFULLY!');
}

capture().catch(err => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
