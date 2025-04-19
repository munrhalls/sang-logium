"use client";

import React from "react";
import dynamic from "next/dynamic";

// Use Next.js dynamic import for simpler code splitting
const AuthContent = dynamic(
  () => import("./AuthContent"),
  {
    loading: () => <div className="w-[24px] h-[24px] bg-gray-800 rounded-full" />,
    ssr: false
  }
);

export default function AuthOptimized() {  
  return <AuthContent />;
}