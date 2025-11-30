// CONTRACT
// PURPOSE - TEST IT WORKS ON VARIOUS OS PLATFORMS AND BROWSERS
// - ANDROID/IOS/MAC OS/WINDOWS/LNUX
// - CHROME, SAFARI, FIREFOX, EDGE, OPERA

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

const shouldRunRealApiTests = process.env.TESTS_WITH_REAL_API === "true";

test.describe("Tracer Code: Accept Path", () => {
  test.skip(
    !shouldRunRealApiTests,
    "Skipping: TESTS_WITH_REAL_API not enabled"
  );

  for (const entry of validAddresses) {
    const { address } = entry;

    test(`Should ACCEPT valid address: ${address.regionCode} ${address.locality} ${address.addressLines[0]}`, async ({
      page,
    }) => {
      await page.goto("/checkout/shipping");

      // Why? Google Address API vs UI
      // E.g.: "Plac Defilad 1" → street: "Plac Defilad", number: "1"
      const fullAddress = address.addressLines[0];
      const lastSpaceIndex = fullAddress.lastIndexOf(" ");
      const street =
        lastSpaceIndex > 0 ? fullAddress.slice(0, lastSpaceIndex) : fullAddress;
      const streetNumber =
        lastSpaceIndex > 0 ? fullAddress.slice(lastSpaceIndex + 1) : "1";

      await page.fill('input[name="street"]', street);
      await page.fill('input[name="streetNumber"]', streetNumber);
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
