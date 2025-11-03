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

  //   if (verdict.possibleNextAction == FIX)
  //     Prompt the user to fix the address.
  // else if (verdict.possibleNextAction == CONFIRM_ADD_SUBPREMISES)
  //     Prompt the user to add a unit number.
  // else if (verdict.possibleNextAction == CONFIRM)
  //     Confirm with the user that the address is correct.
  // else
  //     Continue with the address returned by the API.

  const validationData = await validationResponse.json();
  console.log("Address validation data:", validationData);

  return new Response(JSON.stringify(validationData), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
