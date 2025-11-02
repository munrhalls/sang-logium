import { useState } from "react";
// Shipping component
// Collects and validates shipping address
// Makes post request to /api/shipping to validate address with google maps address validation API
// receives RESPONSE and shows validation result to user
// On success, shifts view to the next step and passes validated address to Checkout component, which passes it to Stripe Checkout Session creation
// On failure, shows error message and allows user to re-enter address

// the form should involve basic validation pre-submission (e.g., required fields, proper format)

export default function Shipping() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const handleShipping = () => {
    setIsModalOpen(true);
  };

  const handleAddressValidation = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/shipping", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    console.log(data, " --- ADDRESS VALIDATION RESPONSE");

    // Handle response (show success or error to user)
    // If success, close modal and pass address to Checkout component
    // If error, show error message
  };

  return (
    <>
      <div>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="rounded bg-white p-4">
              <form>
                <h2 className="mb-4 text-lg font-bold">
                  Enter Shipping Address
                </h2>

                <input
                  onChange={(e) => setForm({ ...form, street: e.target.value })}
                  type="text"
                  placeholder="Street Address"
                  className="mb-2 w-full border border-gray-300 p-2"
                />
                <input
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  type="text"
                  placeholder="City"
                  className="mb-2 w-full border border-gray-300 p-2"
                />
                <input
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  type="text"
                  placeholder="State/Province"
                  className="mb-2 w-full border border-gray-300 p-2"
                />

                <input
                  onChange={(e) =>
                    setForm({ ...form, postalCode: e.target.value })
                  }
                  type="text"
                  placeholder="Postal Code"
                  className="mb-2 w-full border border-gray-300 p-2"
                />
                <input
                  onChange={(e) =>
                    setForm({ ...form, country: e.target.value })
                  }
                  type="text"
                  placeholder="Country"
                  className="mb-4 w-full border border-gray-300 p-2"
                />
                <button
                  onClick={handleAddressValidation}
                  type="submit"
                  className="w-full rounded bg-black px-4 py-2 text-white"
                >
                  Validate Address
                </button>
              </form>

              <button
                onClick={() => setIsModalOpen(false)}
                className="mt-4 rounded bg-black px-4 py-2 text-white"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleShipping}
        className="flex w-full items-center justify-center rounded-sm bg-black py-4 text-lg font-medium text-white transition-colors hover:bg-gray-800"
      >
        Shipping
      </button>
    </>
  );
}
