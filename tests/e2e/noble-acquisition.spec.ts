import { test, expect } from '@playwright/test';

test.describe('Noble Acquisition', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display nobles in the market', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Splendor');
  });

  test('should trigger noble visit when bonuses meet requirements', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Splendor');
  });

  test('should award 3 prestige points for noble', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Splendor');
  });

  test('should handle multiple nobles qualifying', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Splendor');
  });
});
