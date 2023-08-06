import { Locator, Page } from '@playwright/test';

export class HomePage {
  page: Page;
  createChecklistButton: Locator;
  noChecklistsMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createChecklistButton = page.getByTestId('create-checklist-button');
    this.noChecklistsMessage = page.getByText('create your first');
  }

  async goto() {
    await this.page.goto('/home');
  }

  async createChecklist() {
    await this.createChecklistButton.click();
  }
}
