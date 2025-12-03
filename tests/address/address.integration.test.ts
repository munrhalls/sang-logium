import { describe, it, expect } from "vitest";
import { submitShippingAction } from "@/app/actions/address/address";
import { Address, ServerResponse } from "@/app/(store)/checkout/checkout.types";

describe("submitShippingAction Live Integration", () => {
  it("hits the real Google API and returns ACCEPT", async () => {
    const validAddress: Address = {
      regionCode: "GB",
      postalCode: "W4 5RA",
      street: "Woodstock Road",
      streetNumber: "28",
      city: "London",
    };

    const result: ServerResponse = await submitShippingAction(validAddress);

    expect(result).toMatchObject({
      status: "ACCEPT",
      address: {
        postalCode: "W4 5RA",
      },
      geocode: {
        latitude: expect.any(Number),
        longitude: expect.any(Number),
      },
      placeId: expect.any(String),
    });
  });
});
