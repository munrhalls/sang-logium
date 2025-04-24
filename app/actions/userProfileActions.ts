"use server";

import client from "@/sanity/utils/getClient.mjs";
import { UserProfile } from "@/sanity/lib/profiles/profileTypes";

/**
 * Server action to fetch a user profile by Clerk ID
 */
export async function fetchProfileByClerkIdAction(
  clerkId: string
): Promise<UserProfile | null> {
  try {
    // GROQ query to fetch a user profile by Clerk ID
    // Still including displayName for backward compatibility
    const profile = await client.fetch(
      `*[_type == "userProfile" && clerkId == $clerkId][0] {
        _id,
        _type,
        clerkId,
        displayName,  // Kept for backward compatibility but not actively used
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
  primaryAddress?: any;
  preferences?: any;
}): Promise<UserProfile | null> {
  try {
    // Check if profile already exists
    const existingProfile = await client.fetch(
      `*[_type == "userProfile" && clerkId == $clerkId][0]._id`,
      { clerkId: data.clerkId }
    );

    if (existingProfile) {
      console.error(`User profile with clerkId ${data.clerkId} already exists`);
      return null;
    }

    const now = new Date().toISOString();

    // Create profile document (no displayName - we use Clerk's name system instead)
    const profileData = {
      _type: "userProfile",
      clerkId: data.clerkId,
      primaryAddress: data.primaryAddress,
      preferences: data.preferences || {
        receiveMarketingEmails: false,
        darkMode: false,
        savePaymentInfo: false,
      },
      createdAt: now,
      updatedAt: now,
    };

    const createdProfile = await client.create(profileData);
    return createdProfile as UserProfile;
  } catch (error) {
    console.error("Error creating user profile:", error);
    return null;
  }
}

/**
 * Server action to update a user profile field
 */
export async function updateUserProfileFieldAction(data: {
  clerkId: string;
  field: string;
  value: any;
}): Promise<{ success: boolean; message?: string }> {
  try {
    const { clerkId, field, value } = data;
    
    // Find the profile ID first
    const profileId = await client.fetch(
      `*[_type == "userProfile" && clerkId == $clerkId][0]._id`,
      { clerkId }
    );
    
    if (!profileId) {
      return { 
        success: false, 
        message: "Profile not found" 
      };
    }

    // Create the update patch
    const patch: Record<string, any> = {
      updatedAt: new Date().toISOString()
    };

    // Set the specified field
    patch[field] = value;

    // Apply the patch to the document
    await client
      .patch(profileId)
      .set(patch)
      .commit();

    return { 
      success: true
    };
  } catch (error) {
    console.error("Error updating user profile field:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}

/**
 * Server action to update a nested field in user profile
 */
export async function updateNestedProfileFieldAction(data: {
  clerkId: string;
  parentField: string;
  field: string;
  value: any;
}): Promise<{ success: boolean; message?: string }> {
  try {
    const { clerkId, parentField, field, value } = data;
    
    // Find the profile ID first
    const profileId = await client.fetch(
      `*[_type == "userProfile" && clerkId == $clerkId][0]._id`,
      { clerkId }
    );
    
    if (!profileId) {
      return { 
        success: false, 
        message: "Profile not found" 
      };
    }

    // Create the update patch with updatedAt timestamp
    const patch: Record<string, any> = {
      updatedAt: new Date().toISOString()
    };

    // Set the nested field
    patch[`${parentField}.${field}`] = value;

    // Apply the patch to the document
    await client
      .patch(profileId)
      .set(patch)
      .commit();

    return { 
      success: true 
    };
  } catch (error) {
    console.error("Error updating nested user profile field:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}
