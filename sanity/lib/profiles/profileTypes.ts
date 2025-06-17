// TypeScript types for user profiles

export interface Address {
  streetAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  formattedAddress?: string;
}

export function formatAddress(address: Address): string {
  const parts = [
    address.streetAddress,
    address.city,
    address.state,
    address.postalCode,
    address.country,
  ].filter(Boolean);
  return parts.join(", ");
}

export interface Preferences {
  receiveMarketingEmails: boolean;
  darkMode: boolean;
  savePaymentInfo: boolean;
}

export interface UserProfile {
  _id?: string;
  _type: "userProfile";
  clerkId: string;
  displayName?: string;
  primaryAddress?: Address;
  preferences?: Preferences;
  createdAt?: string;
  updatedAt?: string;
}

// Types for profile operations
export interface FetchProfileOptions {
  clerkId: string;
}

export interface CreateProfileOptions {
  clerkId: string;
  primaryAddress?: Address;
  preferences?: Preferences;
}

export interface UpdateProfileOptions {
  clerkId: string;
  primaryAddress?: Partial<Address>;
  preferences?: Partial<Preferences>;
}
