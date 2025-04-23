"use server";

import { backendClient } from "@/sanity/lib/backendClient";
import { UserProfile } from "@/sanity/lib/profiles/profileTypes";

/**
 * Server action to fetch a user profile by Clerk ID
 */
export async function fetchProfileByClerkIdAction(clerkId: string): Promise<UserProfile | null> {
  try {
    // GROQ query to fetch a user profile by Clerk ID
    const profile = await backendClient.fetch(
      `*[_type == "userProfile" && clerkId == $clerkId][0] {
        _id,
        _type,
        clerkId,
        displayName,
        primaryAddress {
          streetAddress,
          city,
          state,
          postalCode,
          country
        },
        preferences {
          receiveMarketingEmails,
          darkMode,
          savePaymentInfo
        },
        createdAt,
        updatedAt
      }`,
      { clerkId }
    );
    
    return profile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

/**
 * Server action to create a new user profile
 */
export async function createUserProfileAction(data: {
  clerkId: string;
  displayName?: string;
  primaryAddress?: any;
  preferences?: any;
}): Promise<UserProfile | null> {
  try {
    // Check if profile already exists
    const existingProfile = await backendClient.fetch(
      `*[_type == "userProfile" && clerkId == $clerkId][0]._id`,
      { clerkId: data.clerkId }
    );
    
    if (existingProfile) {
      console.error(`User profile with clerkId ${data.clerkId} already exists`);
      return null;
    }

    const now = new Date().toISOString();
    
    // Create profile document
    const profileData = {
      _type: "userProfile",
      clerkId: data.clerkId,
      displayName: data.displayName,
      primaryAddress: data.primaryAddress,
      preferences: data.preferences || {
        receiveMarketingEmails: false,
        darkMode: false,
        savePaymentInfo: false,
      },
      createdAt: now,
      updatedAt: now,
    };

    const createdProfile = await backendClient.create(profileData);
    return createdProfile as UserProfile;
  } catch (error) {
    console.error("Error creating user profile:", error);
    return null;
  }
}