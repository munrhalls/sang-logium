import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { submitShippingAction } from "@/app/actions/address/address";

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
        { componentType: "route", componentName: { text: "Woodstock Road" } },
        { componentType: "street_number", componentName: { text: "28" } },
        { componentType: "locality", componentName: { text: "London" } },
        { componentType: "postal_code", componentName: { text: "W4 5RA" } },
      ],
      postalAddress: { regionCode: "GB" },
      geocode: {
        location: {
          latitude: 51.4934,
          longitude: -0.2678,
        },
      },
      placeId: "ChIJdd4hrwug2EcRmSrV3Vo6llI",
    },
  },
};

describe("GOOGLE ADDRESS VALIDATE API - ACCEPT case", () => {
  const originalEnv = process.env;
  beforeAll(() => {
    process.env.GOOGLE_MAPS_API_KEY = "TEST_KEY";
  });
  afterEach(() => {
    vi.restoreAllMocks();
    process.env = originalEnv;
  });

  it("returns ACCEPT status when Google verdict is valid", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      json: async () => MOCK_GOOGLE_SUCCESS,
    } as Response);

    const input = {
      street: "Woodstock Road",
      streetNumber: "28",
      city: "London",
      postalCode: "W4 5RA",
      regionCode: "GB",
    };

    const result = await submitShippingAction(input);

    expect(result.status).toBe("ACCEPT");
    expect(result.address).toEqual({
      street: "Woodstock Road",
      streetNumber: "28",
      city: "London",
      postalCode: "W4 5RA",
      regionCode: "GB",
    });
    expect(result.geocode).toBeDefined();
    expect(result.geocode?.location.latitude).toBeTypeOf("number");
    expect(result.geocode?.location.longitude).toBeTypeOf("number");
    expect(result.placeId).toBeTypeOf("string");
    expect(result.errors).toBeUndefined();
  });
});
