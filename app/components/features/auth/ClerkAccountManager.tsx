"use client";
import { useClerk, useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
export function ClerkAccountManager() {
  const { user } = useUser();
  const clerk = useClerk();
  const { openUserProfile } = clerk;
  const [isManagingAccount, setIsManagingAccount] = useState(false);
  useEffect(() => {
    let safetyTimeout: NodeJS.Timeout | null = null;
    if (isManagingAccount) {
      safetyTimeout = setTimeout(() => {
        console.log("Safety timeout triggered: resetting UI state");
        setIsManagingAccount(false);
      }, 10000); 
    }
    return () => {
      if (safetyTimeout) {
        clearTimeout(safetyTimeout);
      }
    };
  }, [isManagingAccount]);
  useEffect(() => {
    if (!isManagingAccount) return;
    const handleDocumentClick = () => {
      setTimeout(() => {
        const dialogs = document.querySelectorAll('[role="dialog"]');
        let clerkDialogFound = false;
        dialogs.forEach((dialog) => {
          if (
            dialog.className.includes("cl-") ||
            dialog.getAttribute("data-clerk-component")
          ) {
            clerkDialogFound = true;
          }
        });
        if (!clerkDialogFound && isManagingAccount) {
          console.log(
            "No Clerk dialog found in DOM after click, resetting state",
          );
          setIsManagingAccount(false);
        }
      }, 200);
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isManagingAccount) {
        console.log("Page visibility changed, resetting state");
        setIsManagingAccount(false);
      }
    };
    document.addEventListener("click", handleDocumentClick);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isManagingAccount]);
  if (!user) return null;
  const appearanceConfig = {
    elements: {
      rootBox: "w-full mx-auto rounded-md shadow-md",
      card: "bg-white rounded-md p-6",
      navbar: "mb-4",
      headerTitle: "text-xl font-semibold text-gray-900",
      headerSubtitle: "text-gray-500",
    },
  };
  const handleClose = () => {
    console.log("Clerk dialog closed");
    setIsManagingAccount(false);
  };
  const handleManageAccount = () => {
    console.log("Opening Clerk account management");
    setIsManagingAccount(true);
    try {
      openUserProfile({
        appearance: appearanceConfig,
        onClose: handleClose,
      });
    } catch (error) {
      console.error("Error opening user profile:", error);
      setIsManagingAccount(false);
    }
  };
  const handleManualReset = () => {
    console.log("Manual reset triggered by user");
    setIsManagingAccount(false);
  };
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Basic Settings</h3>
              <p className="text-sm text-gray-500">
                Manage your account security, email addresses, password, and
                connected accounts
              </p>
              <div className="mt-1 text-xs text-gray-500">
                Primary email: {user.primaryEmailAddress?.emailAddress}
              </div>
            </div>
            <button
              onClick={handleManageAccount}
              className="mt-4 sm:mt-0 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded"
              disabled={isManagingAccount}
            >
              {isManagingAccount ? "Opening..." : "Manage Account"}
            </button>
          </div>
        </div>
        {}
        {isManagingAccount && (
          <div className="mt-4 text-center">
            <button
              onClick={handleManualReset}
              className="text-xs text-red-600 underline hover:text-red-800"
            >
              Reset UI (Click if buttons remain disabled)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
