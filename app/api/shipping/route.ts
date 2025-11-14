interface AddressLines {
  regionCode: string;
  locality: string;
  addressLines: [string];
}

interface GoogleValidationAPIRequest {
  address: AddressLines;
}

export async function POST(req: Request) {
  const body = await req.json();
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const validationURL = `https://addressvalidation.googleapis.com/v1:validateAddress?key=${apiKey}`;

  const { regionCode, postalCode, street, streetNumber, city } = body;

  const regionCodeMap: Record<string, string> = {
    EN: "GB",
    PL: "PL",
  };

  const validationRequestBody: GoogleValidationAPIRequest = {
    address: {
      regionCode: regionCodeMap[regionCode] || regionCode,
      locality: city,
      addressLines: [`${postalCode} ${street} ${streetNumber}`],
    },
  };

  const validationResponse = await fetch(validationURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validationRequestBody),
  });

  const validationData = await validationResponse.json();

  const verdict = validationData.result?.verdict;
  const action = verdict?.possibleNextAction || "NULL";

  let status: "FIX" | "PARTIAL" | "CONFIRMED";
  if (action === "FIX") {
    status = "FIX";
  } else if (action === "CONFIRM_ADD_SUBPREMISES") {
    status = "PARTIAL";
  } else {
    status = "CONFIRMED";
  }

  const components = validationData.result?.address?.addressComponents || [];
  const postalAddress = validationData.result?.address?.postalAddress;

  const getGoogleAPIAddressComponent = (type: string) => {
    const comp = components.find((c: any) => c.componentType === type);
    return comp?.componentName?.text || "";
  };

  const correctedAddress = postalAddress
    ? {
        street: getGoogleAPIAddressComponent("route") || "",
        streetNumber: getGoogleAPIAddressComponent("street_number") || "",
        city:
          getGoogleAPIAddressComponent("locality") ||
          postalAddress.locality ||
          "",
        postalCode: postalAddress.postalCode || "",
        regionCode: postalAddress.regionCode || regionCode,
      }
    : null;

  return Response.json({
    status,
    correctedAddress,
  });
}
