// has *local* state purposefully
// its initial state is showing the add to cart icon button
// state can be changed to show basketcontrols
// basket controls, on first render, updates the store with add to cart method because if it rendered for the first time, it means "add to cart" button was clicked within wrapper
// has add to cart icon button (add to cart)
// has Basket controls

// if (!item) {
//     console.log(product.stock, "product.stock");
//     const basketItem = {
//       _id: product._id,
//       stock: product.stock,
//       name: product.name,
//       price: product.price,
//       quantity: 1,
//     };
//     return (
//       <div
//         className="flex justify-start items-center gap-4"
//         onClick={(e) => {
//           e.preventDefault();
//           e.stopPropagation();
//         }}
//       >
//         <button
//           onClick={(e) => {
//             e.preventDefault();
//             e.stopPropagation();
//             addItem(basketItem);
//           }}
//           aria-label="Add to Cart"
//           className="rounded-lg bg-black text-black p-2 h-14 w-14 flex items-center justify-center hover:bg-gray-800 transition-colors"
//         >
//           <span
//             className="p-1"
//             style={{ display: "inline-flex", lineHeight: 0 }}
//           >
//             <ShoppingCart className="w-8 h-8 text-white" />
//           </span>
//         </button>
//         <span className="text-black text-xl font-black border-dashed border-black mb-[1px]">
//           Add to cart
//         </span>
//       </div>
//     );
//   }
