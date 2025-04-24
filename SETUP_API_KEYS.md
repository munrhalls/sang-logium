# Setting Up API Keys for Address Validation

This project uses the Google Maps Platform's Address Validation API for validating user addresses. Follow these steps to set up your API keys:

## Google Maps Platform Address Validation API

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing project.
3. Enable the "Address Validation API" from the API Library:
   - Navigate to APIs & Services > Library
   - Search for "Address Validation API"
   - Click "Enable"
4. Create an API key:
   - Navigate to APIs & Services > Credentials
   - Click "Create Credentials" and select "API key"
   - Copy the generated API key
5. Set up usage restrictions (recommended for production):
   - In the credentials page, find your API key and click "Edit"
   - Under "Application restrictions", choose "HTTP referrers" and add your domain
   - Under "API restrictions", limit the key to only the Address Validation API

## Geocodio API (Alternative/Fallback)

The application also supports Geocodio as a fallback for address validation:

1. Go to [Geocodio](https://www.geocod.io/) and create an account.
2. After logging in, navigate to your dashboard to find your API key.
3. Copy your API key for use in the application.

## Adding the Keys to Your Environment

1. Create or edit the `.env.local` file in the project root:

```
# Google Maps Platform API Keys
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
NEXT_PUBLIC_GEOCODIO_API_KEY=your_geocodio_api_key_here
```

2. Restart your development server for the changes to take effect.

## Testing the Address Validation

After setting up your API keys, you can test the address validation in the user profile section:

1. Login to your account
2. Navigate to the account/profile section
3. Enter an address in the address form
4. The system will validate your address using the Google Maps Platform API or fall back to Geocodio if needed

## Development Mode

In development mode or when using placeholder API keys, the system will use simulated API responses. To test with actual API calls, ensure you've added valid API keys to your environment variables.

## API Usage Considerations

- The Google Maps Platform Address Validation API is a paid service with a free tier (check current pricing).
- Geocodio also offers a free tier with limited requests per day.
- Consider implementing rate limiting and caching mechanisms for production deployments.