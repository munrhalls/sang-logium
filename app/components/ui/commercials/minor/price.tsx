const Price = function ({
  price,
  priceColor,
}: {
  price: number;
  priceColor: string;
}) {
  return (
    <div className="h-full grid text-center">
      <span className="text-xs font-extralight text-slate-700 sm:font-black sm:text-lg md:text-xl">
        only
      </span>
      <span
        className="ml-1 font-bold sm:font-black text-xs sm:text-lg md:text-xl lg:text-2xl xl:text-3xl"
        style={{ color: priceColor }}
      >
        ${price.toFixed(2)}
      </span>
    </div>
  );
};

export default Price;
