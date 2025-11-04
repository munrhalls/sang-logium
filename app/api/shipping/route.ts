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

  return Response.json({ status });
}
