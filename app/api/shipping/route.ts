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

  const provideValidationFeedbackURL = `https://addressvalidation.googleapis.com/v1:provideValidationFeedback?key=${apiKey}`;
  //   {
  //   "conclusion": "VALIDATED_VERSION_USED",
  //   "responseId": "de22bed8-7f52-44cb-8526-faceac57150a"
  // }
  //   The conclusion field identifies one of the following actions from your side:
  // VALIDATED_VERSION_USED: the validated version of the address from the Address Validation API.
  // USER_VERSION_USED: the original version provided by the user.
  // UNVALIDATED_VERSION_USED: a version that was a result of a prompt to the user, but did not re-validate it with the Address Validation API.
  // UNUSED: abandoned the transaction.

  // Send feedback to Google Maps Address Validation API

  // console.log("Address validation response:", validationResponse);
  const validationData = await validationResponse.json();
  console.log("Address validation data:", validationData);

  return new Response(JSON.stringify(validationData), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
