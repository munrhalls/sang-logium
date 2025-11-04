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

  const addressActions = {
    EDIT: "Please edit your address. A required component is missing or incorrect.",
    CONFIRM: "We couldn't fully confirm this address. Is it correct?",
    NULL: "Address successfully validated.",
  };

  const validationData = await validationResponse.json();
  console.log("Address validation data:", validationData);

  return new Response(JSON.stringify(validationData), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
