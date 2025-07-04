"use client";

import ProfileIntegrationTest from "@/app/components/features/auth/ProfileIntegrationTest";

export default function ProfileTestPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold text-center mb-6">
        Clerk + Sanity Profile Integration Test
      </h1>
      <ProfileIntegrationTest />
    </div>
  );
}
