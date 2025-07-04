# Setting Up API Keys for Address Validation

This project uses Geoapify's Geocoding API for validating user addresses. Follow these steps to understand how to set up or change API keys:

## Geoapify Geocoding API

The application uses Geoapify for address validation:

1. A default API key (2954b2442d2d4731a391d34936e4e181) is already provided in the code.
2. For production or high-volume usage, it's recommended to create your own Geoapify account:
   - Go to [Geoapify](https://www.geoapify.com/) and sign up.
   - Navigate to your dashboard to create a new API key.
   - Copy your API key to use in the application.
3. Geoapify offers a free tier with 3,000 requests per day.

## Key Features of Geoapify Address Validation

- **Strict Street and City Validation**: Addresses are only accepted when both street and city exist and can be confirmed
- **High Confidence Requirement**: Validation requires a high confidence score (0.75+) to ensure addresses are real
- **Suggestions for Invalid Addresses**: When an address fails validation, the system provides corrected suggestions
- **Automatic Fallback**: If the API is unavailable, the system falls back to local validation

## Adding or Changing API Keys

1. Edit the `.env.local` file in the project root:

```
# Address Validation API Keys
NEXT_PUBLIC_GEOAPIFY_API_KEY=your_geoapify_api_key_here
```

2. Restart your development server for the changes to take effect.

## Testing the Address Validation

After setting up your API keys, you can test the address validation in the user profile section:

1. Login to your account
2. Navigate to the account/profile section
3. Enter an address in the address form
4. The system will validate your address using the Geoapify API

Try entering both valid and invalid addresses to see how the validation works:

- **Valid Address**: A real street and city (e.g., "123 Main St, New York, NY")
- **Invalid Street**: A street that doesn't exist (e.g., "999 Fake St, New York, NY")
- **Invalid City**: A city that doesn't exist (e.g., "123 Main St, Fakeville, NY")
- **Low Confidence**: An incomplete or ambiguous address (e.g., just "Main St")

## Fallback Validation

If the API key is not available or the API service is down, the system automatically falls back to local validation:

- Basic format checking
- Pattern matching for common address elements
- Detection of suspicious input

This ensures the application remains functional even when external services are unavailable.

## How the Address Validation Works

1. **Basic Pre-check**: Before making an API call, the system performs basic validation to filter out obviously invalid addresses (keyboard patterns, excessive repetition, etc.)
2. **API Validation**: Sends the address to Geoapify's Geocoding API which attempts to find a match
3. **Confidence Assessment**: Analyzes the confidence score and verify street and city components
4. **Strict Validation**: Only accepts addresses where both the street and city are recognized and match with high confidence
5. **Response Handling**: Returns standardized results including validation status, errors, and suggestions

## API Usage Considerations

- The current API key has a limit of 3,000 requests per day
- For high-volume applications, consider:
  - Implementing rate limiting
  - Adding caching for repeated validation of the same address
  - Using a dedicated API key with a paid Geoapify plan
