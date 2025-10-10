import { redirect } from "next/navigation";

export default function CheckoutPage() {
  redirect("/checkout/shipping");
}

// "use client";
// import {
//   ArrowLeftIcon,
//   CreditCardIcon,
//   ShoppingCartIcon,
// } from "@heroicons/react/24/outline";
// import Link from "next/link";
// import { useState } from "react";
// import SegmentTitle from "@/app/components/ui/segment-title/SegmentTitle";
// export default function CheckoutPage() {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     address: "",
//     city: "",
//     postalCode: "",
//     country: "",
//     cardNumber: "",
//     expiry: "",
//     cvc: "",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [orderPlaced, setOrderPlaced] = useState(false);
//   const basketItems = [
//     {
//       id: "1",
//       name: "Studio Headphones Pro",
//       brand: "AudioTech",
//       price: 249.99,
//       image: "/placeholder.jpg",
//       quantity: 1,
//     },
//     {
//       id: "2",
//       name: "Wireless Earbuds X2",
//       brand: "SoundMaster",
//       price: 99.99,
//       image: "/placeholder.jpg",
//       quantity: 2,
//     },
//   ];
//   const subtotal = basketItems.reduce(
//     (total, item) => total + item.price * item.quantity,
//     0
//   );
//   const shipping = 15.99;
//   const total = subtotal + shipping;
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setTimeout(() => {
//       setOrderPlaced(true);
//       setIsSubmitting(false);
//     }, 1500);
//   };
//   if (orderPlaced) {
//     return (
//       <div className="max-w-2xl mx-auto my-12 px-4 sm:px-6 lg:px-8 bg-slate-100 pt-8 pb-16 rounded">
//         <div className="flex flex-col items-center justify-center p-12 bg-white rounded-sm shadow-sm">
//           <CreditCardIcon className="h-20 w-20 text-green-500 mb-6" />
//           <h2 className="text-2xl font-medium text-gray-800 mb-2">
//             Thank you for your order!
//           </h2>
//           <p className="text-gray-600 mt-3 mb-8 text-center max-w-md">
//             Your order has been placed successfully. You will receive a
//             confirmation email shortly.
//           </p>
//           <Link
//             href="/products"
//             className="flex items-center gap-2 px-8 py-3 bg-black text-white rounded-sm hover:bg-gray-800 transition-colors"
//           >
//             <ArrowLeftIcon className="h-4 w-4" />
//             Continue Shopping
//           </Link>
//         </div>
//       </div>
//     );
//   }
//   return (
//     <div className="max-w-4xl mx-auto my-8 px-4 sm:px-6 lg:px-8 bg-slate-100 pt-8 pb-16">
//       <div className="mb-8">
//         <SegmentTitle title="Checkout" />
//       </div>
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         <form
//           className="bg-white rounded-sm shadow-sm p-8 space-y-8"
//           onSubmit={handleSubmit}
//         >
//           <div>
//             <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">
//               Shipping Information
//             </h2>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Name
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   required
//                   value={form.name}
//                   onChange={handleInputChange}
//                   className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
//                   autoComplete="name"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   required
//                   value={form.email}
//                   onChange={handleInputChange}
//                   className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
//                   autoComplete="email"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Address
//                 </label>
//                 <input
//                   type="text"
//                   name="address"
//                   required
//                   value={form.address}
//                   onChange={handleInputChange}
//                   className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
//                   autoComplete="street-address"
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     City
//                   </label>
//                   <input
//                     type="text"
//                     name="city"
//                     required
//                     value={form.city}
//                     onChange={handleInputChange}
//                     className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
//                     autoComplete="address-level2"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Postal Code
//                   </label>
//                   <input
//                     type="text"
//                     name="postalCode"
//                     required
//                     value={form.postalCode}
//                     onChange={handleInputChange}
//                     className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
//                     autoComplete="postal-code"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Country
//                 </label>
//                 <input
//                   type="text"
//                   name="country"
//                   required
//                   value={form.country}
//                   onChange={handleInputChange}
//                   className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
//                   autoComplete="country"
//                 />
//               </div>
//             </div>
//           </div>
//           <div>
//             <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">
//               Payment Details
//             </h2>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Card Number
//                 </label>
//                 <input
//                   type="text"
//                   name="cardNumber"
//                   required
//                   value={form.cardNumber}
//                   onChange={handleInputChange}
//                   className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
//                   autoComplete="cc-number"
//                   maxLength={19}
//                   inputMode="numeric"
//                   pattern="[0-9\s]{13,19}"
//                   placeholder="1234 5678 9012 3456"
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Expiry
//                   </label>
//                   <input
//                     type="text"
//                     name="expiry"
//                     required
//                     value={form.expiry}
//                     onChange={handleInputChange}
//                     className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
//                     autoComplete="cc-exp"
//                     maxLength={5}
//                     placeholder="MM/YY"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     CVC
//                   </label>
//                   <input
//                     type="text"
//                     name="cvc"
//                     required
//                     value={form.cvc}
//                     onChange={handleInputChange}
//                     className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
//                     autoComplete="cc-csc"
//                     maxLength={4}
//                     inputMode="numeric"
//                     pattern="[0-9]{3,4}"
//                     placeholder="123"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="w-full py-4 bg-black text-white rounded-sm hover:bg-gray-800 transition-colors font-medium text-lg flex items-center justify-center disabled:opacity-60"
//           >
//             {isSubmitting ? "Placing Order..." : "Place Order"}
//           </button>
//         </form>
//         <div className="bg-white rounded-sm shadow-sm p-6 h-fit sticky top-4">
//           <h2 className="text-lg font-bold mb-6 pb-4 border-b border-gray-200">
//             Order Summary
//           </h2>
//           <div className="space-y-4 mb-6">
//             <div className="flex flex-col gap-4">
//               {basketItems.map((item) => (
//                 <div key={item.id} className="flex items-center gap-4">
//                   <div className="w-14 h-14 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
//                     <ShoppingCartIcon className="h-7 w-7 text-gray-400" />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="font-medium text-gray-900 truncate">
//                       {item.name}
//                     </div>
//                     <div className="text-xs text-gray-500 truncate">
//                       {item.brand}
//                     </div>
//                     <div className="text-xs text-gray-500">
//                       Qty: {item.quantity}
//                     </div>
//                   </div>
//                   <div className="font-medium text-gray-900">
//                     ${(item.price * item.quantity).toFixed(2)}
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="flex justify-between text-gray-700 pt-4 border-t border-gray-200">
//               <div>
//                 Subtotal (
//                 {basketItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
//                 items)
//               </div>
//               <div className="font-medium">${subtotal.toFixed(2)}</div>
//             </div>
//             <div className="flex justify-between text-gray-700">
//               <div>Shipping</div>
//               <div className="font-medium">${shipping.toFixed(2)}</div>
//             </div>
//             <div className="border-t border-gray-200 pt-4 mt-4">
//               <div className="flex justify-between font-bold text-xl">
//                 <div>Total</div>
//                 <div>${total.toFixed(2)}</div>
//               </div>
//               <div className="text-xs text-gray-500 mt-1">Including VAT</div>
//             </div>
//           </div>
//           <div className="mt-4 hidden lg:block">
//             <Link
//               href="/basket"
//               className="flex items-center justify-center gap-2 w-full py-3 border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-50 transition-colors font-medium"
//             >
//               <ArrowLeftIcon className="h-4 w-4" />
//               Back to Basket
//             </Link>
//           </div>
//           <div className="mt-6 pt-6 border-t border-gray-200">
//             <div className="text-xs text-gray-500 flex flex-col gap-2">
//               <p className="font-medium text-gray-700">We Accept:</p>
//               <div className="flex items-center gap-2">
//                 <div className="w-10 h-6 bg-gray-200 rounded"></div>
//                 <div className="w-10 h-6 bg-gray-200 rounded"></div>
//                 <div className="w-10 h-6 bg-gray-200 rounded"></div>
//                 <div className="w-10 h-6 bg-gray-200 rounded"></div>
//               </div>
//               <p className="mt-2">Secure checkout powered by Stripe</p>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="mt-6 lg:hidden">
//         <Link
//           href="/basket"
//           className="flex items-center justify-center gap-2 w-full py-3 border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-50 font-medium"
//         >
//           <ArrowLeftIcon className="h-4 w-4" />
//           Back to Basket
//         </Link>
//       </div>
//     </div>
//   );
// }
