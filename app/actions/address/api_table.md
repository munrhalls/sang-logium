https://developers.google.com/maps/documentation/address-validation/reference/rest/v1/TopLevel/validateAddress#Granularity

    "verdict": {
      "inputGranularity": "<GRANULARITY>",
      "validationGranularity": "<GRANULARITY>",
      "geocodeGranularity": "<GRANULARITY>",
      "addressComplete": <BOOLEAN>,
      "possibleNextAction": "// irrelevant (it's in beta phase)"
    },
    address: {
        ... addressComponents": [
            {
                ...
                "componentType": "route | street_number | postal_code | locality | country",
                "confirmationLevel": "CONFIRMED"
            }
        ]
    }

// <GRANULARITY> ENUM
SUB_PREMISE Below-building level result, such as an apartment.
PREMISE Building-level result.
PREMISE_PROXIMITY A geocode that approximates the building-level location of the address.
BLOCK The address or geocode indicates a block. Only used in regions which have block-level addressing, such as Japan.
ROUTE The geocode or address is granular to route, such as a street, road, or highway.
OTHER All other granularities, which are bucketed together since they are not deliverable.

// <CONFIRMATION LEVEL ENUM>
CONFIRMATION_LEVEL_UNSPECIFIED Default value. This value is unused.
CONFIRMED We were able to verify that this component exists and makes sense in the context of the rest of the address.
UNCONFIRMED_BUT_PLAUSIBLE This component could not be confirmed, but it is plausible that it exists. For example, a street number within a known valid range of numbers on a street where specific house numbers are not known.
UNCONFIRMED_AND_SUSPICIOUS This component was not confirmed and is likely to be wrong. For example, a neighborhood that does not fit the rest of the address.
