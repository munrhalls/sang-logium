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

  const address = body as { regionCode: string; locality: string };
  const { regionCode, locality } = address;

  const regionCodeMap = {
    EN: "GB",
    PL: "PL",
  } as const;

  const regionCodeParsed: string =
    regionCodeMap[regionCode as keyof typeof regionCodeMap] ?? regionCode;

  const addressLines = [
    address.postalCode,
    address.street,
    address.streetNumber,
  ].join(" ");

  const validationRequestBody: GoogleValidationAPIRequest = {
    address: {
      regionCode: regionCodeParsed,
      locality: locality,
      addressLines: [addressLines],
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
  console.log("VALIDATION DATA:");
  console.log(validationData, "validation data @api");
  const cleanAddress = validationData.result?.address;

  let validatedAddress = null;
  if (cleanAddress) {
    validatedAddress = {
      regionCode: cleanAddress.regionCode,
      postalCode: cleanAddress.postalCode || "",
      street: cleanAddress.addressLines
        ? cleanAddress.addressLines[0].split(" ")[0] || ""
        : "",
      streetNumber: cleanAddress.addressLines
        ? parseInt(cleanAddress.addressLines[0].split(" ")[1]) || 0
        : 0,
      city: cleanAddress.locality || "",
    };
  }

  console.log(validatedAddress, "vadliated address @api");
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

  return Response.json({ status, validatedAddress });
}
