"use server";

import { cookies } from "next/headers";
import { SignJWT } from "jose";
import { Address, Status } from "@/app/(store)/checkout/checkout.types";
import {
  ValidatedAddress,
  FieldResult,
  ValidationLevel,
} from "@/app/(store)/checkout/checkout.types";

// Possible inputs from frontend:
// - Full address entered by user
// - Partial address entered by user (missing unit number, missing street number, etc.) - frontend will not allow to send it but it's worth to check for it and return error instantly should that be the case
// - Malformed address (typos, wrong formatting, etc.)
// - Address with suspicious components (e.g., invalid street name, non-existent city, etc.)
// - clearly very bad address (e.g., random strings, gibberish, etc.)
// - address with good looking nonsense e.g. "1234 Imaginary St, Faketown, ZZ 99999"
// - address with one stealthy bad tweak - e.g. some building from london in manchester...
// - Non-existent address

// Risk-averse checkout flow example
// If you want to reduce the risk of failed deliveries, you might customize your logic to prompt your customers more often. For example, rather than use the logic described in the Key purpose section, you could use the following logic.

// Risk-averse checkout flow example - this is the one I choose to implement because audio gear store really doesn't want failed deliveries
// if (verdict.possibleNextAction == FIX or verdict.validationGranularity
// == OTHER or verdict.validationGranularity == ROUTE)
//   Prompt customer to fix their address.
// else if (verdict.possibleNextAction == CONFIRM_ADD_SUBPREMISES)
//   Prompt customer to add a unit number.
// else if (verdict.possibleNextAction == CONFIRM or verdict.validationGranularity
// == PREMISE_PROXIMITY or verdict.hasSpellCorrectedComponents or
// verdict.hasReplacedComponents or verdict.hasInferredComponents)
//   Prompt customer to confirm their address.
// else
//   Proceed with the returned address.

//

function getResponseFields(rawComponents: any[]): ValidatedAddress {
  const map = new Map(rawComponents.map((c) => [c.componentType, c]));

  const get = (...types: string[]): FieldResult => {
    for (const t of types) {
      if (map.has(t)) {
        const comp = map.get(t);
        return {
          value: comp.componentName.text,
          level: comp.confirmationLevel as ValidationLevel,
        };
      }
    }
    return { value: "", level: "MISSING" };
  };

  return {
    route: get("route"),
    streetNumber: get("street_number", "premise"),
    postalCode: get("postal_code"),
    country: get("country"),
    city: get("postal_town", "locality"),
  };
}

const SECRET = new TextEncoder().encode(
  process.env.CHECKOUT_JWT_SECRET || "dev-secret-key"
);
const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export async function submitShippingAction(formData: Address) {
  try {
    const validationURL = `https://addressvalidation.googleapis.com/v1:validateAddress?key=${GOOGLE_API_KEY}`;
    const regionCodeMap: Record<string, string> = { EN: "GB", PL: "PL" };

    const response = await fetch(validationURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address: {
          regionCode: regionCodeMap[formData.regionCode] || formData.regionCode,
          locality: formData.city,
          postalCode: formData.postalCode,
          addressLines: [`${formData.street} ${formData.streetNumber}`],
        },
      }),
    });

    if (!response.ok) throw new Error("Address validation service failed");

    const data = await response.json();

    const validatedFields = getResponseFields(
      data.result?.address?.addressComponents || []
    );

    const ACCEPTED_LEVELS = new Set(["CONFIRMED", "UNCONFIRMED_BUT_PLAUSIBLE"]);

    const isRouteValid = ACCEPTED_LEVELS.has(validatedFields.route.level);
    const isStreetNumValid = ACCEPTED_LEVELS.has(
      validatedFields.streetNumber.level
    );
    const isCityValid = ACCEPTED_LEVELS.has(validatedFields.city.level);
    const isPostalValid = ACCEPTED_LEVELS.has(validatedFields.postalCode.level);

    const isCountryValid = ACCEPTED_LEVELS.has(validatedFields.country.level);

    const isAddressValid =
      isRouteValid &&
      isStreetNumValid &&
      isCityValid &&
      isPostalValid &&
      isCountryValid;

    const status: Status = isAddressValid ? "CONFIRM" : "FIX";

    if (status === "CONFIRM") {
      const cleanAddress: Address = {
        street: validatedFields.route.value,
        streetNumber: validatedFields.streetNumber.value,
        city: validatedFields.city.value,
        postalCode: validatedFields.postalCode.value,
        regionCode: formData.regionCode,
      };

      const token = await new SignJWT(cleanAddress)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(SECRET);

      (await cookies()).set("checkout_context", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      return { status, address: cleanAddress };
    }
    // TODO fix return types
    return { status: status, address: null };
  } catch (error) {
    console.error("Shipping submission error:", error);
    return { status: "FIX", address: null };
  }
}
