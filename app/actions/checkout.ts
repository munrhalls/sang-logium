"use server";

import { cookies } from "next/headers";
import { SignJWT } from "jose";
import { Address, Status } from "@/app/(store)/checkout/checkout.types";

// workflow with API's (MY WORKFLOW)
// get ALL possible responses from api into file
// mark all variables to track
// mark chain of variables to output
// NOW THE CRITICAL - render that chain so as I code, i can see EVERY VALUE in order clearly
// code out each possible pathway logic to its proper output, while seeing live full feedback from above step

// core idea - determine all possible inputs set, delete all that can be deleted from it but keep 100% coverage of all possible inputs -> use that to generate all possible input types -> get all possible api responses based on input types -> determine proper output per each response -> determine set of variables to track and immediately live render on the "chain sequence path" from <input-response> pair all the way to <input-response-PROPER OUTPUT>

// U P D A T E

// THIS LIKE FUNCTION F (X) -> Y
// F (5 INPUT FIELD VALUES, API REQUEST) -> (API RESPONSE) -> PROCESSING LOGIC -> (FINAL OUTPUT)

// I NEED TO TYPE SOME INPUT - AND IMMEDIATELY SEE OUTPUT - AND THEN CODE THE PROCESSING LOGIC

type ValidationLevel =
  | "CONFIRMED"
  | "UNCONFIRMED_BUT_PLAUSIBLE"
  | "UNCONFIRMED_AND_SUSPICIOUS"
  | "UNRECOGNIZED"
  | "MISSING";

interface FieldResult {
  value: string;
  level: ValidationLevel;
}

interface ValidatedAddress {
  route: FieldResult;
  streetNumber: FieldResult;
  postalCode: FieldResult;
  city: FieldResult;
  country: FieldResult;
}

function extractValidatedFields(rawComponents: any[]): ValidatedAddress {
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

    const validatedFields = extractValidatedFields(
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
