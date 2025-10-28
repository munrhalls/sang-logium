// // Server Action to create a Stripe Embedded Checkout session
// // This runs server-side only and has access to the secret key
// 'use server';

// // Import Stripe Node SDK
// import Stripe from 'stripe';

// // Initialize Stripe with the secret key
// // The secret key should never be exposed to the client
// const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

// if (!stripeSecretKey) {
//   throw new Error('STRIPE_SECRET_KEY is not defined');
// }

// // Create a new Stripe instance with your secret key
// const stripe = new Stripe(stripeSecretKey, {
//   apiVersion: '2024-10-28.acacia', // Use the latest API version
// });

// // Define the Server Action function
// export async function createEmbeddedCheckoutSession() {
//   try {
//     // Create a checkout session with ui_mode set to 'embedded'
//     const session = await stripe.checkout.sessions.create({
//       // Set UI mode to embedded for the embedded checkout experience
//       ui_mode: 'embedded',
      
//       // Define the line items (products/prices) for the checkout
//       line_items: [
//         {
//           // Specify the price ID from your Stripe dashboard
//           price: 'price_xxxxxxxxxxxxx',
//           quantity: 1,
//         },
//       ],
      
//       // Set the payment mode (payment, subscription, or setup)
//       mode: 'payment',
      
//       // Define the return URL after successful payment
//       // For embedded checkout, user stays on your site but you provide a completion page
//       return_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
//     });

//     // Return the client_secret to the client
//     // This is safe to send to the browser and is used to initialize the embedded form
//     return {
//       clientSecret: session.client_secret,
//       sessionId: session.id,
//     };
//   } catch (error) {
//     // Handle errors appropriately
//     console.error('Error creating checkout session:', error);
//     throw new Error('Failed to create checkout session');
//   }
// }
