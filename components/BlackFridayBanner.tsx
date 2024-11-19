import { getSaleByCouponCode } from "@/sanity/lib/sales/getSalesByType";

export default async function BlackFridayBanner() {
  const sale = await getSaleByCouponCode("BFRIDAY");

  if (!sale?.isActive) return null;

  return (
    <div className="bg-gradient-to-r from-red-700 to-black text-white px-6 py-10 mx-4 mt-2 rounded-lg shadow-lg">
      <div className="container mx-auto flex flex-col items-center justify-between">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-left mb-4">
          {sale.title}
        </h2>
        <p className="text-left text-xl sm:text-3xl font-semibold mb-5">
          {sale.description}
        </p>
      </div>

      <div className="flex">
        <div className="bg-white text-black py-4 px-6 rounded-full shadow-md transform hover:scale-105 transition duration-300">
          <span className="text-red-600">{sale.couponCode}</span>
          <span className="ml-2 font-bold text-base sm:text-xl">
            for {sale.discountAmount}% OFF
          </span>
        </div>
      </div>
    </div>
  );
}
