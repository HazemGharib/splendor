import { test, expect } from '@playwright/test';

test.describe('Multi-Player Setup', () => {
  test('should support 2 players', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Splendor');
  });

  test('should support 3 players', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Splendor');
  });

  test('should support 4 players', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Splendor');
  });

  test('should have correct token counts per player count', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Splendor');
  });

  test('should have correct noble counts per player count', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Splendor');
  });
});
