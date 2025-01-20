// import { getSaleById } from "@/sanity/lib/sales/getSaleById";
// import ProductThumb from "@/components/features/products/ProductThumb";
// import { SALE_BY_ID_QUERYResult } from "@/sanity.types";
// import { notFound } from "next/navigation";
// interface Props {
//   params: { id: string };
// }

// const InactiveSale = () => {
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-4">This sale has ended</h1>
//       <p>Check our other active sales</p>
//     </div>
//   );
// };

// export default async function SalePage({ params: { id } }: Props) {
//   const sale: SALE_BY_ID_QUERYResult = await getSaleById(id);

//   if (!sale) {
//     notFound();
//   }

//   if (!isValidNow) return <InactiveSale />;

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="mb-8">
//         <h1 className="text-4xl font-bold mb-2">{sale.title}</h1>
//         <div className="flex items-center gap-4 text-lg">
//           <span className="text-red-600 font-bold">{sale.discount}% OFF</span>
//           {isValidNow && (
//             <span className="text-gray-600">
//               Ends {new Dae.validUntil).toLocaleDateString()}
//             </span>
//           )}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//         {sale.products?.map((product) => (
//           <ProductThumb
//             key={product._id}
//             product={product}
//             saleDiscount={sale.discount}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }
