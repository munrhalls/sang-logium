"use client";

import { useUserProfile } from "@/app/hooks/useUserProfile";
import { useEffect, useState } from "react";
import { Address, Preferences, UserProfile } from "@/sanity/lib/profiles/profileTypes";
import { updateUserProfileFieldAction, updateNestedProfileFieldAction } from "@/app/actions/userProfileActions";
import ProfileHeader from "./ProfileHeader";
import EditableField from "./EditableField";
import EditableAddress from "./EditableAddress";
import PreferencesSection from "./PreferencesSection";
import { ClerkAccountManager } from "../features/auth/ClerkAccountManager";

export default function UserProfilePage() {
  const { profile, isLoading, error, isAuthenticated, user } = useUserProfile();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (profile) {
      setProfileData(profile);
    }
  }, [profile]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/4 mb-8"></div>
          
          <div className="h-6 bg-gray-200 rounded w-1/6 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded mb-6"></div>
          
          <div className="border rounded-md p-4 mb-6">
            <div className="h-6 bg-gray-200 rounded w-1/6 mb-4"></div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="mb-4">
                <div className="h-5 bg-gray-200 rounded w-1/6 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
          
          <div className="border rounded-md p-4 mb-6">
            <div className="h-6 bg-gray-200 rounded w-1/6 mb-4"></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-gray-200 rounded mb-4"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
          <h3 className="text-lg font-medium">Error loading profile</h3>
          <p className="mt-1">{error.message || "An unknown error occurred"}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-md p-4">
          <h3 className="text-lg font-medium">Authentication required</h3>
          <p className="mt-1">Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md p-4">
          <h3 className="text-lg font-medium">Profile not found</h3>
          <p className="mt-1">We couldn't find your profile information.</p>
        </div>
      </div>
    );
  }

  const handleUpdateField = async (field: string, value: string) => {
    if (!user) return;
    
    const result = await updateUserProfileFieldAction({
      clerkId: user.id,
      field,
      value,
    });
    
    if (result.success) {
      // Update local state
      setProfileData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          [field]: value,
        };
      });
    } else {
      throw new Error(result.message || "Failed to update profile");
    }
  };

  const handleUpdateAddressField = async (field: keyof Address, value: string) => {
    if (!user || !profileData) return;
    
    const result = await updateNestedProfileFieldAction({
      clerkId: user.id,
      parentField: "primaryAddress",
      field,
      value,
    });
    
    if (result.success) {
      // Update local state
      setProfileData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          primaryAddress: {
            ...prev.primaryAddress,
            [field]: value,
          },
        };
      });
    } else {
      throw new Error(result.message || "Failed to update address");
    }
  };

  const handleTogglePreference = async (field: keyof Preferences, value: boolean) => {
    if (!user || !profileData) return;
    
    const result = await updateNestedProfileFieldAction({
      clerkId: user.id,
      parentField: "preferences",
      field,
      value,
    });
    
    if (result.success) {
      // Update local state
      setProfileData((prev) => {
        if (!prev || !prev.preferences) return prev;
        return {
          ...prev,
          preferences: {
            ...prev.preferences,
            [field]: value,
          },
        };
      });
    } else {
      throw new Error(result.message || "Failed to update preference");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <ProfileHeader user={user} />
      
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        
        <EditableField
          label="Display Name"
          value={profileData.displayName || ""}
          onSave={(value) => handleUpdateField("displayName", value)}
          placeholder="Add a display name"
        />
        
        <p className="text-xs text-gray-500 mt-2">
          This is how your name will appear across the store.
        </p>
      </div>
      
      {/* New Clerk Account Management Section */}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <ClerkAccountManager />
      </div>
      
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <EditableAddress
          address={profileData.primaryAddress || {}}
          onSave={handleUpdateAddressField}
        />
      </div>
      
      <div className="bg-white shadow-sm rounded-lg p-6">
        <PreferencesSection
          preferences={profileData.preferences || {
            receiveMarketingEmails: false,
            darkMode: false,
            savePaymentInfo: false,
          }}
          onTogglePreference={handleTogglePreference}
        />
      </div>
    </div>
  );
}