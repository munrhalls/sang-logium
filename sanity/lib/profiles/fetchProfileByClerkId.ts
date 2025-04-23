import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";
import { UserProfile, FetchProfileOptions } from "./profileTypes";

/**
 * Fetch a user profile by Clerk ID
 * 
 * @param options Object containing the Clerk ID to search for
 * @returns The user profile if found, null otherwise
 */
export async function fetchProfileByClerkId(options: FetchProfileOptions): Promise<UserProfile | null> {
  const { clerkId } = options;

  // GROQ query to fetch a user profile by Clerk ID
  const FETCH_PROFILE_QUERY = defineQuery(`
    *[_type == "userProfile" && clerkId == $clerkId][0] {
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
    }
  `);

  try {
    const result = await sanityFetch({
      query: FETCH_PROFILE_QUERY,
      params: { clerkId },
    });

    return result.data as UserProfile | null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}