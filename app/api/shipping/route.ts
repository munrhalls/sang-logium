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
  const address = body;

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const validationURL = `https://addressvalidation.googleapis.com/v1:validateAddress?key=${apiKey}`;

  const addressLines = [
    address.postalCode,
    address.street,
    address.streetNumber,
  ].join(" ");

  const validationRequestBody: GoogleValidationAPIRequest = {
    address: {
      regionCode: address.regionCode,
      locality: address.city,
      addressLines: [addressLines],
    },
  };

  console.log(validationRequestBody);

  const validationResponse = await fetch(validationURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validationRequestBody),
  });

  const map = {
    FIX: "Address could not be found on map. Please check and edit.",
    CONFIRM_ADD_SUBPREMISES:
      "Address found but not fully confirmed. If you are sure it's correct, please proceed.",
    NULL: "Address successfully validated.",
    ACCEPT: "Address successfully validated.",
  };

  const validationData = await validationResponse.json();
  console.log("Address validation data:", validationData);
  const verdict = validationData.result?.verdict;
  const possibleNextAction:
    | "FIX"
    | "CONFIRM_ADD_SUBPREMISES"
    | "NULL"
    | "ACCEPT" = verdict?.possibleNextAction || "NULL";

  const apiValidationMessage = map[possibleNextAction];
  console.log("API Validation Message:", apiValidationMessage);

  return new Response(JSON.stringify(apiValidationMessage), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
