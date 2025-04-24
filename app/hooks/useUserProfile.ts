"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { UserProfile } from "@/sanity/lib/profiles/profileTypes";
import {
  fetchProfileByClerkIdAction,
  createUserProfileAction,
} from "@/app/actions/userProfileActions";

type ProfileState = {
  profile: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
};

/**
 * Custom hook to fetch or create a Sanity profile for the current Clerk user
 *
 * This hook:
 * - Gets the current authenticated user from Clerk
 * - Checks if a corresponding Sanity profile exists
 * - Creates a basic profile if one doesn't exist
 * - Returns profile data and loading state
 */
export function useUserProfile() {
  const { user, isLoaded: isClerkLoaded, isSignedIn } = useUser();
  const [state, setState] = useState<ProfileState>({
    profile: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Skip if Clerk hasn't loaded yet or user isn't signed in
    if (!isClerkLoaded || !isSignedIn || !user) {
      setState((prev) => ({
        ...prev,
        isLoading: isClerkLoaded && !isSignedIn ? false : prev.isLoading,
      }));
      return;
    }

    async function loadOrCreateProfile() {
      try {
        console.log("Checking for existing Sanity profile for user:", user.id);

        // Attempt to fetch existing profile using server action
        const existingProfile = await fetchProfileByClerkIdAction(user.id);

        if (existingProfile) {
          console.log("Found existing Sanity profile:", existingProfile);
          setState({
            profile: existingProfile,
            isLoading: false,
            error: null,
          });
          return;
        }

        // No profile exists, create one using server action
        console.log(
          "No profile found. Creating new Sanity profile for user:",
          user.id
        );
        
        // Create a new profile (name is now managed solely by Clerk)
        const newProfile = await createUserProfileAction({
          clerkId: user.id,
          preferences: {
            receiveMarketingEmails: false,
            darkMode: false,
            savePaymentInfo: false,
          },
        });

        console.log("Created new Sanity profile:", newProfile);
        setState({
          profile: newProfile,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error loading or creating Sanity profile:", error);
        setState({
          profile: null,
          isLoading: false,
          error: error instanceof Error ? error : new Error(String(error)),
        });
      }
    }

    loadOrCreateProfile();
  }, [user, isClerkLoaded, isSignedIn]);

  return {
    ...state,
    isAuthenticated: isClerkLoaded && isSignedIn,
    "bla!": "bla!",
    user, // Return the Clerk user object for convenience
  };
}
