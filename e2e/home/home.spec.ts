import { test, expect, type Page } from '@playwright/test';
import { HomePage } from './home.po';

let homePage: HomePage;

test.beforeEach(async ({ page }) => {
  homePage = new HomePage(page);
  await homePage.goto();
});

test('no checklists message displayed', async () => {
  await expect(homePage.noChecklistsMessage).toBeVisible();
});
