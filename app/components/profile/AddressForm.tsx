import { useState } from "react";

export default function AddressForm() {
  const [form, setForm] = useState({
    postcode: "NW1 6XE",
    city: "London",
    street: "Baker Street",
    houseNumber: "221B",
    apartment: "",
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/search?` +
          `housenumber=${encodeURIComponent(form.houseNumber)}&` +
          `street=${encodeURIComponent(form.street)}&` +
          `city=${encodeURIComponent(form.city)}&` +
          `postcode=${encodeURIComponent(form.postcode)}&` +
          `country=GB&` +
          `apiKey=${GEOAPIFY_API_KEY}`
      );

      if (!response.ok) {
        throw new Error("Failed to verify address");
      }

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        console.log("daata", data);
        const result = data.features[0];
        const properties = result.properties;
        console.log(result);
        setForm((prev) => ({
          ...prev,
          postcode: properties.postcode || prev.postcode,
          city: properties.city || prev.city,
          street: properties.street || prev.street,
        }));

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
