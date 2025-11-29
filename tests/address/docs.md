https://developers.google.com/maps/documentation/address-validation/build-validation-logic

API REFERENCE
https://developers.google.com/maps/documentation/address-validation/reference/rest/v1/TopLevel/validateAddress#ConfirmationLevel

ConfirmationLevel
The different possible values for confirmation levels.

Enums
CONFIRMATION_LEVEL_UNSPECIFIED Default value. This value is unused.
CONFIRMED We were able to verify that this component exists and makes sense in the context of the rest of the address.
UNCONFIRMED_BUT_PLAUSIBLE This component could not be confirmed, but it is plausible that it exists. For example, a street number within a known valid range of numbers on a street where specific house numbers are not known.
UNCONFIRMED_AND_SUSPICIOUS This component was not confirmed and is likely to be wrong. For example, a neighborhood that does not fit the rest of the address.
