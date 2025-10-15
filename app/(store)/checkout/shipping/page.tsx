import Link from "next/link";

export default function Shipping() {
  // this form should utilize react-hook-form and zod
  // it should, then, save the data to a global state (zustand) and redirect to /checkout/payment
  // the button should be disabled until the form is valid
  // the form should be pre-filled if data exists in the global state
  // the errors should be displayed below the inputs
  // the form should be responsive and look good on mobile and desktop
  // the form should have proper labels and accessibility features
  // the form should have a nice design and be easy to use
  // the form should have a loading state when submitting
  // the form should handle errors from the submission process
  // the form should have a success state when submission is successful
  // the form should NOT save the data to local storage for security reasons, only to the global state

  return (
    <div>
      <div className="rounded-lg border border-black p-3">
        <h2 className="mb-4 border-b border-gray-200 pb-2 text-lg font-bold">
          Shipping Information
        </h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              required
              // value={form.name}
              // onChange={handleInputChange}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              autoComplete="name"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              // value={form.email}
              // onChange={handleInputChange}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              name="address"
              required
              // value={form.address}
              // onChange={handleInputChange}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              autoComplete="street-address"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                name="city"
                required
                // value={form.city}
                // onChange={handleInputChange}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                autoComplete="address-level2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                required
                // value={form.postalCode}
                // onChange={handleInputChange}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                autoComplete="postal-code"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Country
            </label>
            <input
              type="text"
              name="country"
              required
              // value={form.country}
              // onChange={handleInputChange}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              autoComplete="country"
            />
          </div>
        </div>
      </div>

      <Link
        href="/checkout/payment"
        className="my-8 inline-block w-full rounded-lg bg-black px-6 py-3 text-center font-semibold uppercase tracking-wider text-white transition duration-200 hover:bg-gray-800 sm:w-auto"
      >
        Continue to Payment
      </Link>
    </div>
  );
}
