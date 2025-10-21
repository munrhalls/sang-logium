import { useState } from "react";
export default function AddressForm() {
  const [form, setForm] = useState({
    postcode: "",
    city: "",
    street: "",
    houseNumber: "",
    apartment: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async () => {
    setIsLoading(true);
    setMessage("");
    try {
      const addressLines = [
        `${form.houseNumber} ${form.street}${form.apartment ? `, ${form.apartment}` : ""}`,
        `${form.city} ${form.postcode}`,
      ].filter(Boolean);
      const requestBody = {
        address: {
          addressLines,
          regionCode: "GB",
        },
      };
      const response = await fetch(
        "https:
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        },
      );
      if (!response.ok) {
        throw new Error("Failed to verify address");
      }
      const data = await response.json();
      const result = data.result;
      const _verdict = result?.verdict;
      const addressComponents = result?.address?.addressComponents || [];
      const allComponentsConfirmed = addressComponents.every(
        (component: { confirmationLevel: string }) =>
          component.confirmationLevel === "CONFIRMED",
      );
      if (allComponentsConfirmed && addressComponents.length > 0) {
        const validatedAddress = result.address;
        const returnedPostcode = validatedAddress?.postalCode;
        const inputPostcode = form.postcode.replace(/\s/g, "").toUpperCase();
        const normalizedReturnedPostcode = returnedPostcode
          ?.replace(/\s/g, "")
          .toUpperCase();
        if (returnedPostcode && inputPostcode !== normalizedReturnedPostcode) {
          setMessage(
            `Address found, but postcode does not match. Expected ${inputPostcode}, got ${returnedPostcode}.`,
          );
        } else {
          setMessage("Address verified successfully!");
        }
      } else {
        const unconfirmedComponents = addressComponents
          .filter(
            (component: { confirmationLevel: string }) =>
              component.confirmationLevel !== "CONFIRMED",
          )
          .map(
            (component: {
              componentType: unknown;
              confirmationLevel: unknown;
            }) => `${component.componentType} (${component.confirmationLevel})`,
          );
        setMessage(
          `Address validation failed: ${
            unconfirmedComponents.length > 0
              ? `Unconfirmed components: ${unconfirmedComponents.join(", ")}`
              : "No valid address components found"
          }. Please check your details and try again.`,
        );
      }
    } catch (error) {
      setMessage("Error verifying address. Please try again.");
      console.error("Validation error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      {message && (
        <div
          style={{
            padding: "10px",
            borderRadius: "4px",
            backgroundColor: message.includes("verified")
              ? "#d4edda"
              : "#f8d7da",
            color: message.includes("verified") ? "#155724" : "#721c24",
          }}
        >
          {message}
        </div>
      )}
      <input
        name="postcode"
        placeholder="Postcode"
        value={form.postcode}
        onChange={(e) => setForm((f) => ({ ...f, postcode: e.target.value }))}
        className="w-full p-2 border border-gray-300 rounded"
      />
      <input
        name="city"
        placeholder="City"
        value={form.city}
        onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
        className="w-full p-2 border border-gray-300 rounded"
      />
      <input
        name="street"
        placeholder="Street"
        value={form.street}
        onChange={(e) => setForm((f) => ({ ...f, street: e.target.value }))}
        className="w-full p-2 border border-gray-300 rounded"
      />
      <input
        name="houseNumber"
        placeholder="House Number"
        value={form.houseNumber}
        onChange={(e) =>
          setForm((f) => ({ ...f, houseNumber: e.target.value }))
        }
        className="w-full p-2 border border-gray-300 rounded"
      />
      <input
        name="apartment"
        placeholder="Apartment, Suite (optional)"
        value={form.apartment}
        onChange={(e) => setForm((f) => ({ ...f, apartment: e.target.value }))}
        className="w-full p-2 border border-gray-300 rounded"
      />
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isLoading ? "Verifying..." : "Submit"}
      </button>
    </div>
  );
}
