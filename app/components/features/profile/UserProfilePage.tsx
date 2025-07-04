"use client";
import React from "react";
import { useProfileData } from "./hooks/useProfileData";

export default function UserProfilePage() {
  const { profile, isLoading, error, isAuthenticated, user } = useProfileData();

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!isAuthenticated || !user) return <AuthRequiredState />;
  if (!profile) return <ProfileNotFoundState />;

  return (
    // <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    //   <ProfileHeader user={user} />
    //   {globalError && <ErrorDisplay error={globalError} />}
    //   <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
    //     <ClerkAccountManager />
    //   </div>
    //   <div className="bg-white shadow-sm rounded-lg p-6">
    //     {/* <AddressForm /> */}
    //   </div>
    // </div>
    <div className="max-w-7xl mx-auto my-8 px-4 sm:px-6 lg:px-8 bg-slate-100 pt-8 pb-16">
      <h1>yo</h1>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/4 mb-8"></div>
        <div className="h-10 bg-gray-200 rounded mb-6"></div>
      </div>
    </div>
  );
}

function ErrorState({ error }: { error: Error }) {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
        <h3 className="text-lg font-medium">Error loading profile</h3>
        <p className="mt-1">{error.message || "An unknown error occurred"}</p>
      </div>
    </div>
  );
}

function AuthRequiredState() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-md p-4">
        <h3 className="text-lg font-medium">Authentication required</h3>
        <p className="mt-1">Please sign in to view your profile.</p>
      </div>
    </div>
  );
}

function ProfileNotFoundState() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md p-4">
        <h3 className="text-lg font-medium">Profile not found</h3>
        <p className="mt-1">We couldn&apos;t find your profile information.</p>
      </div>
    </div>
  );
}
