import { useState } from "react";

export default function AddressForm() {
  const [form, setForm] = useState({
    postcode: "SW1A 1AA",
    city: "London",
    street: "Buckingham Palace Road",
    houseNumber: "1",
    apartment: "",
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setMessage("");

    try {
      // interact with mapbox api to verify whether the address is legitimate
      if (isLegitimateAddress) {
        setMessage("Address verified successfully!");
      } else {
        setMessage(
          "Address not found. Please check your details and try again."
        );
      }
    } catch (error) {
      setMessage("Error verifying address. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {message && (
        <div
          style={{
            padding: "10px",
            marginBottom: "10px",
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
      />
      <input
        name="city"
        placeholder="City"
        value={form.city}
        onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
      />
      <input
        name="street"
        placeholder="Street"
        value={form.street}
        onChange={(e) => setForm((f) => ({ ...f, street: e.target.value }))}
      />
      <input
        name="houseNumber"
        placeholder="House Number"
        value={form.houseNumber}
        onChange={(e) =>
          setForm((f) => ({ ...f, houseNumber: e.target.value }))
        }
      />
      <input
        name="apartment"
        placeholder="Apartment, Suite (optional)"
        value={form.apartment}
        onChange={(e) => setForm((f) => ({ ...f, apartment: e.target.value }))}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Verifying..." : "Submit"}
      </button>
    </form>
  );
}
