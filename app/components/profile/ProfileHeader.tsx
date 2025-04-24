"use client";

import { User } from "@clerk/nextjs/dist/types/server";
import { CustomUserButton } from "../features/auth/CustomUserButton";

interface ProfileHeaderProps {
  user: User;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">
          Manage your account information and preferences
        </p>
      </div>
      
      <div className="flex flex-col items-end mt-4 md:mt-0">
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-700">
              {user.fullName || user.username}
            </div>
            <div className="text-xs text-gray-500">
              {user.primaryEmailAddress?.emailAddress}
            </div>
          </div>
          <CustomUserButton />
        </div>
      </div>
    </div>
  );
}