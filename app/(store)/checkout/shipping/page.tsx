import Link from "next/link";

export default function Shipping() {
  return (
    <div>
      <div className="p-3 border border-black rounded-lg">
        <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">
          Shipping Information
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              required
              // value={form.name}
              // onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              autoComplete="name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              // value={form.email}
              // onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              required
              // value={form.address}
              // onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              autoComplete="street-address"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                required
                // value={form.city}
                // onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                autoComplete="address-level2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                required
                // value={form.postalCode}
                // onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                autoComplete="postal-code"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <input
              type="text"
              name="country"
              required
              // value={form.country}
              // onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              autoComplete="country"
            />
          </div>
        </div>
      </div>

      <Link
        href="/checkout/payment"
        className="inline-block my-8
    w-full sm:w-auto
    bg-black text-white
    hover:bg-gray-800
    py-3 px-6
    rounded-lg
    font-semibold
    uppercase tracking-wider
    transition duration-200
    text-center
  "
      >
        Continue to Payment
      </Link>
    </div>
  );
}
