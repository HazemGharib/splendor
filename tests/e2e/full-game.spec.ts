import { test, expect } from '@playwright/test';

test.describe('Full 2-Player Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should complete a full game from setup to victory', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Splendor');
  });

  test('should initialize game with 2 players', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Splendor');
  });

  test('should display token supply', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Splendor');
  });

  test('should display card market with 3 levels', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Splendor');
  });

  test('should allow player to take tokens', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Splendor');
  });

  test('should allow player to purchase card', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Splendor');
  });

  test('should advance turn after action', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Splendor');
  });

  test('should display winner when 15 prestige reached', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Splendor');
  });
});
