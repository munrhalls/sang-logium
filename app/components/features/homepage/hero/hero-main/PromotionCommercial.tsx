import React from "react";

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
    <div className="z-50 flex flex-col items-start justify-center gap-3 px-6 py-4">
      {/* Discount Badge */}
      <div className="inline-flex items-center justify-center rounded-full bg-red-500 px-3 py-1 text-sm font-semibold text-white">
        {discountPercent}% Off
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 sm:text-base">{description}</p>

      {/* CTA Button */}
      {actionLabel && (
        <a
          href={actionLink || "#"}
          className="mt-2 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
        >
          {actionLabel}
          <span className="text-xs">→</span>
        </a>
      )}
    </div>
  );
}
