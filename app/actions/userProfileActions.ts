"use server";
import client from "@/sanity/utils/getClient.mjs";
import { UserProfile } from "@/sanity/lib/profiles/profileTypes";
export async function fetchProfileByClerkIdAction(
  clerkId: string,
): Promise<UserProfile | null> {
  try {
    const profile = await client.fetch(
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
      { clerkId },
    );
    return profile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}
export async function createUserProfileAction(data: {
  clerkId: string;
  primaryAddress?: unknown;
  preferences?: unknown;
}): Promise<UserProfile | null> {
  try {
    const existingProfile = await client.fetch(
      `*[_type == "userProfile" && clerkId == $clerkId][0]._id`,
      { clerkId: data.clerkId },
    );
    if (existingProfile) {
      console.error(`User profile with clerkId ${data.clerkId} already exists`);
      return null;
    }
    const now = new Date().toISOString();
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
    return createdProfile as unknown as UserProfile;
  } catch (error) {
    console.error("Error creating user profile:", error);
    return null;
  }
}
export async function updateUserProfileFieldAction(data: {
  clerkId: string;
  field: string;
  value: unknown;
}): Promise<{ success: boolean; message?: string }> {
  try {
    const { clerkId, field, value } = data;
    const profileId = await client.fetch(
      `*[_type == "userProfile" && clerkId == $clerkId][0]._id`,
      { clerkId },
    );
    if (!profileId) {
      return {
        success: false,
        message: "Profile not found",
      };
    }
    const patch: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };
    patch[field] = value;
    await client.patch(profileId).set(patch).commit();
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating user profile field:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
export async function updateNestedProfileFieldAction(data: {
  clerkId: string;
  parentField: string;
  field: string;
  value: unknown;
}): Promise<{ success: boolean; message?: string }> {
  try {
    const { clerkId, parentField, field, value } = data;
    const profileId = await client.fetch(
      `*[_type == "userProfile" && clerkId == $clerkId][0]._id`,
      { clerkId },
    );
    if (!profileId) {
      return {
        success: false,
        message: "Profile not found",
      };
    }
    const patch: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };
    patch[`${parentField}.${field}`] = value;
    await client.patch(profileId).set(patch).commit();
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating nested user profile field:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
