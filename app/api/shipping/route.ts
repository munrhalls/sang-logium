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

  // Validate address with external API (google maps address validation api)

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const validationURL = `https://addressvalidation.googleapis.com/v1:validateAddress?key=${apiKey}`;

  const addressLines = [address.postalCode, address.street].join(" ");

  const validationRequestBody: GoogleValidationAPIRequest = {
    address: {
      regionCode: address.country,
      locality: address.city,
      addressLines: [addressLines],
    },
  };
  console.log(validationRequestBody);

  // const validationResponse = await fetch(validationURL, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(validationRequestBody),
  // });

  console.log("Address validation response:", validationResponse);

  return new Response(JSON.stringify(validationResponse), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
