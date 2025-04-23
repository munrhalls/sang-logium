"use client";

import { useUserProfile } from "@/app/hooks/useUserProfile";
import { useEffect } from "react";

/**
 * Silent component that syncs Clerk users with Sanity profiles
 * 
 * This component:
 * - Can be placed in the layout or other persistent component
 * - Automatically creates Sanity profiles for authenticated Clerk users
 * - Doesn't render anything visible
 */
export default function ProfileSync() {
  const { isAuthenticated, profile, isLoading, error } = useUserProfile();

  // Log sync status for debugging
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      if (profile) {
        console.log("ProfileSync: User profile synchronized", { 
          clerkId: profile.clerkId,
          displayName: profile.displayName
        });
      } else if (error) {
        console.error("ProfileSync: Error synchronizing profile", error);
      }
    }
  }, [isAuthenticated, profile, isLoading, error]);

  // This component doesn't render anything
  return null;
}