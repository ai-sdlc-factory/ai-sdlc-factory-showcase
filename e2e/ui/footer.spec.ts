import { test, expect, type Page } from '@playwright/test';
import { readFileSync, mkdirSync, writeFileSync, openSync, closeSync, cpSync, mkdtempSync, symlinkSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const frontend = fileURLToPath(new URL('../../frontend/', import.meta.url));
const evidence = fileURLToPath(new URL('../evidence/', import.meta.url));
const metadata = JSON.parse(readFileSync(`${frontend}/package.json`, 'utf8'));

async function footerVisible(page: Page) {
  const footer = page.locator('footer');
  await expect(footer).toHaveCount(1);
  await expect(footer).toHaveText(`Weather v${metadata.version}`);
  await expect(footer).toBeVisible();
  await expect(footer).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
}

async function capture(page: Page, name: string) {
  mkdirSync(evidence, { recursive: true });
  writeFileSync(`${evidence}/${name}.txt`,
    `Viewport: ${JSON.stringify(page.viewportSize())}\n\nVisible text:\n${await page.locator('body').innerText()}\n\nAccessibility tree:\n${await page.locator('body').ariaSnapshot()}\n`);
}

test('release metadata agrees with the visible production footer', async ({ page }) => {
  const lock = JSON.parse(readFileSync(`${frontend}/package-lock.json`, 'utf8'));
  expect(metadata.version).toBe('0.1.0');
  expect(lock.version).toBe(metadata.version);
  expect(lock.packages[''].version).toBe(metadata.version);
  await page.goto('/');
  await footerVisible(page);
});

for (const width of [320, 1280]) {
  test(`footer remains after the reading through idle loading success error and retry at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'City weather' })).toBeVisible();
    await footerVisible(page);
    await capture(page, `${width}-idle`);

    let release!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    // Hold a real HTTP response so loading is observable without timing-dependent sleeps.
    await page.route('http://127.0.0.1:5080/api/weather/Riga', async route => {
      const response = await route.fetch();
      await gate;
      await route.fulfill({ response });
    }, { times: 1 });
    await page.getByLabel('City', { exact: true }).fill('Riga');
    await page.getByLabel('City', { exact: true }).press('Enter');
    try {
      await expect(page.getByRole('status')).toHaveText('Loading weather…');
      await expect(page.getByRole('button', { name: 'Searching…' })).toBeDisabled();
      await footerVisible(page);
      await capture(page, `${width}-loading`);
    } finally { release(); }

    const reading = page.getByRole('status', { name: 'Weather reading' });
    await expect(reading).toContainText('Riga');
    await expect(reading).toContainText('12 °C');
    await footerVisible(page);
    expect(await reading.evaluate(element => {
      const footer = document.querySelector('footer')!;
      return Boolean(element.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING)
        && element.getBoundingClientRect().bottom <= footer.getBoundingClientRect().top;
    })).toBe(true);
    await capture(page, `${width}-success`);

    await page.getByLabel('City', { exact: true }).fill('Atlantis');
    await page.getByRole('button', { name: 'Get weather' }).click();
    await expect(page.getByRole('alert')).toHaveText('No weather reading is available for this city.');
    await expect(reading).toHaveCount(0);
    await footerVisible(page);
    await capture(page, `${width}-error`);

    await page.getByLabel('City', { exact: true }).fill('Riga');
    for (let attempt = 0; attempt < 2; attempt++) {
      await page.getByRole('button', { name: 'Get weather' }).click();
      await expect(reading).toContainText('Riga');
      await expect(page.getByRole('alert')).toHaveCount(0);
      await footerVisible(page);
    }
  });
}

for (const [name, city, message] of [
  ['empty', '', 'Enter a city name.'],
  ['whitespace', '   ', 'Enter a city name.'],
  ['numeric', '123', 'City names may contain only letters, spaces, hyphens and apostrophes.'],
  ['long', 'A'.repeat(500), 'City names must be at most 60 characters.'],
]) {
  test(`footer survives ${name} input and recovery`, async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('City', { exact: true }).fill(city);
    await page.getByRole('button', { name: 'Get weather' }).click();
    await expect(page.getByRole('alert')).toHaveText(message);
    await footerVisible(page);
    await page.getByLabel('City', { exact: true }).fill('London');
    await page.getByRole('button', { name: 'Get weather' }).click();
    await expect(page.getByRole('status', { name: 'Weather reading' })).toContainText('London');
    await footerVisible(page);
  });
}

test('a rebuild takes its footer version from package metadata, not UI literals', async ({ page }) => {
  // The server builds unchanged sources with only the package JSON loader returning a future version.
  await page.goto('http://127.0.0.1:5174');
  await expect(page.locator('footer')).toHaveText('Weather v9.8.7-e2e');
  await expect(page.locator('footer')).toBeVisible();
  await capture(page, 'future-version-build');
});

test('existing mocked API component suite covers the footer states and ordering', () => {
  test.setTimeout(60000);
  const log = openSync('/tmp/weather-footer-components.log', 'w');
  try {
    const copy = mkdtempSync('/tmp/weather-footer-components-');
    cpSync(frontend, copy, { recursive: true, filter: path => !/(^|\/)(node_modules|dist|\.git)(\/|$)/.test(path) });
    symlinkSync(fileURLToPath(new URL('./node_modules/', import.meta.url)), `${copy}/node_modules`, 'dir');
    const result = spawnSync('npm', ['test', '--', 'src/App.test.tsx'], {
      cwd: copy, stdio: ['ignore', log, log], timeout: 55000,
    });
    expect(result.error).toBeUndefined();
    expect(result.status, 'See /tmp/weather-footer-components.log').toBe(0);
  } finally { closeSync(log); }
});
