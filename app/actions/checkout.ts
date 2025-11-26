"use server";

import { AddressValidationClient } from "@googlemaps/addressvalidation";
import { Address, ServerResponse } from "@/app/(store)/checkout/checkout.types";

const client = new AddressValidationClient({
  fallback: "rest",
});

export async function submitShippingAction(
  input: Address
): Promise<ServerResponse> {
  const request = {
    parent: `projects/${process.env.GOOGLE_CLOUD_PROJECT_ID}`,
    address: {
      regionCode: input.regionCode,
      postalCode: input.postalCode,
      locality: input.city,
      addressLines: [`${input.street} ${input.streetNumber}`],
    },
    enableUspsCass: false,
  };

  try {
    const [response] = await client.validateAddress(request);

    if (!response.result || !response.result.verdict) {
      return {
        status: "FIX",
        errors: { city: "Address validation service unavailable." },
      };
    }

    const verdict = response.result.verdict;
    const address = response.result.address;

    const getComp = (type: string) =>
      address?.addressComponents?.find((c) => c.componentType === type)
        ?.componentName?.text || "";

    const cleanAddress: Address = {
      street: getComp("route") || input.street,
      streetNumber:
        getComp("street_number") || getComp("subpremise") || input.streetNumber,
      city: getComp("locality") || input.city,
      postalCode: getComp("postal_code") || input.postalCode,
      regionCode: address?.postalAddress?.regionCode || input.regionCode,
    };

    if (
      verdict.validationGranularity === "OTHER" ||
      verdict.validationGranularity === "ROUTE"
    ) {
      if (verdict.validationGranularity === "ROUTE") {
        return {
          status: "FIX",
          errors: { streetNumber: "Please include a house/apartment number." },
        };
      }

      return {
        status: "FIX",
        errors: { street: "We could not locate this address." },
      };
    }

    if (address?.missingComponentTypes?.includes("subpremise")) {
      return {
        status: "PARTIAL",
        address: cleanAddress,
        errors: { streetNumber: "Missing apartment or suite number?" },
      };
    }

    if (
      verdict.hasInferredComponents ||
      verdict.hasSpellCorrectedComponents ||
      verdict.hasReplacedComponents
    ) {
      return {
        status: "CONFIRM",
        address: cleanAddress,
      };
    }

    return {
      status: "CONFIRM",
      address: cleanAddress,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "FIX",
      errors: { city: "Validation failed. Please check details." },
    };
  }
}
