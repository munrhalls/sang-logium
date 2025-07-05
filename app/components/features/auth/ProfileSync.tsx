"use client";
import { useUserProfile } from "@/app/hooks/useUserProfile";
import { useEffect } from "react";
export default function ProfileSync() {
  const { isAuthenticated, profile, isLoading, error } = useUserProfile();
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      if (profile) {
      } else if (error) {
        console.error("ProfileSync: Error synchronizing profile", error);
      }
    }
  }, [isAuthenticated, profile, isLoading, error]);
  return null;
}
