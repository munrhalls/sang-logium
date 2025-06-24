"use client";

import {
  ShoppingCartIcon,
  XMarkIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
// Removing unused import
// import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ProductQuantityControl from "@/app/components/features/basket/ProductQuantityControl";
import SegmentTitle from "@/app/components/ui/segment-title/SegmentTitle";

export default function BasketPage() {
  return (
    <div className="max-w-7xl mx-auto my-8 px-4 sm:px-6 lg:px-8 bg-slate-100 pt-8 pb-16">
      <div className="mb-8">
        <SegmentTitle title="Your Account" />
      </div>

      <div className="h-full"></div>
    </div>
  );
}
