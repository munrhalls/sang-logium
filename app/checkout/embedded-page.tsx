// // Server Component page that initiates the embedded checkout flow
// // This is the main checkout page that users navigate to

// // Import the Server Action
// import { createEmbeddedCheckoutSession } from '@/app/actions/createEmbeddedCheckoutSession';

// // Import the Client Component that will render the checkout UI
// import CheckoutForm from '@/app/components/CheckoutForm';

// // Define the Server Component (default is server component in Next.js 15+)
// export default async function EmbeddedCheckoutPage() {
//   // Call the Server Action to create a checkout session
//   // This happens on the server during the initial page render
//   let clientSecret: string | null = null;
//   let error: string | null = null;

//   try {
//     // Invoke the Server Action
//     const result = await createEmbeddedCheckoutSession();

//     // Extract the client secret from the result
//     clientSecret = result.clientSecret;
//   } catch (err) {
//     // Handle any errors that occur during session creation
//     console.error('Failed to create checkout session:', err);
//     error = 'Unable to initialize checkout. Please try again.';
//   }

//   // If there was an error, render an error state
//   if (error || !clientSecret) {
//     return (
//       <div>
//         <h1>Checkout Error</h1>
//         <p>{error || 'Failed to initialize checkout'}</p>
//         {/* Optionally provide a retry button */}
//       </div>
//     );
//   }

//   // Render the page with the CheckoutForm client component
//   // Pass the clientSecret as a prop
//   return (
//     <div>
//       <h1>Complete Your Purchase</h1>

//       {/* Render the CheckoutForm with the clientSecret */}
//       <CheckoutForm clientSecret={clientSecret} />

//       {/* Optional: Add additional UI elements */}
//       <div>
//         {/* Security badges, trust indicators, etc. */}
//       </div>
//     </div>
//   );
// }

// // Optional: Add metadata for SEO
// export const metadata = {
//   title: 'Checkout',
//   description: 'Complete your purchase securely',
// };
