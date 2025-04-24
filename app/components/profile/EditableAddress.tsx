"use client";

import { useState, useEffect } from "react";
import { Address } from "@/sanity/lib/profiles/profileTypes";
import {
  verifyAddress,
  AddressVerificationResult,
} from "@/lib/address/verifyAddress";

// List of common countries for validation
const COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Korea, North",
  "Korea, South",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

interface FieldConfig {
  key: keyof Address;
  label: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: { regex: RegExp; message: string };
  placeholder?: string;
}

interface EditableAddressProps {
  address: Address;
  onSaveAction: (field: keyof Address, value: string) => Promise<void>;
  onChange?: (field: keyof Address, value: string) => void;
}

export default function EditableAddress({
  address,
  onSaveAction,
  onChange,
}: EditableAddressProps) {
  const [editField, setEditField] = useState<keyof Address | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [saveSuccess, setSaveSuccess] = useState<keyof Address | null>(null);
  const [pendingChanges, setPendingChanges] = useState<Partial<Address>>({});
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const [isSavingAll, setIsSavingAll] = useState(false);
  const [countrySuggestions, setCountrySuggestions] = useState<string[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationErrors, setVerificationErrors] = useState<string[]>([]);
  const [addressSuggestions, setAddressSuggestions] = useState<
    Partial<Address>
  >({});
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [bypassVerification, setBypassVerification] = useState(false);

  useEffect(() => {
    setHasPendingChanges(Object.keys(pendingChanges).length > 0);
  }, [pendingChanges]);

  const handleEdit = (field: keyof Address) => {
    setEditField(field);
    setEditValue(address[field] || "");
    setError(null);
    setValidationErrors([]);
  };

  const handleCancel = () => {
    setEditField(null);
    setError(null);
    setValidationErrors([]);
  };

  const handleChange = (newValue: string) => {
    setEditValue(newValue);

    if (onChange && editField) {
      onChange(editField, newValue);
    }

    // Generate country suggestions for the country field
    if (editField === "country" && newValue.trim().length > 1) {
      const searchTerm = newValue.trim().toLowerCase();
      const matches = COUNTRIES.filter((country) =>
        country.toLowerCase().includes(searchTerm)
      ).slice(0, 5); // Limit to top 5 matches

      setCountrySuggestions(matches);
    } else {
      setCountrySuggestions([]);
    }

    // Live validation with debounce effect
    // Only validate after user has stopped typing for a bit
    if (editField) {
      // Clear previous validation timeout
      const timeoutId = setTimeout(() => {
        // Only validate if there's content to validate
        if (newValue.trim().length > 0) {
          validateField(editField, newValue);
        } else {
          // Clear validation errors if field is empty
          setValidationErrors([]);
        }
      }, 500); // 500ms debounce

      // Cleanup timeout on next change
      return () => clearTimeout(timeoutId);
    }
  };

  const getFieldConfig = (key: keyof Address): FieldConfig => {
    const configs: Record<keyof Address, FieldConfig> = {
      streetAddress: {
        key: "streetAddress",
        label: "Street Address",
        minLength: 5,
        maxLength: 100,
        pattern: {
          // Allow alphanumeric, spaces, and common address symbols, but prevent excessive repetition
          regex:
            /^(?!.*(.)\1{4})[a-zA-Z0-9](?:[a-zA-Z0-9\s.,\-#/\\'()&]+[a-zA-Z0-9])?$/,
          message:
            "Enter a valid street address with letters, numbers, and common symbols",
        },
        placeholder: "Enter your street address (e.g., 123 Main St, Apt 4B)",
      },
      city: {
        key: "city",
        label: "City",
        minLength: 2,
        maxLength: 50,
        pattern: {
          // Only letters, spaces, hyphens. Prevents excessive repetition and requires real word patterns
          regex: /^(?!.*(.)\1{3})[a-zA-Z](?:[a-zA-Z\s\-'\.]+[a-zA-Z])?$/,
          message:
            "City must contain only letters, spaces, and hyphens (no numbers or special characters)",
        },
        placeholder: "Enter your city (e.g., San Francisco, New York)",
      },
      state: {
        key: "state",
        label: "State/Province",
        minLength: 2,
        maxLength: 30,
        pattern: {
          // Only letters, spaces, hyphens. Prevents excessive repetition.
          regex: /^(?!.*(.)\1{3})[a-zA-Z](?:[a-zA-Z\s\-'\.]+[a-zA-Z])?$/,
          message:
            "State/Province must contain only letters, spaces, and hyphens",
        },
        placeholder: "Enter your state or province (e.g., California, Ontario)",
      },
      postalCode: {
        key: "postalCode",
        label: "Postal Code",
        pattern: {
          // Accepts common postal code formats with reasonable length limits:
          // US: 12345 or 12345-6789
          // Canada: A1A 1A1
          // UK: AA1 1AA or A1 1AA or A1A 1AA
          // And other reasonable alphanumeric formats, preventing arbitrary strings
          regex: /^[a-zA-Z0-9]{1,4}([\s-][a-zA-Z0-9]{1,4}){0,2}$/,
          message:
            "Enter a valid postal/zip code format (e.g., 12345, A1A 1A1)",
        },
        placeholder: "Enter your postal/zip code (e.g., 12345, A1A 1A1)",
      },
      country: {
        key: "country",
        label: "Country",
        minLength: 2,
        maxLength: 50,
        pattern: {
          // Only letters, spaces, hyphens. Country names follow proper noun capitalization
          regex: /^(?!.*(.)\1{3})[A-Z][a-zA-Z\s\-'\.]*[a-zA-Z]$/,
          message:
            "Country must be a valid country name starting with a capital letter",
        },
        placeholder: "Enter your country (e.g., United States, Canada)",
      },
    };

    return configs[key];
  };

  const validateField = (field: keyof Address, value: string): string[] => {
    const errors: string[] = [];
    const config = getFieldConfig(field);
    const trimmedValue = value.trim();

    // Skip validation for empty non-required fields
    if (!trimmedValue && !config.required) {
      return errors;
    }

    // Check required
    if (config.required && !trimmedValue) {
      errors.push(`${config.label} is required`);
      setValidationErrors(errors);
      return errors; // Return early since other validations require content
    }

    // Check min length only if the field has content
    if (
      trimmedValue &&
      config.minLength &&
      trimmedValue.length < config.minLength
    ) {
      errors.push(
        `${config.label} must be at least ${config.minLength} characters`
      );
    }

    // Check max length
    if (config.maxLength && trimmedValue.length > config.maxLength) {
      errors.push(
        `${config.label} cannot exceed ${config.maxLength} characters`
      );
    }

    // Check pattern
    if (
      trimmedValue &&
      config.pattern &&
      !config.pattern.regex.test(trimmedValue)
    ) {
      errors.push(config.pattern.message);
    }

    // Advanced validation based on field type
    switch (field) {
      case "streetAddress":
        // Check for excessive repetition of characters (gibberish like "aaaaaaaa")
        if (/(.)\1{4,}/.test(trimmedValue)) {
          errors.push(
            "Address appears to contain excessive repetition. Please enter a valid address."
          );
        }

        // Check for excessive non-letter/non-number content
        const nonAlphaNumericCount = (trimmedValue.match(/[^a-zA-Z0-9]/g) || [])
          .length;
        const alphaNumericCount = (trimmedValue.match(/[a-zA-Z0-9]/g) || [])
          .length;

        if (nonAlphaNumericCount > alphaNumericCount) {
          errors.push(
            "Address contains too many special characters compared to letters and numbers."
          );
        }

        // Check for missing numbers (most street addresses have at least one number)
        if (!/\d/.test(trimmedValue) && trimmedValue.length > 5) {
          errors.push(
            "Most street addresses include a number. Please check if your address is correct."
          );
        }

        if (/[^a-zA-Z0-9\s.,\-#/\\'()&]/.test(trimmedValue)) {
          errors.push(
            "Invalid character detected. Please remove special characters not typically used in addresses."
          );
        }
        break;

      case "city":
        // Check for excessive repetition (gibberish like "aaaaa")
        if (/(.)\1{3,}/.test(trimmedValue)) {
          errors.push(
            "City name appears to contain excessive repetition. Please enter a valid city name."
          );
        }

        // Check for excessive spaces or non-alphabetic content
        if (
          (trimmedValue.match(/\s/g) || []).length >
          trimmedValue.length / 3
        ) {
          errors.push("City name contains too many spaces.");
        }

        if (/\d/.test(trimmedValue)) {
          errors.push("City name should not contain numbers.");
        }

        if (/[^a-zA-Z\s\-'\."]/.test(trimmedValue)) {
          errors.push("City name contains invalid special characters.");
        }
        break;

      case "state":
        // Check for excessive repetition (gibberish like "aaaaa")
        if (/(.)\1{3,}/.test(trimmedValue)) {
          errors.push(
            "State/Province appears to contain excessive repetition. Please enter a valid name."
          );
        }

        // Most states/provinces don't have numbers
        if (/\d/.test(trimmedValue)) {
          errors.push("State/Province name should not contain numbers.");
        }

        if (/[^a-zA-Z\s\-'\."]/.test(trimmedValue)) {
          errors.push("State/Province contains invalid special characters.");
        }
        break;

      case "postalCode":
        // Check length ranges
        if (trimmedValue.length < 3) {
          errors.push("Postal code seems too short.");
        } else if (trimmedValue.length > 12) {
          errors.push("Postal code seems too long.");
        }

        // Check for valid characters
        if (/[^a-zA-Z0-9\s\-]/.test(trimmedValue)) {
          errors.push(
            "Postal code should only contain letters, numbers, spaces, and hyphens."
          );
        }

        // Check for at least one number (most postal codes have numbers)
        if (!/\d/.test(trimmedValue)) {
          errors.push("Most postal codes include at least one number.");
        }
        break;

      case "country":
        // Validate against our list of countries (case-insensitive)
        const countryMatch = COUNTRIES.find(
          (country) => country.toLowerCase() === trimmedValue.toLowerCase()
        );

        if (!countryMatch && trimmedValue.length > 0) {
          errors.push(
            "Please enter a valid country name from the list of recognized countries."
          );

          // Suggest close matches if possible
          const possibleMatches = COUNTRIES.filter(
            (country) =>
              country.toLowerCase().includes(trimmedValue.toLowerCase()) ||
              trimmedValue
                .toLowerCase()
                .includes(country.toLowerCase().substring(0, 3))
          ).slice(0, 3);

          if (possibleMatches.length > 0) {
            errors.push(`Did you mean: ${possibleMatches.join(", ")}?`);
          }
        }

        // Check for excessive repetition (gibberish like "aaaaa")
        if (/(.)\1{3,}/.test(trimmedValue)) {
          errors.push("Country name appears to contain excessive repetition.");
        }

        if (/\d/.test(trimmedValue)) {
          errors.push("Country name should not contain numbers.");
        }
        break;
    }

    setValidationErrors(errors);
    return errors;
  };

  const handleAddPendingChange = () => {
    if (!editField) return;

    // Validate field
    const errors = validateField(editField, editValue);
    if (errors.length > 0) {
      return;
    }

    // Only add to pending changes if the value is different
    if (editValue !== address[editField]) {
      setPendingChanges((prev) => ({
        ...prev,
        [editField]: editValue,
      }));
    }

    setEditField(null);
  };

  const handleSave = async () => {
    if (!editField) return;

    // Validate field
    const errors = validateField(editField, editValue);
    if (errors.length > 0) {
      return;
    }

    if (editValue === address[editField]) {
      setEditField(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onSaveAction(editField, editValue);
      setEditField(null);
      setSaveSuccess(editField);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(null);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Verify the complete address before saving
   */
  const verifyCompleteAddress = async (): Promise<boolean> => {
    // Create a complete address object with both pending changes and existing values
    const completeAddress: Partial<Address> = {
      ...address,
      ...pendingChanges,
    };

    // Skip verification if bypass is enabled
    if (bypassVerification) {
      return true;
    }

    // Only verify if we have meaningful address parts (at least street and city)
    if (!completeAddress.streetAddress || !completeAddress.city) {
      setError("Please provide both street address and city before saving");
      return false; // Make this required now - don't allow incomplete addresses
    }

    setIsVerifying(true);
    setVerificationErrors([]);
    setAddressSuggestions({});
    setShowAddressSuggestions(false);

    try {
      // Call our address verification service with external API enabled by default
      const result = await verifyAddress(completeAddress);

      // If verification failed, show errors and suggestions
      if (!result.isValid) {
        // Check if this is clearly nonsensical input that should not be bypassable
        const containsObviousGibberish = result.errors.some(
          (error) =>
            error.includes("keyboard patterns") ||
            error.includes("excessive repetition") ||
            error.includes("suspicious pattern") ||
            error.includes("nonsensical")
        );

        // If the address has obvious nonsense, make it non-bypassable
        if (containsObviousGibberish) {
          setVerificationErrors([
            ...result.errors,
            "This address contains obviously invalid patterns and cannot be saved.",
          ]);

          // Reset bypass flag - user must fix the address
          setBypassVerification(false);
          return false;
        }

        // Otherwise, show normal errors that can be bypassed
        setVerificationErrors(result.errors);

        // If suggestions are available, show them
        if (result.suggestions && Object.keys(result.suggestions).length > 0) {
          setAddressSuggestions(result.suggestions);
          setShowAddressSuggestions(true);
        }

        return false;
      }

      // Verification passed
      return true;
    } catch (error) {
      // In case of verification service failure, log error but allow saving
      console.error("Address verification failed:", error);
      setError(
        "Address verification service unavailable. You may proceed with saving, but please verify your address is correct."
      );
      return true;
    } finally {
      setIsVerifying(false);
    }
  };

  /**
   * Apply suggested address corrections
   */
  const applySuggestions = () => {
    // Apply each suggestion to pending changes
    const newPendingChanges = { ...pendingChanges };

    Object.entries(addressSuggestions).forEach(([key, value]) => {
      if (value) {
        newPendingChanges[key as keyof Address] = value;
      }
    });

    setPendingChanges(newPendingChanges);
    setShowAddressSuggestions(false);
    setVerificationErrors([]);
  };

  const handleSaveAll = async () => {
    // First validate all pending changes
    const allErrors: Record<string, string[]> = {};
    let hasValidationErrors = false;

    for (const [field, value] of Object.entries(pendingChanges)) {
      const fieldErrors = validateField(
        field as keyof Address,
        value as string
      );
      if (fieldErrors.length > 0) {
        allErrors[field] = fieldErrors;
        hasValidationErrors = true;
      }
    }

    if (hasValidationErrors) {
      setError("Please correct validation errors before saving");
      return;
    }

    // Verify address before saving
    const isAddressValid = await verifyCompleteAddress();
    if (!isAddressValid && !bypassVerification) {
      setError("Address verification failed. Please review the errors below.");
      return;
    }

    setIsSavingAll(true);
    setError(null);

    try {
      // Process all pending changes sequentially
      for (const [field, value] of Object.entries(pendingChanges)) {
        await onSaveAction(field as keyof Address, value as string);
      }

      // Clear pending changes on success
      setPendingChanges({});
      setSaveSuccess("city"); // Just a visual indicator
      setBypassVerification(false); // Reset bypass flag

      setTimeout(() => {
        setSaveSuccess(null);
      }, 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save address changes"
      );
    } finally {
      setIsSavingAll(false);
    }
  };

  const handleCancelAll = () => {
    setPendingChanges({});
    setError(null);
  };

  const selectCountrySuggestion = (country: string) => {
    setEditValue(country);
    setCountrySuggestions([]);

    if (editField === "country") {
      // Validate immediately on selection
      validateField("country", country);
    }
  };

  const fields: (keyof Address)[] = [
    "streetAddress",
    "city",
    "state",
    "postalCode",
    "country",
  ];

  return (
    <div className="border rounded-md p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Address Information</h3>

        {hasPendingChanges && (
          <div className="flex space-x-2">
            <button
              onClick={handleCancelAll}
              disabled={isSavingAll}
              className="px-3 py-1 text-xs text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel All
            </button>
            <button
              onClick={handleSaveAll}
              disabled={isSavingAll}
              className={`px-3 py-1 text-xs text-white rounded-md ${
                isSavingAll
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSavingAll ? "Saving..." : "Save All Changes"}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {isVerifying && (
        <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded-md flex items-center">
          <svg
            className="animate-spin h-4 w-4 text-blue-500 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-xs text-blue-600">Verifying address...</p>
        </div>
      )}

      {verificationErrors.length > 0 && (
        <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm font-medium text-red-700 mb-1">
            Address Verification Failed
          </p>
          <ul className="list-disc pl-5 space-y-1">
            {verificationErrors.map((err, index) => (
              <li key={index} className="text-xs text-red-600">
                {err}
              </li>
            ))}
          </ul>

          {showAddressSuggestions && (
            <div className="mt-3 pt-3 border-t border-red-200">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Suggested Corrections:
              </p>
              {Object.entries(addressSuggestions).map(
                ([field, value]) =>
                  value && (
                    <div key={field} className="text-xs mb-1">
                      <span className="font-medium">{field}:</span> {value}
                    </div>
                  )
              )}

              <div className="flex space-x-2 mt-2">
                <button
                  onClick={applySuggestions}
                  className="px-3 py-1 text-xs text-white bg-green-600 hover:bg-green-700 rounded-md"
                >
                  Apply Suggestions
                </button>
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to use this address with suggestions ignored? It may be incorrect or undeliverable."
                      )
                    ) {
                      setBypassVerification(true);
                    }
                  }}
                  className="px-3 py-1 text-xs text-orange-600 bg-orange-100 hover:bg-orange-200 rounded-md flex items-center"
                >
                  <svg
                    className="h-3 w-3 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Ignore Suggestions & Use My Address
                </button>
              </div>
            </div>
          )}

          {!showAddressSuggestions && (
            <div className="mt-3">
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to use this address without verification? It may be incorrect or undeliverable."
                    )
                  ) {
                    setBypassVerification(true);
                  }
                }}
                className="px-3 py-1 text-xs text-orange-600 bg-orange-100 hover:bg-orange-200 rounded-md flex items-center"
              >
                <svg
                  className="h-3 w-3 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Override Verification & Use My Address
              </button>
            </div>
          )}
        </div>
      )}

      {fields.map((key) => {
        const config = getFieldConfig(key);
        // Use pending change if available, otherwise use original address
        const displayValue =
          key in pendingChanges ? pendingChanges[key] : address[key];
        const isPending = key in pendingChanges;

        return (
          <div
            key={key}
            className={`mb-4 ${isPending ? "bg-blue-50 p-2 rounded-md" : ""}`}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-700">
                {config.label}
                {config.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
                {isPending && (
                  <span className="ml-2 text-xs text-blue-600">
                    (Change pending)
                  </span>
                )}
              </label>
              {editField !== key && !isPending && (
                <button
                  onClick={() => handleEdit(key)}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
              )}
            </div>

            {editField === key ? (
              <div>
                <div className="relative">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder={config.placeholder}
                    className={`w-full px-3 py-2 border ${
                      validationErrors.length > 0
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 ${
                      validationErrors.length > 0
                        ? "focus:ring-red-500"
                        : "focus:ring-blue-500"
                    }`}
                    disabled={isLoading}
                    onBlur={(e) => {
                      // Delay blur to allow clicking on suggestions
                      setTimeout(() => {
                        if (
                          key === "country" &&
                          countrySuggestions.length > 0
                        ) {
                          setCountrySuggestions([]);
                        }
                        validateField(key, editValue);
                      }, 200);
                    }}
                    aria-invalid={validationErrors.length > 0}
                    aria-describedby={
                      validationErrors.length > 0 ? `${key}-error` : undefined
                    }
                    list={key === "country" ? "country-datalist" : undefined}
                  />
                  {validationErrors.length > 0 && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-red-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Country Suggestions Dropdown */}
                  {key === "country" && countrySuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      <ul className="py-1">
                        {countrySuggestions.map((country, index) => (
                          <li
                            key={index}
                            className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-50"
                            onClick={() => selectCountrySuggestion(country)}
                          >
                            {country}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {validationErrors.length > 0 && (
                  <ul className="mt-1 space-y-1" id={`${key}-error`}>
                    {validationErrors.map((err, index) => (
                      <li
                        key={index}
                        className="text-xs text-red-600 flex items-start"
                      >
                        <span className="inline-block mr-1">⚠️</span>
                        <span>{err}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex justify-between mt-2">
                  <div className="text-xs text-gray-500">
                    {key === "streetAddress" && (
                      <div>
                        <span className="font-semibold">Requirements:</span>{" "}
                        5-100 characters, must include numbers and letters
                        <br />
                        <span className="italic">
                          Example: 123 Main St, Apt 4B
                        </span>
                      </div>
                    )}
                    {key === "city" && (
                      <div>
                        <span className="font-semibold">Requirements:</span>{" "}
                        Letters only, no numbers
                        <br />
                        <span className="italic">
                          Example: San Francisco, New York
                        </span>
                      </div>
                    )}
                    {key === "state" && (
                      <div>
                        <span className="font-semibold">Requirements:</span>{" "}
                        Letters only, 2-30 characters
                        <br />
                        <span className="italic">
                          Example: California, Ontario
                        </span>
                      </div>
                    )}
                    {key === "postalCode" && (
                      <div>
                        <span className="font-semibold">Requirements:</span>{" "}
                        3-10 characters, must include at least one number
                        <br />
                        <span className="italic">Example: 12345, A1A 1A1</span>
                      </div>
                    )}
                    {key === "country" && (
                      <div>
                        <span className="font-semibold">Requirements:</span>{" "}
                        Must be a recognized country name
                        <br />
                        <span className="italic">
                          Example: United States, Canada, Germany, etc.
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCancel}
                      className="px-3 py-1 text-xs text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddPendingChange}
                      className={`px-3 py-1 text-xs text-white rounded-md ${
                        isLoading || validationErrors.length > 0
                          ? "bg-blue-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                      disabled={isLoading || validationErrors.length > 0}
                    >
                      Stage Change
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <p className="text-gray-900">
                  {displayValue || (
                    <span className="text-gray-400">Not set</span>
                  )}
                </p>
                {saveSuccess === key && (
                  <span className="ml-2 text-xs text-green-600 animate-fade-out">
                    ✓ Saved
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}

      {hasPendingChanges && (
        <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-xs text-yellow-700">
            You have pending changes. Click "Save All Changes" to apply them or
            "Cancel All" to discard.
          </p>
          {bypassVerification && (
            <div className="mt-2 flex items-center text-xs text-orange-700">
              <svg
                className="h-4 w-4 mr-1 text-orange-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Address verification is being bypassed. Your address will be saved
              without verification.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
