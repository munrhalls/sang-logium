import { describe, it, expect, vi, beforeAll } from "vitest";
import { submitShippingAction } from "./address";

const MOCK_GOOGLE_SUCCESS = {
  result: {
    verdict: {
      addressComplete: true,
      inputGranularity: "PREMISE",
      validationGranularity: "PREMISE",
      hasReplacedComponents: false,
      hasSpellCorrectedComponents: false,
    },
    address: {
      addressComponents: [
        { componentType: "route", componentName: { text: "Main St" } },
        { componentType: "street_number", componentName: { text: "123" } },
        { componentType: "locality", componentName: { text: "New York" } },
        { componentType: "postal_code", componentName: { text: "10001" } },
      ],
      postalAddress: { regionCode: "US" },
    },
  },
};

describe("submitShippingAction - ACCEPT case", () => {
  beforeAll(() => {
    process.env.GOOGLE_MAPS_API_KEY = "TEST_KEY";
  });

  it("returns ACCEPT status when Google verdict is valid", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      json: async () => MOCK_GOOGLE_SUCCESS,
    } as Response);

    const input = {
      street: "123 Main St",
      streetNumber: "",
      city: "New York",
      postalCode: "10001",
      regionCode: "US",
    };

    const result = await submitShippingAction(input);

    expect(result.status).toBe("ACCEPT");
  });
});
