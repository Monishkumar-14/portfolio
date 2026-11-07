import { chromium } from 'playwright';

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1534, height: 702 },
  colorScheme: 'dark',
});
const page = await context.newPage();

// Set dark mode preference in localStorage before navigating
await page.addInitScript(() => {
  localStorage.setItem('theme', 'dark');
});

await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });

// Wait for splash screen to finish (it has a ~2.5s animation)
await page.waitForTimeout(5000);

await page.screenshot({ path: 'screenshot-current.png', fullPage: false });
console.log('Screenshot saved to screenshot-current.png');
await browser.close();
