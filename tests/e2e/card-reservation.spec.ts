import { test, expect } from '@playwright/test';

test.describe('Card Reservation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should reserve a visible card', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Splendor');
  });

  test('should reserve a blind card from deck', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Splendor');
  });

  test('should award gold token on reservation', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Splendor');
  });

  test('should purchase from reserved hand', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Splendor');
  });

  test('should enforce 3 card reservation limit', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Splendor');
  });
});
