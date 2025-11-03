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
    streetNumber: 0,
    street: "",
    city: "",
    state: "",
    postalCode: "",
    regionCode: "PL",
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
                <p>Country</p>
                <select
                  onChange={(e) =>
                    setForm({ ...form, regionCode: e.target.value })
                  }
                  className="mb-4 w-full border border-gray-300 p-2"
                >
                  <option value="PL">Poland</option>
                  <option value="GB">United Kingdom</option>
                </select>
                <p className="text-sm font-black tracking-wide">Postal code</p>
                <input
                  onChange={(e) =>
                    setForm({ ...form, postalCode: e.target.value })
                  }
                  type="text"
                  placeholder="Postal Code"
                  className="mb-2 w-full border border-gray-300 p-2"
                />
                <div className="grid grid-cols-8 gap-2">
                  <div className="col-span-6">
                    <p className="text-sm font-black tracking-wide">Street</p>
                    <input
                      onChange={(e) =>
                        setForm({ ...form, street: e.target.value })
                      }
                      type="text"
                      placeholder="Street"
                      className="mb-2 w-full border border-gray-300 p-2"
                    />
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-black tracking-wide">Number</p>
                    <input
                      onChange={(e) =>
                        setForm({
                          ...form,
                          streetNumber: parseInt(e.target.value),
                        })
                      }
                      type="number"
                      placeholder="..."
                      className="mb-2 flex w-full items-center justify-center border border-gray-300 p-2"
                    />
                  </div>
                </div>
                <p className="text-sm font-black tracking-wide">Title</p>
                <input
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  type="text"
                  placeholder="City"
                  className="mb-2 w-full border border-gray-300 p-2"
                />{" "}
                <p className="text-sm font-black tracking-wide">Title</p>
                <input
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  type="text"
                  placeholder="State/Province"
                  className="mb-2 w-full border border-gray-300 p-2"
                />
                {/* instead, this should be selectable dropdown with default value for countries and there should only be two countries to select from: GB and PL */}
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
