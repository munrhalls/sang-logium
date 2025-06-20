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

  const comparePostcodeToGeoapify = (
    postcodeData: any,
    geoapifyData: any
  ): boolean => {
    console.log("POSTCODE DATA", postcodeData, "GEO DATA", geoapifyData);

    try {
      const postcodeCoords = {
        lat: postcodeData.result.latitude,
        lon: postcodeData.result.longitude,
      };

      const geoapifyCoords = {
        lat: geoapifyData.features[0].properties.lat,
        lon: geoapifyData.features[0].properties.lon,
      };

      const latDiff = Math.abs(postcodeCoords.lat - geoapifyCoords.lat);
      const lonDiff = Math.abs(postcodeCoords.lon - geoapifyCoords.lon);

      const tolerance = 0.0005;
      const isMatch = latDiff <= tolerance && lonDiff <= tolerance;

      console.log("Coordinate comparison:", {
        postcodeCoords,
        geoapifyCoords,
        latDiff,
        lonDiff,
        isMatch,
      });

      return isMatch;
    } catch (error) {
      console.error("Error comparing coordinates:", error);
      return false;
    }
  };

  const validateGeoapifyConfidence = (data: any): boolean => {
    if (!data.features?.length) return false;

    const feature = data.features[0];
    const rank = feature.properties?.rank;

    if (
      !rank ||
      rank.confidence < 0.98 ||
      rank.confidence_city_level < 0.98 ||
      rank.confidence_street_level < 0.98 ||
      rank.confidence_building_level !== 1
    )
      return false;

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!GEOAPIFY_API_KEY) {
      setMessage(
        "Error verifying address due to server downtime. Please try again later."
      );
      console.error("API key in AddressForm.tsx not configured!");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const [postcodeResponse, geoapifyResponse] = await Promise.all([
        fetch(
          `https://api.postcodes.io/postcodes/${form.postcode.replace(/\s/g, "")}`
        ),
        fetch(
          `https://api.geoapify.com/v1/geocode/search?` +
            `housenumber=${encodeURIComponent(form.houseNumber)}&` +
            `street=${encodeURIComponent(form.street)}&` +
            `city=${encodeURIComponent(form.city)}&` +
            `postcode=${encodeURIComponent(form.postcode)}&` +
            `country=GB&` +
            `apiKey=${GEOAPIFY_API_KEY}`
        ),
      ]);

      if (!geoapifyResponse.ok) {
        console.error("Geoapify API in AddressForm responds with 401");
        setMessage("Error verifying address. Please try again.");
        return;
      }

      const [postcodeData, geoapifyData] = await Promise.all([
        postcodeResponse.json(),
        geoapifyResponse.json(),
      ]);

      const geoapifyValid = validateGeoapifyConfidence(geoapifyData);
      const postcodeValid =
        postcodeData.status === 200 && !!postcodeData.result;

      let isLegitimateAddress;

      if (geoapifyValid && postcodeValid) {
        isLegitimateAddress = comparePostcodeToGeoapify(
          postcodeData,
          geoapifyData
        );
      } else {
        isLegitimateAddress = false;
      }

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
