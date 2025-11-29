https://developers.google.com/maps/documentation/address-validation/reference/rest/v1/TopLevel/validateAddress#Granularity

    "verdict": {
      "inputGranularity": "<GRANULARITY ENUM>",
      "validationGranularity": "<GRANULARITY ENUM>",
      "geocodeGranularity": "<GRANULARITY ENUM>",
      "addressComplete": <BOOLEAN>,
      "possibleNextAction": "// irrelevant (it's in beta phase)"
      "hasUnconfirmedComponents": boolean,
      "hasInferredComponents": boolean,
      "hasReplacedComponents": boolean,
      "hasSpellCorrectedComponents": boolean
    },
    address: {
        ... addressComponents": [
            {
                ...
                "componentType": <route | street_number | postal_code | locality | country>,
                "confirmationLevel": <CONFIRMATION LEVEL ENUM>
            }
        ]
    }

// <GRANULARITY ENUM>
SUB_PREMISE Below-building level result, such as an apartment.
PREMISE Building-level result.
PREMISE_PROXIMITY A geocode that approximates the building-level location of the address.
BLOCK The address or geocode indicates a block. Only used in regions which have block-level addressing, such as Japan.
ROUTE The geocode or address is granular to route, such as a street, road, or highway.
OTHER All other granularities, which are bucketed together since they are not deliverable.

In short: SUB_PREMISE means google could validate down to apartment number in a building. That's the level required for address being shippable. Anything less than that -> return response that prompts for confirmation / correction or rejection of untrustworthy address. SO three response types: happy path / confirmation or correct path / rejection path (and also error, of course).

// <CONFIRMATION LEVEL ENUM>
CONFIRMED We were able to verify that this component exists and makes sense in the context of the rest of the address.
UNCONFIRMED_BUT_PLAUSIBLE This component could not be confirmed, but it is plausible that it exists. For example, a street number within a known valid range of numbers on a street where specific house numbers are not known.
This component was not confirmed and is likely to be wrong. For example, a neighborhood that does not fit the rest of the address.

// TRUTH TABLE - API RESPONSE TYPE TO ROUTE VALIDATION LOGIC OUTPUT

1 HAPPY PATH CASE, PERFECT ADDRESS
"inputGranularity": "SUB_PREMISE",
"validationGranularity": "SUB_PREMISE",
"geocodeGranularity": "SUB_PREMISE",
"addressComplete": true,

"hasUnconfirmedComponents": false,
"hasInferredComponents": false,
"hasReplacedComponents": false,
"hasSpellCorrectedComponents": false

For each individual address component: <route | street_number | postal_code | locality | country>
"confirmationLevel": "CONFIRMED"

RETURN {STATUS: "ACCEPT", ADDRESS OBJ}

// I AM NOT SURE WHAT NOW...
2 ALMOST PERFECT CASES - NO CORRECTION, ONLY CONFIRMATION NEEDED
DETECT: PERFECT MATCH TO HAPPY PATH EXCEPT geocodeGranularity: "PREMISE"
RETURN {STATUS: "CONFIRMATION_NEEDED", ORIGINAL ADDRESS}

3 ALMOST PERFECT CASE - CONTAINS SPELL CORRECTED COMPONENTS
DETECT: PERFECT MATCH TO HAPPY PATH EXCEPT hasSpellCorrectedComponents: true

RETURN { STATUS: "SPELL_CORRECTED", ORIGINAL ADDRESS, CORRECTED ADDRESS }

4 CORRECTED CASE -
DETECT: PERFECT MATCH TO HAPPY PATH EXCEPT "hasReplacedComponents": true,
