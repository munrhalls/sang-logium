// // Client Component that renders the Stripe Embedded Checkout UI
// // This component receives the clientSecret and renders the checkout form
// 'use client';

// // Import necessary React hooks
// import { useEffect, useState } from 'react';

// // Import Stripe React components
// import {
//   EmbeddedCheckoutProvider,
//   EmbeddedCheckout,
// } from '@stripe/react-stripe-js';

// // Import the Stripe promise from our client initialization file
// import { stripePromise } from '@/lib/stripe-client';

// // Define the props interface for the component
// interface CheckoutFormProps {
//   clientSecret: string;
// }

// // Define the Client Component
// export default function CheckoutForm({ clientSecret }: CheckoutFormProps) {
//   // Optional: Add loading state
//   const [isLoading, setIsLoading] = useState(true);

//   // Optional: Handle any initialization side effects
//   useEffect(() => {
//     if (clientSecret) {
//       setIsLoading(false);
//     }
//   }, [clientSecret]);

//   // Render loading state if needed
//   if (isLoading) {
//     return (
//       <div>
//         {/* Loading spinner or skeleton */}
//       </div>
//     );
//   }

//   // Render the EmbeddedCheckoutProvider with the clientSecret
//   // This provider wraps the EmbeddedCheckout component and provides context
//   return (
//     <div id="checkout">
//       {/* EmbeddedCheckoutProvider needs both the Stripe promise and options */}
//       <EmbeddedCheckoutProvider
//         stripe={stripePromise}
//         options={{
//           clientSecret,
//           // Optional: Add additional options here
//           // onComplete: () => {
//           //   Handle completion if needed before redirect
//           // }
//         }}
//       >
//         {/* EmbeddedCheckout renders the actual checkout UI */}
//         <EmbeddedCheckout />
//       </EmbeddedCheckoutProvider>
//     </div>
//   );
// }
