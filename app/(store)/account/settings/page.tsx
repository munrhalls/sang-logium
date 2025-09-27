'use client';

import { UserProfile } from '@clerk/nextjs';

export default function AccountSettingsPage() {
  console.log('POC: Direct route loaded (not intercepted)');

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl mb-4">Account Settings (Direct Route)</h1>
      <UserProfile routing="virtual" />
    </div>
  );
}