import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
console.log('Navigating to Honeywell...');
await page.goto('https://www.honeywell.com/us/en', { waitUntil: 'domcontentloaded', timeout: 60000 });
// Wait for dynamic content
await page.waitForTimeout(5000);
const html = await page.content();
const fs = await import('node:fs');
fs.writeFileSync('/workspace/migration-work/honeywell-live.html', html);
console.log(`Saved ${html.length} chars to honeywell-live.html`);
await browser.close();
