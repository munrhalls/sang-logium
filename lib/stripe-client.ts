// // This file initializes the Stripe client-side SDK
// // It loads Stripe.js asynchronously and exports a promise
// // that resolves to the Stripe instance

// // Import the loadStripe function from Stripe's JavaScript library
// import { loadStripe } from '@stripe/stripe-js';

// // Get the publishable key from environment variables
// // This key is prefixed with NEXT_PUBLIC_ so it's available in the browser
// const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// // Validate that the publishable key exists
// if (!stripePublishableKey) {
//   throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined');
// }

// // Load and export the Stripe promise
// // This promise is used to initialize Stripe UI components
// // loadStripe returns a Promise<Stripe | null>
// export const stripePromise = loadStripe(stripePublishableKey);
