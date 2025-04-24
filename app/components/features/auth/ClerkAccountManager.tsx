"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { useState } from "react";
import Link from "next/link";

/**
 * ClerkAccountManager component
 * 
 * Provides access to Clerk's account management functionality:
 * - Email management (add/verify/remove)
 * - Password management (change password)
 * - Two-factor authentication
 * - Connected accounts
 */
export function ClerkAccountManager() {
  const { user } = useUser();
  const { openUserProfile } = useClerk();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isManagingAccount, setIsManagingAccount] = useState(false);

  if (!user) return null;

  // Function to open Clerk's user profile with specific settings
  const openClerkUserProfile = (initialSection?: string) => {
    console.log(`Opening Clerk account management for section: ${initialSection || 'default'}`);
    setIsManagingAccount(true);
    
    openUserProfile({
      appearance: {
        elements: {
          rootBox: "w-full mx-auto rounded-md shadow-md",
          card: "bg-white rounded-md p-6",
          navbar: "mb-4",
          headerTitle: "text-xl font-semibold text-gray-900",
          headerSubtitle: "text-gray-500",
        }
      },
      initialTab: initialSection,
      // When the user closes the dialog, reset the state
      onClose: () => {
        console.log('Clerk account management dialog closed');
        setIsManagingAccount(false);
      }
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Account Security</h2>
      
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-md">
          <div>
            <h3 className="font-medium text-gray-900">Email Addresses</h3>
            <p className="text-sm text-gray-500">
              Manage your email addresses and verification status
            </p>
            <div className="mt-1 text-xs text-gray-500">
              Current primary: {user.primaryEmailAddress?.emailAddress}
            </div>
          </div>
          <button
            onClick={() => openClerkUserProfile("account")}
            className="mt-2 sm:mt-0 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 rounded border border-blue-600 hover:border-blue-800"
            disabled={isManagingAccount}
          >
            {isManagingAccount ? 'Opening...' : 'Manage Emails'}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-md">
          <div>
            <h3 className="font-medium text-gray-900">Password</h3>
            <p className="text-sm text-gray-500">
              Update your password to keep your account secure
            </p>
            <div className="mt-1 text-xs text-gray-500">
              Last updated: {user.passwordUpdatedAt ? new Date(user.passwordUpdatedAt).toLocaleDateString() : 'Never'}
            </div>
          </div>
          <button
            onClick={() => openClerkUserProfile("security")}
            className="mt-2 sm:mt-0 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 rounded border border-blue-600 hover:border-blue-800"
            disabled={isManagingAccount}
          >
            {isManagingAccount ? 'Opening...' : 'Change Password'}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-md">
          <div>
            <h3 className="font-medium text-gray-900">Two-factor Authentication</h3>
            <p className="text-sm text-gray-500">
              Add an extra layer of security to your account
            </p>
            <div className="mt-1 text-xs text-gray-500">
              Status: {user.twoFactorEnabled ? 
                <span className="text-green-600">Enabled</span> : 
                <span className="text-yellow-600">Not enabled</span>}
            </div>
          </div>
          <button
            onClick={() => openClerkUserProfile("security")}
            className="mt-2 sm:mt-0 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 rounded border border-blue-600 hover:border-blue-800"
            disabled={isManagingAccount}
          >
            {isManagingAccount ? 'Opening...' : user.twoFactorEnabled ? 'Manage 2FA' : 'Set Up 2FA'}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-md">
          <div>
            <h3 className="font-medium text-gray-900">Connected Accounts</h3>
            <p className="text-sm text-gray-500">
              Manage social logins and connected services
            </p>
          </div>
          <button
            onClick={() => openClerkUserProfile("account_connections")}
            className="mt-2 sm:mt-0 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 rounded border border-blue-600 hover:border-blue-800"
            disabled={isManagingAccount}
          >
            {isManagingAccount ? 'Opening...' : 'Manage Connections'}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-md">
          <div>
            <h3 className="font-medium text-gray-900">All Account Settings</h3>
            <p className="text-sm text-gray-500">
              Access all account settings and options
            </p>
          </div>
          <button
            onClick={() => openClerkUserProfile()}
            className="mt-2 sm:mt-0 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded"
            disabled={isManagingAccount}
          >
            {isManagingAccount ? 'Opening...' : 'Manage Account'}
          </button>
        </div>
      </div>
    </div>
  );
}