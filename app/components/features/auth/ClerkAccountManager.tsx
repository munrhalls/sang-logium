"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";

/**
 * ClerkAccountManager component
 *
 * Provides access to Clerk's account management functionality through a single button
 * that opens the Clerk user profile/menu.
 */
export function ClerkAccountManager() {
  const { user } = useUser();
  const clerk = useClerk();
  const { openUserProfile } = clerk;

  const [isManagingAccount, setIsManagingAccount] = useState(false);

  // Safety timeout to reset the state if onClose doesn't trigger
  useEffect(() => {
    let safetyTimeout: NodeJS.Timeout | null = null;

    // If we're in the managing account state, set a safety timeout
    if (isManagingAccount) {
      // Set a safety timeout to reset the state after a reasonable time
      // This ensures we don't get stuck if the onClose callback fails
      safetyTimeout = setTimeout(() => {
        console.log("Safety timeout triggered: resetting UI state");
        setIsManagingAccount(false);
      }, 10000); // 10 seconds is enough time for dialog to fully open
    }

    return () => {
      // Clean up timeout on component unmount or when isManagingAccount changes
      if (safetyTimeout) {
        clearTimeout(safetyTimeout);
      }
    };
  }, [isManagingAccount]);

  // Listen for global events that might indicate dialog closure
  useEffect(() => {
    // Only add these listeners if we're in the managing account state
    if (!isManagingAccount) return;

    // When user clicks anywhere in the document, check if they might be closing the dialog
    const handleDocumentClick = () => {
      // Short delay to allow Clerk's own handlers to run first
      setTimeout(() => {
        // If we're still showing as managing, but the dialog might be gone
        // Look for any dialog elements still in the DOM
        const dialogs = document.querySelectorAll('[role="dialog"]');
        let clerkDialogFound = false;

        dialogs.forEach((dialog) => {
          // Look for class names that might indicate a Clerk dialog
          if (
            dialog.className.includes("cl-") ||
            dialog.getAttribute("data-clerk-component")
          ) {
            clerkDialogFound = true;
          }
        });

        // If no Clerk dialog found and we're still in managing state, reset
        if (!clerkDialogFound && isManagingAccount) {
          console.log(
            "No Clerk dialog found in DOM after click, resetting state"
          );
          setIsManagingAccount(false);
        }
      }, 200);
    };

    // Also reset when user switches tabs or visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isManagingAccount) {
        // If we return to the page and we're still in managing state, reset
        console.log("Page visibility changed, resetting state");
        setIsManagingAccount(false);
      }
    };

    // Add event listeners
    document.addEventListener("click", handleDocumentClick);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      // Clean up listeners
      document.removeEventListener("click", handleDocumentClick);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isManagingAccount]);

  if (!user) return null;

  // Common configuration for Clerk dialogs
  const appearanceConfig = {
    elements: {
      rootBox: "w-full mx-auto rounded-md shadow-md",
      card: "bg-white rounded-md p-6",
      navbar: "mb-4",
      headerTitle: "text-xl font-semibold text-gray-900",
      headerSubtitle: "text-gray-500",
    },
  };

  // Common onClose handler
  const handleClose = () => {
    console.log("Clerk dialog closed");
    setIsManagingAccount(false);
  };

  // Open the Clerk user profile
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

  // Manual reset function for emergency use
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

        {/* Show a reset button whenever managing account */}
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
