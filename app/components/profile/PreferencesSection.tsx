"use client";

import { useState, useEffect } from "react";
import { Preferences } from "@/sanity/lib/profiles/profileTypes";
import EditableToggle from "./EditableToggle";

interface PreferencesSectionProps {
  preferences: Preferences;
  onTogglePreferenceAction: (
    field: keyof Preferences,
    value: boolean
  ) => Promise<void>;
}

export default function PreferencesSection({
  preferences,
  onTogglePreferenceAction,
}: PreferencesSectionProps) {
  const [pendingPreferences, setPendingPreferences] = useState<
    Partial<Preferences>
  >({});
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Track pending changes
  useEffect(() => {
    setHasPendingChanges(Object.keys(pendingPreferences).length > 0);
  }, [pendingPreferences]);

  // Set up navigation warning when there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasPendingChanges) {
        // Standard browser behavior
        e.preventDefault();
        // For older browsers
        e.returnValue = "";
        return "";
      }
    };

    if (hasPendingChanges) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasPendingChanges]);

  const handlePreferenceChange = (field: keyof Preferences, value: boolean) => {
    if (value === preferences[field]) {
      // If toggling back to original value, remove from pending changes
      const newPending = { ...pendingPreferences };
      delete newPending[field];
      setPendingPreferences(newPending);
    } else {
      // Otherwise add to pending changes
      setPendingPreferences((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setError(null);

    try {
      // Process all pending changes sequentially
      for (const [field, value] of Object.entries(pendingPreferences)) {
        await onTogglePreferenceAction(
          field as keyof Preferences,
          value as boolean
        );
      }

      // Clear pending changes on success
      setPendingPreferences({});
      setSaveSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save preferences"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelAll = () => {
    setPendingPreferences({});
    setError(null);
  };

  // Define preference fields with their labels
  const preferenceFields: { key: keyof Preferences; label: string }[] = [
    { key: "receiveMarketingEmails", label: "Receive marketing emails" },
    { key: "darkMode", label: "Use dark mode" },
    { key: "savePaymentInfo", label: "Save payment information" },
  ];

  return (
    <div className="border rounded-md p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Preferences</h3>

        <div className="flex space-x-2">
          {hasPendingChanges && (
            <button
              onClick={handleCancelAll}
              disabled={isSaving}
              className="px-3 py-1 text-xs text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleSaveAll}
            disabled={!hasPendingChanges || isSaving}
            className={`px-3 py-1 text-xs text-white rounded-md ${
              !hasPendingChanges || isSaving
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {saveSuccess && (
        <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded-md">
          <p className="text-xs text-green-600">
            Preferences updated successfully!
          </p>
        </div>
      )}

      <div className={hasPendingChanges ? "p-2 bg-blue-50 rounded-md" : ""}>
        {preferenceFields.map(({ key, label }) => {
          // Use pending change if available, otherwise use original preference
          const currentValue =
            key in pendingPreferences
              ? (pendingPreferences[key] as boolean)
              : preferences[key];

          const isDirty = key in pendingPreferences;

          return (
            <div
              key={key}
              className={isDirty ? "bg-blue-100 p-2 mb-2 rounded-md" : ""}
            >
              <EditableToggle
                label={label}
                value={currentValue}
                onChange={(value) => handlePreferenceChange(key, value)}
                disabled={isSaving}
              />
            </div>
          );
        })}
      </div>

      {hasPendingChanges && (
        <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-xs text-yellow-700">
            You have pending changes to your preferences. Click "Save Changes"
            to apply them or "Cancel" to discard.
          </p>
          <p className="text-xs text-yellow-700 mt-1">
            <span className="font-semibold">Note:</span> Leaving this page
            without saving will lose your changes.
          </p>
        </div>
      )}
    </div>
  );
}
