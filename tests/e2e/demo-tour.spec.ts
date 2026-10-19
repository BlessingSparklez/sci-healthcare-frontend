import { expect, test } from '@playwright/test';

import { CLINIC, FUNDER } from './fixtures';
import { mockBackend, useMockWallet } from './helpers';

/**
 * Guided demo tour: offered once, stepped through, and remembered.
 *
 * The prompt is a dismissible card, not an overlay that opens by itself, so
 * it never blocks the directory. Completion and dismissal both persist in
 * localStorage.
 */

const PROMPT = 'New here? Take the demo tour';

test.beforeEach(async ({ page }) => {
  await useMockWallet(page, FUNDER);
  await mockBackend(page, { provider: CLINIC });
});

test('tour can be stepped through and is remembered', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText(PROMPT)).toBeVisible();

  await page.getByRole('button', { name: 'Take the tour' }).click();
  const dialog = page.getByRole('dialog');

  await expect(dialog.getByText('Get test USDC')).toBeVisible();
  await dialog.getByRole('button', { name: 'Next' }).click();
  await expect(dialog.getByText('Fund care for a clinic')).toBeVisible();
  await dialog.getByRole('button', { name: 'Next' }).click();
  await expect(dialog.getByText('Follow the voucher')).toBeVisible();
  await dialog.getByRole('button', { name: 'Finish' }).click();

  await expect(page.getByText(PROMPT)).toHaveCount(0);

  // Remembered across a reload.
  await page.reload();
  await expect(page.getByText('Verified clinics')).toBeVisible();
  await expect(page.getByText(PROMPT)).toHaveCount(0);
});

test('tour can be dismissed and stays dismissed', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText(PROMPT)).toBeVisible();

  await page.getByRole('button', { name: 'Dismiss the demo tour' }).click();
  await expect(page.getByText(PROMPT)).toHaveCount(0);

  await page.reload();
  await expect(page.getByText('Verified clinics')).toBeVisible();
  await expect(page.getByText(PROMPT)).toHaveCount(0);
});
