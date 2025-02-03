const BrandTitle = function ({ brand }: { brand: string }) {
  return (
    <span className="z-40 font-black w-full text-black text-center text-xs sm:py-2 md:py-3 lg:py-4 sm:text-md lg:text-lg xl:text-xl grid">
      {brand}
    </span>
  );
};
export default BrandTitle;
