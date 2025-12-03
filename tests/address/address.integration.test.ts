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
    expect(result.status).toBe("ACCEPT");
    expect(result.address?.postalCode).toBe("W4 5RA");
    expect(result.geocode).toBeDefined();
    expect(result.placeId).toBeDefined();
  });
});
