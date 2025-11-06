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
  console.log(validationData, "validation data @api");

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

  const cleanAddress = validationData.result?.address?.postalAddress;

  return Response.json({
    status,
    correctedAddress: cleanAddress
      ? {
          street: cleanAddress.addressLines?.[0] || "",
          city: cleanAddress.locality || "",
          postalCode: cleanAddress.postalCode || "",
          regionCode: cleanAddress.regionCode || regionCode,
        }
      : null,
  });
}
