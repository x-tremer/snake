import { test, expect } from '@playwright/test';

test('page loads with canvas element of correct size', async ({ page }) => {
  await page.goto('/');
  const canvas = await page.locator('#game-canvas');
  await expect(canvas).toBeVisible();
  const size = await canvas.evaluate((el) => ({ width: el.width, height: el.height }));
  expect(size.width).toBe(600);
  expect(size.height).toBe(600);
});

test('keyboard input starts game from menu', async ({ page }) => {
  await page.goto('/');
  const state = await page.evaluate(() => {
    return window.gameState.getState();
  });
  expect(state).toBe('MENU');

  // Press Enter to start 1P
  await page.keyboard.press('Enter');
  await page.waitForTimeout(100);

  const afterState = await page.evaluate(() => {
    return window.gameState.getState();
  });
  expect(afterState).toBe('PLAYING_1P');
});
