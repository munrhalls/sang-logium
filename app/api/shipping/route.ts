interface AddressLines {
  regionCode: string;
  locality: string;
  addressLines: [string];
}

interface GoogleValidationAPIRequest {
  address: AddressLines;
}

// Example request body:
//   address: {
//     regionCode: 'PL',
//     locality: 'Warszawa',
//     addressLines: [ '45-841 Dworska' ]
//   }

// vs

// completely wrong
// address: {
//     regionCode: 'PL',
//     locality: 'adsfafszxxzxc',
//     addressLines: [ 'cvbvcbvdgs 523erydhfcxvzss' ]
//   }

export async function POST(req: Request) {
  const body = await req.json();
  const address = body;

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const validationURL = `https://addressvalidation.googleapis.com/v1:validateAddress?key=${apiKey}`;

  const addressLines = [address.postalCode, address.street].join(" ");

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
      "Address found but not fully confirmed. Are you sure it's correct?",
    NULL: "Address successfully validated.",
    ACCEPT: "Address successfully validated.",
  };

  const validationData = await validationResponse.json();
  const verdict: "FIX" | "CONFIRM_ADD_SUBPREMISES" | "NULL" | "ACCEPT" =
    validationData.verdict;

  const apiValidationMessage = map[verdict?.possibleNextAction];

  console.log("Address validation data:", validationData);

  return new Response(JSON.stringify(validationData), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
