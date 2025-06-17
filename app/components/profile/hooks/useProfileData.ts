import { useState, useEffect } from "react";
import { useUserProfile } from "@/app/hooks/useUserProfile";
import { UserProfile } from "@/sanity/lib/profiles/profileTypes";
import { updateNestedProfileFieldAction } from "@/app/actions/userProfileActions";
import { useErrorHandler } from "./useErrorHandler";

interface UseProfileDataReturn {
  profile: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  user: any; // TODO: Type this properly
  updateAddress: (address: string) => Promise<void>;
}

export function useProfileData(): UseProfileDataReturn {
  const { profile, isLoading, error, isAuthenticated, user } = useUserProfile();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const { handleError, clearError } = useErrorHandler();

  useEffect(() => {
    if (profile) {
      setProfileData(profile);
    }
  }, [profile]);

  const updateAddress = async (address: string) => {
    if (!user) return;

    try {
      clearError();
      const result = await updateNestedProfileFieldAction({
        clerkId: user.id,
        parentField: "primaryAddress",
        field: "formattedAddress",
        value: address,
      });

      if (!result.success) {
        throw new Error(result.message || "Failed to update address");
      }

      // Update local state
      setProfileData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          primaryAddress: {
            ...(prev.primaryAddress || {}),
            formattedAddress: address,
          },
        };
      });
    } catch (err) {
      handleError(err);
    }
  };

  return {
    profile: profileData,
    isLoading,
    error,
    isAuthenticated,
    user,
    updateAddress,
  };
}
