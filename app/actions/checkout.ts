"use server";

import { cookies } from "next/headers";
import { SignJWT } from "jose";
import { Address, Status } from "@/app/(store)/checkout/checkout.types";

function extractAddressComponents(rawComponents: AddressComponent[]) {
  const findComp = (types: string[]): AddressComponent | undefined => {
    return rawComponents.find((c) => types.includes(c.componentType));
  };

  const extracted = {
    route: findComp(["route"]),
    streetNumber: findComp(["street_number"]),
    postalCode: findComp(["postal_code"]),
    country: findComp(["country"]),
    city: findComp(["postal_town", "locality"]),
  };

  const missingFields = Object.entries(extracted)
    .filter(([_, value]) => value === undefined)
    .map(([key]) => key);

  return {
    ...extracted,
    missingFields,
    isComplete: missingFields.length === 0,
  };
}

const SECRET = new TextEncoder().encode(
  process.env.CHECKOUT_JWT_SECRET || "dev-secret-key"
);
const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export interface ComponentDetail {
  componentType: string;
  componentName: {
    text: string;
  };
}

interface Verdict {
  possibleNextAction: "FIX" | "CONFIRM_ADD_SUBPREMISES" | "CONFIRM" | "ACCEPT";
}

type AddressComponent = {
  confirmationLevel:
    | "CONFIRMED"
    | "UNCONFIRMED_BUT_PLAUSIBLE"
    | "UNCONFIRMED_AND_SUSPICIOUS"
    | "UNRECOGNIZED";
  componentType:
    | "route"
    | "street_number"
    | "postal_code"
    | "postal_town"
    | "locality"
    | "country";
};

const REQUIRED_TYPES: AddressComponent["componentType"][] = [
  "route",
  "street_number",
  "postal_code",
  "country",
];

const CITY_TYPES = ["locality", "postal_town"];
const VALID_LEVELS = ["CONFIRMED", "UNCONFIRMED_BUT_PLAUSIBLE"];

// TODO first, extract each component type from the google api response
// handle complication (don't overdo it, we just have GB and PL and no other country) - a type can be under more than one form, e.g. postal_code might called postal_town
// confirm we extracted each component by its type, should have 4 components

export async function submitShippingAction(formData: Address): Promise<{
  status: Status;
  correctedAddress: Address;
}> {
  try {
    const validationURL = `https://addressvalidation.googleapis.com/v1:validateAddress?key=${GOOGLE_API_KEY}`;

    const regionCodeMap: Record<string, string> = {
      EN: "GB",
      PL: "PL",
    };

    const requestBody = {
      address: {
        regionCode: regionCodeMap[formData.regionCode] || formData.regionCode,
        locality: formData.city,
        postalCode: formData.postalCode,
        addressLines: [`${formData.street} ${formData.streetNumber}`],
      },
    };

    const response = await fetch(validationURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error("Address validation service failed");
    }
    // TODO this validation logic is very crude - build better one
    // key field - verdict.possibleNextAction
    // from docs:
    // if (verdict.possibleNextAction == FIX)
    //     Prompt the user to fix the address.
    // else if (verdict.possibleNextAction == CONFIRM_ADD_SUBPREMISES)
    //     Prompt the user to add a unit number.
    // else if (verdict.possibleNextAction == CONFIRM)
    //     Confirm with the user that the address is correct.
    // else
    //     Continue with the address returned by the API.
    const data = await response.json();
    const addressComponents = extractAddressComponents(data);
    console.dir(addressComponents, { depth: null });

    const address = data.address;
    const addressComps = address?.addressComponents;
    const unconfirmedComponents = address.unconfirmedComponentTypes;
    const missingComponentTypes = address.missingComponentTypes;
    console.log("Unconfirmed Components:", unconfirmedComponents);
    console.log("Missing Component Types:", missingComponentTypes);
    console.log("Address Components", addressComps);
    // TODO start here, we have the response <data>
    //

    const verdict = data.result?.verdict;
    const action: Verdict["possibleNextAction"] = verdict?.possibleNextAction;

    let status: Status = "CONFIRMED";

    if (action === "CONFIRM_ADD_SUBPREMISES") {
      status = "PARTIAL";
    } else if (action === "CONFIRM") {
      status = "CONFIRM";
    } else {
      status = "FIX";
    }

    const components = data.result?.address?.addressComponents || [];
    const postalAddress = data.result?.address?.postalAddress;

    const getComponent = (type: string) => {
      const comp = components.find(
        (c: ComponentDetail) => c.componentType === type
      );
      return comp?.componentName?.text || "";
    };

    let correctedAddress = formData;

    if (status === "CONFIRM" || status === "PARTIAL") {
      correctedAddress = {
        street: getComponent("route") || formData.street,
        streetNumber: getComponent("street_number") || formData.streetNumber,
        city:
          getComponent("locality") || postalAddress?.locality || formData.city,
        postalCode: postalAddress?.postalCode || formData.postalCode,
        regionCode: postalAddress?.regionCode || formData.regionCode,
      };

      const token = await new SignJWT(correctedAddress)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(SECRET);

      const cookieStore = await cookies();
      cookieStore.set("checkout_context", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
    }

    return { status, correctedAddress };
  } catch (error) {
    console.error("Shipping submission error:", error);
    return { status: "FIX", correctedAddress: formData };
  }
}
