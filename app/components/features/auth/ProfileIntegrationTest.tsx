"use client";

import { useUserProfile } from "@/app/hooks/useUserProfile";
import { SignInButton } from "./AuthButtons";
import { CustomUserButton } from "./CustomUserButton";

/**
 * Test component that demonstrates the Clerk-Sanity profile integration
 * 
 * This component:
 * - Shows authentication status
 * - Displays Sanity profile data when authenticated
 * - Includes loading states for better UX
 */
export default function ProfileIntegrationTest() {
  const { profile, isLoading, error, isAuthenticated, user } = useUserProfile();

  // Console logs for debugging
  console.log("Auth state:", { isAuthenticated, isLoading, hasProfile: !!profile });
  
  if (error) {
    console.error("Profile integration error:", error);
  }

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Clerk + Sanity Integration</h2>
        <div>
          {isAuthenticated ? <CustomUserButton /> : <SignInButton />}
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-medium mb-2">Authentication Status</h3>
        <div className="bg-gray-100 p-3 rounded mb-4">
          <p className="text-sm">
            <span className="font-medium">Status:</span>{" "}
            {isLoading ? "Loading..." : isAuthenticated ? "Authenticated" : "Not authenticated"}
          </p>
          {isAuthenticated && user && (
            <p className="text-sm mt-1">
              <span className="font-medium">Clerk User:</span> {user.fullName} ({user.primaryEmailAddress?.emailAddress})
            </p>
          )}
        </div>
      </div>

      {isAuthenticated && (
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-2">Sanity Profile</h3>
          {isLoading ? (
            <div className="bg-gray-100 p-3 rounded animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ) : profile ? (
            <div className="bg-gray-100 p-3 rounded">
              <p className="text-sm">
                <span className="font-medium">Display Name:</span> {profile.displayName}
              </p>
              <p className="text-sm mt-1">
                <span className="font-medium">Clerk ID:</span> {profile.clerkId}
              </p>
              {profile.preferences && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Preferences:</p>
                  <ul className="list-disc list-inside text-xs ml-2 mt-1">
                    <li>
                      Marketing emails: {profile.preferences.receiveMarketingEmails ? "Yes" : "No"}
                    </li>
                    <li>
                      Dark mode: {profile.preferences.darkMode ? "Enabled" : "Disabled"}
                    </li>
                    <li>
                      Save payment info: {profile.preferences.savePaymentInfo ? "Yes" : "No"}
                    </li>
                  </ul>
                </div>
              )}
              {profile.primaryAddress && Object.values(profile.primaryAddress).some(v => v) && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Primary Address:</p>
                  <p className="text-xs mt-1">
                    {[
                      profile.primaryAddress.streetAddress,
                      profile.primaryAddress.city,
                      profile.primaryAddress.state,
                      profile.primaryAddress.postalCode,
                      profile.primaryAddress.country,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-red-100 p-3 rounded text-red-700 text-sm">
              Error loading Sanity profile: {error?.message || "Unknown error"}
            </div>
          )}
        </div>
      )}

      <div className="border-t mt-4 pt-4 text-xs text-gray-500">
        <p>This component demonstrates the integration between Clerk authentication and Sanity user profiles.</p>
        <p className="mt-1">Sign in to see your linked Sanity profile data.</p>
      </div>
    </div>
  );
}