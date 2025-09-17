"use client";
import { useClerk, useUser } from "@clerk/nextjs";

export function ClerkAccountManager() {
  const { user } = useUser();
  const clerk = useClerk();
  const { openUserProfile } = clerk;

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Basic Settings</h3>
              <p className="text-sm text-gray-500">
                Manage your account security, email addresses, password, and
                connected accounts
              </p>
              <div className="mt-1 text-xs text-gray-500">
                Primary email: {user?.primaryEmailAddress?.emailAddress}
              </div>
            </div>
            <button
              onClick={() => openUserProfile}
              className="mt-4 sm:mt-0 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded"
            ></button>
          </div>
        </div>
      </div>
    </div>
  );
}
