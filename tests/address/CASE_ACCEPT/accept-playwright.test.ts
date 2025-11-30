// CONTRACT

// Required pre-conditions:
//   - validAddresses entry has address.addressLines[0], address.locality, address.postalCode
//   - page /checkout/shipping exists with street, city, postalCode input fields
//   - Submit btn exists and triggers address validation
// Promises:
//   - City and postal code values persist after validation
//   - No navigation occurs (user stays on checkout/shipping page)
//   - Valid address shows enabled "proceed-to-payment-btn" within 3500ms

import { test, expect } from "@playwright/test";
import validAddresses from "./cases_valid.json";

test.describe("Tracer Code: Accept Path (Robust)", () => {
  for (const entry of validAddresses) {
    const { address } = entry;

    test(`Should ACCEPT: ${address.addressLines[0]}`, async ({ page }) => {
      await page.goto("/checkout");

      await page.fill('input[name="street"]', address.addressLines[0]);
      await page.fill('input[name="city"]', address.locality);
      await page.fill('input[name="postalCode"]', address.postalCode);

      await page.click('button[type="submit"]');

      const proceedButton = page.getByTestId("proceed-to-payment-btn");

      await expect(proceedButton).toBeVisible({ timeout: 3500 });
      await expect(proceedButton).toBeEnabled();

      await expect(page.getByText(address.locality)).toBeVisible();
      await expect(page.getByText(address.postalCode)).toBeVisible();
    });
  }
});
