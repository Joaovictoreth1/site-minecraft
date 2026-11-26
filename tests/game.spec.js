import { expect, test } from '@playwright/test';

const root = 'http://127.0.0.1:4173/';
const subpath = 'http://127.0.0.1:4174/site-minecraft/';

async function boot(page, url) {
  const errors = [];
  const external = [];
  page.on('console', (event) => {
    if (event.type() === 'error') errors.push(event.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => {
    if (/^https?:/.test(request.url()) && !request.url().startsWith(url)) {
      external.push(request.url());
    }
  });
  await page.goto(url);
  await expect(
    page.getByRole('button', { name: /Jogar Tutorial/ }),
  ).toBeVisible();
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page.locator('#loading-screen')).toBeHidden();
  return { errors, external };
}

test('boots at root and keeps keyboard focus inside the help and achievements dialogs', async ({
  page,
}) => {
  const { errors, external } = await boot(page, root);
  const help = page.getByRole('button', { name: /Como Jogar & Controlos/ });
  await help.focus();
  await page.keyboard.press('Enter');
  const helpDialog = page.getByRole('dialog', { name: /Como Jogar/i });
  await expect(helpDialog).toBeVisible();
  await expect(
    helpDialog.getByRole('button', { name: /Entendido/ }),
  ).toBeFocused();
  await page.keyboard.press('Tab');
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          Boolean(document.activeElement.closest('#help-modal')) ||
          document.activeElement === document.body,
      ),
    )
    .toBe(true);
  await page.keyboard.press('Escape');
  await expect(helpDialog).toBeHidden();
  await expect(help).toBeFocused();

  const achievements = page.getByRole('button', {
    name: /Conquistas Xbox 360/,
  });
  await achievements.click();
  const achievementDialog = page.getByRole('dialog', {
    name: 'CONQUISTAS XBOX 360',
  });
  await expect(achievementDialog).toBeVisible();
  await achievementDialog.getByRole('button', { name: /Voltar/ }).click();
  await expect(achievements).toBeFocused();
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});

test('boots below a project subpath and enters the game', async ({ page }) => {
  const { errors, external } = await boot(page, subpath);
  await expect(page.locator('.splash-text')).toHaveCSS(
    'animation-name',
    'none',
  );
  await page.getByRole('button', { name: /Jogar Tutorial/ }).click();
  await expect(page.locator('#hud')).toBeVisible();
  await page.keyboard.press('e');
  const crafting = page.getByRole('dialog', { name: 'Menu de fabricação' });
  await expect(crafting).toBeVisible();
  await expect(page.locator('#achiev-name')).toHaveText(/Taking Inventory/i);
  const release = crafting.getByRole('button', { name: /Sair/ });
  await expect(release).toBeFocused();
  await release.click();
  await expect(crafting).toBeHidden();
  await page.keyboard.press('p');
  const pause = page.getByRole('dialog', { name: 'JOGO EM PAUSA' });
  await expect(pause).toBeVisible();
  await pause
    .getByRole('button', { name: 'Sair para o Menu Principal' })
    .click();
  await expect(
    page.getByRole('button', { name: /Jogar Tutorial/ }),
  ).toBeFocused();
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});

test('shows an actionable startup error without WebGL', async ({ page }) => {
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return type.includes('webgl')
        ? null
        : getContext.call(this, type, ...args);
    };
  });
  await page.goto(root);
  const message = page.getByRole('heading', {
    name: 'Não foi possível iniciar o jogo',
  });
  await expect(message).toBeVisible();
  await expect(message).toBeFocused();
  await expect(page.getByText(/aceleração gráfica/)).toBeVisible();
  await expect(page.locator('#loader-text')).toBeHidden();

  await page.evaluate(() => {
    window.dispatchEvent(
      new ErrorEvent('error', { message: '<b>Falha</b>', lineno: 10 }),
    );
  });
  await expect(page.locator('#error-log')).toContainText(
    '<b>Falha</b> (Linha 10)',
  );
  await expect(page.locator('#error-log b')).toHaveCount(0);
});

test('shows the startup error if the game bundle cannot load', async ({
  page,
}) => {
  await page.route('**/assets/game-*.js', (route) => route.abort());
  await page.goto(root);
  await expect(
    page.getByRole('heading', { name: 'Não foi possível iniciar o jogo' }),
  ).toBeVisible();
});
