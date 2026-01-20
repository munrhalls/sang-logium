interface PromotionCommercialProps {
  description: string;
  discountPercent: number;
  actionLabel: string;
  actionLink?: string | null;
}

export default function PromotionCommercial({
  description,
  discountPercent,
  actionLabel,
  actionLink,
}: PromotionCommercialProps) {
  return (
    <div className="absolute z-50 grid h-full w-full place-content-center">
      {/* Content Container */}
      <div className="dmSerifDisplay mx-4 grid place-items-center gap-8 rounded-sm bg-black/40 px-8 py-6 font-serif text-white sm:px-12 sm:py-12 lg:py-28">
        {/* Description */}
        <p className="max-w-2xl text-center text-xl font-black sm:text-3xl lg:text-5xl">
          {description}
        </p>

        {/* Discount Badge */}
        <div className="inline-flex items-center justify-center rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white sm:text-base">
          {discountPercent}% Off
        </div>
      </div>

      {/* CTA Button */}
      {actionLabel && (
        <div className="mt-8 grid place-items-center">
          <a
            href={actionLink || "#"}
            className="max-w-xs rounded-sm bg-amber-700 px-8 py-3 text-center text-sm font-black tracking-wide text-white transition-colors hover:bg-amber-800 sm:max-w-sm sm:py-4 sm:text-lg"
          >
            {actionLabel}
          </a>
        </div>
      )}
    </div>
  );
}
