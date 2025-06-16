"use client";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";
import { useUserProfile } from "@/app/hooks/useUserProfile";
import { useEffect, useState } from "react";
import {
  Address,
  Preferences,
  UserProfile,
} from "@/sanity/lib/profiles/profileTypes";
import {
  updateUserProfileFieldAction,
  updateNestedProfileFieldAction,
} from "@/app/actions/userProfileActions";
import ProfileHeader from "./ProfileHeader";
import PreferencesSection from "./PreferencesSection";
import { ClerkAccountManager } from "../features/auth/ClerkAccountManager";
import { useClerk } from "@clerk/nextjs";
import React from "react";
import {
  GeoapifyGeocoderAutocomplete as OriginalAutocomplete,
  GeoapifyContext as OriginalContext,
} from "@geoapify/react-geocoder-autocomplete";
const originalConsoleWarn = console.warn;
console.warn = function (message) {
  if (
    message &&
    (message.includes("'position' input has been deprecated") ||
      message.includes("'countryCodes' input has been deprecated") ||
      message.includes("'biasByProximity' input has been deprecated"))
  ) {
    return;
  }
  originalConsoleWarn.apply(console, arguments);
};
const GeoapifyGeocoderAutocomplete = (props) => {
  const updatedProps = { ...props };
  if (updatedProps.position) {
    updatedProps.biasByLocation = updatedProps.position;
    delete updatedProps.position;
  }
  if (updatedProps.biasByProximity) {
    updatedProps.biasByLocation = updatedProps.biasByProximity;
    delete updatedProps.biasByProximity;
  }
  if (updatedProps.countryCodes) {
    updatedProps.filterByCountryCode = updatedProps.countryCodes;
    delete updatedProps.countryCodes;
  }
  return <OriginalAutocomplete {...updatedProps} />;
};
const GeoapifyContext = (props) => {
  return <OriginalContext {...props} />;
};
interface CityData {
  city: string;
  lat: number;
  lon: number;
}
// COMPLETE REWRITE
export default function UserProfilePage() {
  const { profile, isLoading, error, isAuthenticated, user } = useUserProfile();
  const clerk = useClerk();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState<Record<string, any>>({});
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [citySelected, setCitySelected] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [streetError, setStreetError] = useState<string | null>(null);
  const [cityError, setCityError] = useState<string | null>(null);
  useEffect(() => {
    if (profile) {
      setProfileData(profile);
    }
  }, [profile]);
  useEffect(() => {
    if (globalError) {
      setGlobalError(null);
    }
  }, [profileData]);
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
    try {
      setGlobalError(null);
      const result = await updateUserProfileFieldAction({
        clerkId: user.id,
        field,
        value,
      });
      if (result.success) {
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
    } catch (err) {
      setGlobalError(
        err instanceof Error ? err.message : "Failed to update profile"
      );
      throw err;
    }
  };
  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };
  const handleUpdateAddressField = async (
    field: keyof Address,
    value: string
  ) => {
    if (!user || !profileData) return;

    try {
      setGlobalError(null);

      // Ensure primaryAddress exists before updating
      const updatedProfile = {
        ...profileData,
        primaryAddress: profileData.primaryAddress || {},
      };

      const result = await updateNestedProfileFieldAction({
        clerkId: user.id,
        parentField: "primaryAddress",
        field,
        value,
      });

      if (result.success) {
        setProfileData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            primaryAddress: {
              ...(prev.primaryAddress || {}), // Handle if primaryAddress is null/undefined
              [field]: value,
            },
          };
        });
      } else {
        throw new Error(result.message || "Failed to update address");
      }
    } catch (err) {
      setGlobalError(
        err instanceof Error ? err.message : "Failed to update address"
      );
      console.error("Address update error:", err);
    }
  };
  const handleTogglePreference = async (
    field: keyof Preferences,
    value: boolean
  ) => {
    if (!user || !profileData) return;
    try {
      setGlobalError(null);
      const result = await updateNestedProfileFieldAction({
        clerkId: user.id,
        parentField: "preferences",
        field,
        value,
      });
      if (result.success) {
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
    } catch (err) {
      setGlobalError(
        err instanceof Error ? err.message : "Failed to update preference"
      );
      throw err;
    }
  };
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  const handleSuggestions = (addressSuggestions) => {
    setSuggestions(addressSuggestions || []);
  };
  const onPlaceSelect = (place) => {
    setCityError(null);

    // Check if place exists and has required data
    if (place && place.properties) {
      // Extract city from properties (Geoapify's structure)
      const city = place.properties.city || place.properties.name;

      if (city) {
        setSelectedCity({
          city: city,
          lat: place.properties.lat || 0,
          lon: place.properties.lon || 0,
          placeId: place.properties.place_id || undefined,
        });

        setCitySelected(true);

        // Update address fields safely
        handleUpdateAddressField("city", city);

        if (place.properties.country)
          handleUpdateAddressField("country", place.properties.country);

        if (place.properties.state)
          handleUpdateAddressField("state", place.properties.state);

        // Clear street data when city changes
        handleUpdateAddressField("street", "");
        handleUpdateAddressField("houseNumber", "");
      } else {
        setCityError("Please select a valid city");
        setCitySelected(false);
        setSelectedCity(null);
      }
    } else {
      setCityError("Please select a valid city");
      setCitySelected(false);
      setSelectedCity(null);
    }
  };
  const onStreetSelect = (place) => {
    setStreetError(null);
    if (place && selectedCity) {
      const streetCity = place.city?.toLowerCase() || "";
      const selectedCityName = selectedCity.city.toLowerCase();
      if (streetCity && streetCity !== selectedCityName) {
        setStreetError(
          `This street is not in ${selectedCity.city}. Please select a street within the selected city.`
        );
        return;
      }
      setSelectedAddress(place);
      if (place.street) {
        handleUpdateAddressField("street", place.street);
      }
      if (place.housenumber) {
        handleUpdateAddressField("houseNumber", place.housenumber);
      }
      if (place.postcode) {
        handleUpdateAddressField("postalCode", place.postcode);
      }
    } else if (!selectedCity) {
      setStreetError("Please select a city first");
    }
  };
  const onSuggestionChange = (suggestions) => {
    setSuggestions(suggestions || []);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <ProfileHeader user={user} />
      {globalError && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
          <h3 className="text-lg font-medium">Error</h3>
          <p className="mt-1">{globalError}</p>
        </div>
      )}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <ClerkAccountManager />
      </div>
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <GeoapifyContext apiKey={process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <GeoapifyGeocoderAutocomplete
              placeholder="Type city name"
              type="city"
              placeSelect={onPlaceSelect}
              suggestionsChange={onSuggestionChange}
              filterByCountryCode={["gb"]}
              filterByPlaceId={selectedCity?.placeId}
              biasByLocation={
                selectedCity
                  ? {
                      lat: selectedCity.lat,
                      lon: selectedCity.lon,
                      radiusKm: 5,
                    }
                  : undefined
              }
            />
            {cityError && (
              <p className="mt-1 text-sm text-red-600">{cityError}</p>
            )}
          </div>
          {/* <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address
            </label>
            <div className={!citySelected ? "opacity-50" : ""}>
              {citySelected && (
                <GeoapifyGeocoderAutocomplete
                  placeholder={
                    citySelected && selectedCity
                      ? `Enter street in ${selectedCity.city}`
                      : "First select a city"
                  }
                  type="street"
                  placeSelect={onStreetSelect}
                  suggestionsChange={onSuggestionChange}
                  filterByCountryCode={["gb"]}
                  biasByLocation={
                    selectedCity
                      ? { lat: selectedCity.lat, lon: selectedCity.lon }
                      : undefined
                  }
                />
              )}
              {streetError && (
                <p className="mt-1 text-sm text-red-600">{streetError}</p>
              )}
              {citySelected && !streetError && (
                <p className="mt-1 text-sm text-gray-500">
                  Please select a street in {selectedCity?.city}
                </p>
              )}
            </div>
          </div> */}
        </GeoapifyContext>
      </div>
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6"></div>
      <div className="bg-white shadow-sm rounded-lg p-6">
        <PreferencesSection
          preferences={
            profileData.preferences || {
              receiveMarketingEmails: false,
              darkMode: false,
              savePaymentInfo: false,
            }
          }
          onTogglePreferenceAction={handleTogglePreference}
        />
      </div>
    </div>
  );
}
