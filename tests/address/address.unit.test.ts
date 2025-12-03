import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { submitShippingAction } from "@/app/actions/address/address";
import { MOCK_GOOGLE_SUCCESS } from "./fixtures";

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
    // TODO 3. ADAPT TO NEW SERVER RESPONSE TYPE
    expect(result.geocode).toBeDefined();
    expect(result.geocode?.location.latitude).toBeTypeOf("number");
    expect(result.geocode?.location.longitude).toBeTypeOf("number");
    expect(result.placeId).toBeTypeOf("string");
    expect(result.errors).toBeUndefined();
  });
});
