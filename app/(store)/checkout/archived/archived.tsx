// import { stripe } from "@/lib/stripe";
// import Link from "next/link";
// import { redirect } from "next/navigation";

// interface ReturnPageProps {
//   searchParams: Promise<{ session_id?: string }>;
// }

// export default async function ReturnPage({ searchParams }: ReturnPageProps) {
//   const params = await searchParams;
//   const sessionId = params.session_id;

//   if (!sessionId) {
//     redirect("/basket");
//   }

//   const session = await stripe.checkout.sessions.retrieve(sessionId);

//   const isComplete = session.status === "complete";
//   const isPaid = session.payment_status === "paid";

//   return (
//     <div className="container mx-auto max-w-2xl px-4 py-16">
//       <div className="rounded-lg bg-white p-8 shadow-md">
//         {isComplete && isPaid ? (
//           <>
//             <div className="mb-6 flex items-center justify-center">
//               <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
//                 <svg
//                   className="h-8 w-8 text-green-600"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M5 13l4 4L19 7"
//                   />
//                 </svg>
//               </div>
//             </div>
//             <h1 className="mb-4 text-center text-3xl font-bold text-gray-900">
//               Payment Successful!
//             </h1>
//             <p className="mb-8 text-center text-gray-600">
//               Thank you for your purchase. Your order has been confirmed.
//             </p>
//             <div className="mb-6 rounded-md bg-gray-50 p-4">
//               {/* <p className="text-sm text-gray-700">
//                 <span className="font-semibold">Session ID:</span> {sessionId}
//               </p> */}
//               <p className="text-sm text-gray-700">
//                 <span className="font-semibold">Status:</span> {session.status}
//               </p>
//               <p className="text-sm text-gray-700">
//                 <span className="font-semibold">Payment Status:</span>{" "}
//                 {session.payment_status}
//               </p>
//             </div>
//           </>
//         ) : (
//           <>
//             <div className="mb-6 flex items-center justify-center">
//               <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
//                 <svg
//                   className="h-8 w-8 text-yellow-600"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                   />
//                 </svg>
//               </div>
//             </div>
//             <h1 className="mb-4 text-center text-3xl font-bold text-gray-900">
//               Payment Processing
//             </h1>
//             <p className="mb-8 text-center text-gray-600">
//               Your payment is being processed. Please check back later.
//             </p>
//             <div className="mb-6 rounded-md bg-gray-50 p-4">
//               <p className="text-sm text-gray-700">
//                 <span className="font-semibold">Session ID:</span> {sessionId}
//               </p>
//               <p className="text-sm text-gray-700">
//                 <span className="font-semibold">Status:</span> {session.status}
//               </p>
//               <p className="text-sm text-gray-700">
//                 <span className="font-semibold">Payment Status:</span>{" "}
//                 {session.payment_status}
//               </p>
//             </div>
//           </>
//         )}

//         <div className="flex justify-center gap-4">
//           <Link
//             href="/products"
//             className="rounded-sm bg-black px-6 py-3 font-medium text-white transition-colors hover:bg-gray-800"
//           >
//             Continue Shopping
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
