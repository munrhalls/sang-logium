"use client";

import { Preferences } from "@/sanity/lib/profiles/profileTypes";
import EditableToggle from "./EditableToggle";

interface PreferencesSectionProps {
  preferences: Preferences;
  onTogglePreference: (field: keyof Preferences, value: boolean) => Promise<void>;
}

export default function PreferencesSection({
  preferences,
  onTogglePreference,
}: PreferencesSectionProps) {
  return (
    <div className="border rounded-md p-4 mb-6">
      <h3 className="text-lg font-medium mb-4">Preferences</h3>
      
      <EditableToggle
        label="Receive marketing emails"
        value={preferences.receiveMarketingEmails}
        onToggle={(value) => onTogglePreference("receiveMarketingEmails", value)}
      />
      
      <EditableToggle
        label="Use dark mode"
        value={preferences.darkMode}
        onToggle={(value) => onTogglePreference("darkMode", value)}
      />
      
      <EditableToggle
        label="Save payment information"
        value={preferences.savePaymentInfo}
        onToggle={(value) => onTogglePreference("savePaymentInfo", value)}
      />
    </div>
  );
}