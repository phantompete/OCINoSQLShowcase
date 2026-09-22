import { createRequire } from 'node:module';
import { mkdir, writeFile, readFile, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { resolve, extname } from 'node:path';
import assert from 'node:assert/strict';
import { createShowcaseServer } from '../server.mjs';
import { scenarios } from '../fixtures/scenarios.js';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const results = { date: new Date().toISOString(), browser: '', checks: [], screenshots: [], errors: [] };
const evidence = resolve('docs/evidence');
await mkdir(evidence, { recursive: true });
const server = createShowcaseServer();
await new Promise(done => server.listen(0, '127.0.0.1', done));
const origin = `http://127.0.0.1:${server.address().port}`;
const launch = { headless: true };
if (process.env.SHOWCASE_BROWSER) launch.executablePath = process.env.SHOWCASE_BROWSER;
const browser = await chromium.launch(launch);
results.browser = browser.version();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
await context.addInitScript(() => {
  window.__activeTimers = new Set();
  const set = window.setInterval, clear = window.clearInterval;
  window.setInterval = (...args) => { const id = set(...args); window.__activeTimers.add(id); return id; };
  window.clearInterval = id => { window.__activeTimers.delete(id); clear(id); };
});
const page = await context.newPage();
page.on('pageerror', e => results.errors.push(e.message));
await page.route('**/*', route => route.request().url().startsWith(origin) ? route.continue() : route.abort());
const routes = ['overview', 'availability', 'recovery', 'migration', 'observability', 'security', 'patterns/iot', 'patterns/gaming', 'patterns/social'];
async function go(route) { await page.goto(`${origin}/#${route}`); await page.locator('#content > *').first().waitFor(); }
async function check(name, fn) { await fn(); results.checks.push(name); }
async function shot(name, locator) { const file = `${name}.png`; if (locator) await locator.screenshot({ path: resolve(evidence, file), animations: 'disabled' }); else await page.screenshot({ path: resolve(evidence, file), fullPage: true, animations: 'disabled' }); results.screenshots.push(file); }
let baselineServer;
try {
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: width === 1280 ? 900 : 844 });
    for (const route of routes) {
      await go(route);
      await check(`${width}: ${route} renders offline with no page overflow`, async () => {
        assert.equal(await page.locator('#navigation a').count(), 7);
        assert(await page.locator('#navigation svg').count() >= 7);
        assert(await page.locator('#page-references a').count() >= 2);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        assert.equal(await page.locator('#navigation [aria-current="page"]').count(), 1);
      });
      await shot(`nosql-${width}-${route.replace('/', '-')}`);
    }
  }
  await page.setViewportSize({ width: 1280, height: 900 });
  for (const [route, keys] of [['recovery', ['regional', 'export']], ['migration', ['file', 'onprem', 'phased']]]) {
    await go(route);
    for (const key of keys) {
      await page.locator(`#scenario-${key}`).click();
      await check(`${key}: all stages match the fixture and reset`, async () => {
        for (let stage = 0; stage < scenarios[key].stages.length; stage++) {
          assert.equal(await page.locator('.walkthrough').getAttribute('data-stage'), String(stage));
          assert.equal(await page.locator('.stage-description h4').textContent(), scenarios[key].stages[stage].title);
          for (const status of scenarios[key].stages[stage].statuses) assert((await page.locator('.walk-diagram').textContent()).includes(status));
          if (stage < 3) await page.locator('[data-action="next"]').click();
        }
        await shot(`nosql-1280-${key}-final`, page.locator('.walkthrough'));
        await page.locator('[data-action="reset"]').click(); assert.equal(await page.locator('.walkthrough').getAttribute('data-stage'), '0');
      });
    }
  }
  await check('simulation playback, pause and cleanup', async () => {
    await go('recovery'); assert.equal(await page.evaluate(() => window.__activeTimers.size), 0);
    await page.locator('[data-action="play"]').click(); assert.equal(await page.evaluate(() => window.__activeTimers.size), 1);
    await page.waitForFunction(() => document.querySelector('.walkthrough').dataset.stage === '1');
    await page.locator('[data-action="play"]').click(); assert.equal(await page.evaluate(() => window.__activeTimers.size), 0);
    await page.locator('[data-action="play"]').click();
    await page.locator('[data-route="overview"]').click(); await page.waitForFunction(() => location.hash === '#overview');
    assert.equal(await page.evaluate(() => window.__activeTimers.size), 0);
  });
  await check('390px: all scenario stages, workload choices, and security text remain usable', async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const [route, keys] of [['recovery', ['regional', 'export']], ['migration', ['file', 'onprem', 'phased']]]) {
      await go(route);
      for (const key of keys) {
        await page.locator(`#scenario-${key}`).click();
        for (let stage = 0; stage < 4; stage++) {
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${key} ${stage}`);
          if (stage < 3) await page.locator('[data-action="next"]').click();
        }
        await shot(`nosql-390-${key}-final`, page.locator('.walkthrough'));
      }
    }
    for (const module of ['iot', 'gaming', 'social']) {
      await go(`patterns/${module}`);
      const choices = page.locator('[aria-label$="scenarios"] [role="tab"]');
      for (let i = 0; i < await choices.count(); i++) {
        await choices.nth(i).click(); assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      }
      await shot(`nosql-390-${module}-alternate`);
    }
    await go('security');
    assert((await page.locator('.security-layer > div').first().boundingBox()).width > 200);
    assert(await page.locator('.security-layer .card-icon').first().isVisible());
    await page.setViewportSize({ width: 1280, height: 900 });
  });
  await check('workload keyboard selection preserves focus and updates sources/help', async () => {
    await go('patterns/iot'); await page.locator('#workload-iot').focus(); await page.keyboard.press('ArrowRight');
    await page.waitForFunction(() => location.hash === '#patterns/gaming');
    assert.equal(await page.locator(':focus').getAttribute('id'), 'workload-gaming');
    await page.locator('#help-trigger').click(); assert.match(await page.locator('#help-body').textContent(), /Read consistency/);
    await page.keyboard.press('Escape'); assert.equal(await page.locator(':focus').getAttribute('id'), 'help-trigger');
    await page.locator('#consistency-absolute').click(); await page.locator('#story-global').click();
    assert.equal(await page.locator('#consistency-absolute').getAttribute('aria-selected'), 'true');
    assert.match(await page.locator('#story-panel').textContent(), /green/);
    await page.locator('#workload-gaming').focus(); await page.keyboard.press('End');
    await page.waitForFunction(() => location.hash === '#patterns/social');
    await page.locator('[data-fixture="patterns.social.v1"]').waitFor();
    assert.equal(await page.locator(':focus').getAttribute('id'), 'workload-social');
    assert.match(await page.locator('#page-references').textContent(), /security model/);
    await page.keyboard.press('Home'); await page.waitForFunction(() => location.hash === '#patterns/iot');
  });
  await check('all nested workload scenarios and operations selectors', async () => {
    for (const module of ['iot', 'gaming', 'social']) {
      await go(`patterns/${module}`); const buttons = page.locator('[aria-label$="scenarios"] [role="tab"]');
      for (let i = 0; i < await buttons.count(); i++) { await buttons.nth(i).click(); assert(await page.locator('#story-panel pre').textContent()); }
    }
    await go('observability'); await page.locator('#operations-detect').focus(); await page.keyboard.press('End');
    assert.equal(await page.locator('#operations-improve').getAttribute('aria-selected'), 'true');
    await page.keyboard.press('ArrowLeft'); assert.equal(await page.locator('#operations-investigate').getAttribute('aria-selected'), 'true');
  });
  await check('direct, invalid, legacy, reload, and browser history routes', async () => {
    await go('patterns/invalid'); assert.equal(new URL(page.url()).hash, '#patterns/iot');
    await go('gaming'); assert.equal(new URL(page.url()).hash, '#patterns/gaming');
    await page.reload(); await page.locator('#story-panel pre').waitFor(); assert.match(await page.locator('#workload-summary').textContent(), /player/);
    await page.locator('#workload-social').click(); await page.waitForFunction(() => location.hash === '#patterns/social');
    await page.goBack(); assert.equal(new URL(page.url()).hash, '#patterns/gaming');
    await page.goForward(); assert.equal(new URL(page.url()).hash, '#patterns/social');
    await go('unknown'); assert.equal(new URL(page.url()).hash, '#overview');
    await go('patterns'); assert.equal(new URL(page.url()).hash, '#patterns/iot');
  });
  await check('dialog traps focus and restores its opener', async () => {
    await page.locator('#help-trigger').click(); assert.equal(await page.locator('.shell').evaluate(el => el.inert), true);
    await page.keyboard.press('Shift+Tab'); assert.equal(await page.locator(':focus').evaluate(el => el.tagName), 'A');
    await page.keyboard.press('Tab'); assert.equal(await page.locator(':focus').getAttribute('id'), 'help-close');
    await page.keyboard.press('Escape'); assert.equal(await page.locator('.shell').evaluate(el => el.inert), false);
  });
  await check('reduced motion keeps every manual stage and disables animation', async () => {
    await go('recovery'); assert.equal(await page.evaluate(() => window.__activeTimers.size), 0);
    await page.locator('[data-action="play"]').click();
    assert.equal(await page.locator('.walk-diagram').evaluate(el => getComputedStyle(el).animationName), 'none');
    await page.locator('[data-action="reset"]').click();
  });
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: width === 1280 ? 900 : 844 });
    await go('observability');
    for (const option of ['investigate', 'improve']) {
      await page.locator(`#operations-${option}`).click();
      await shot(`nosql-${width}-operations-${option}`, page.locator('#operations-panel'));
    }
    await go('patterns/gaming'); await page.locator('#help-trigger').click();
    await shot(`nosql-${width}-help`, page.locator('.help-dialog'));
    await page.keyboard.press('Escape');
  }
  if (process.env.SHOWCASE_BASELINE) {
    const root = resolve(process.env.SHOWCASE_BASELINE);
    baselineServer = createServer(async (req, res) => {
      try { const file = resolve(root, '.' + (new URL(req.url, 'http://localhost').pathname === '/' ? '/index.html' : new URL(req.url, 'http://localhost').pathname)); if (!file.startsWith(root)) throw Error(); res.setHeader('Content-Type', { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png' }[extname(file)] || 'application/octet-stream'); res.end(await readFile(file)); } catch { res.writeHead(404).end(); }
    });
    await new Promise(done => baselineServer.listen(0, '127.0.0.1', done));
    const baselinePage = await context.newPage();
    await baselinePage.route('https://unpkg.com/**', route => route.fulfill({ path: resolve('assets/lucide.min.js'), contentType: 'text/javascript' }));
    for (const width of [1280, 390]) {
      await baselinePage.setViewportSize({ width, height: width === 1280 ? 900 : 844 });
      for (const route of ['overview', 'recovery', 'patterns']) {
        await baselinePage.goto(`http://127.0.0.1:${baselineServer.address().port}/#${route}`);
        await baselinePage.locator('#content > *').first().waitFor();
        const file = `baseline-${width}-${route}.png`; await baselinePage.screenshot({ path: resolve(evidence, file), fullPage: true, animations: 'disabled' }); results.screenshots.push(file);
      }
    }
  }
  assert.deepEqual(results.errors, []);
  results.status = 'passed';
} catch (error) { results.status = 'failed'; results.failure = error.stack; process.exitCode = 1; }
finally {
  await writeFile(resolve(evidence, 'results.json'), JSON.stringify(results, null, 2));
  await browser.close(); await new Promise(done => server.close(done));
  if (baselineServer) await new Promise(done => baselineServer.close(done));
}
console.log(JSON.stringify(results, null, 2));
