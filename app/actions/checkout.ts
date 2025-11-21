"use server";

import { cookies } from "next/headers";
import { SignJWT } from "jose";
import { Address, Status } from "@/app/(store)/checkout/checkout.types";

const SECRET = new TextEncoder().encode(
  process.env.CHECKOUT_JWT_SECRET || "dev-secret-key"
);
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

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

    const data = await response.json();
    const verdict = data.result?.verdict;
    const action = verdict?.possibleNextAction;

    let status: Status = "CONFIRMED";
    if (action === "FIX") {
      status = "FIX";
    } else if (action === "CONFIRM_ADD_SUBPREMISES") {
      status = "PARTIAL";
    }

    const components = data.result?.address?.addressComponents || [];
    const postalAddress = data.result?.address?.postalAddress;

    const getComponent = (type: string) => {
      const comp = components.find((c: any) => c.componentType === type);
      return comp?.componentName?.text || "";
    };

    let correctedAddress = formData;

    if (status === "CONFIRMED" || status === "PARTIAL") {
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
