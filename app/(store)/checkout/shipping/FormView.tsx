"use client";

import { useForm } from "react-hook-form";
import { useCheckout } from "../CheckoutProvider";
import { Address } from "../checkout.types";
import { useEffect } from "react";

export default function ShippingFormView() {
  const { submitAddress, status, address } = useCheckout();

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    formState: { errors, isValid },
  } = useForm<Address>({
    mode: "onBlur",
    defaultValues: address || undefined,
  });

  useEffect(() => {
    if (address) {
      reset(address);
      trigger();
    }
  }, [address, reset, trigger]);

  return (
    <div className="flex justify-center">
      <div className="relative w-full max-w-md rounded bg-white p-4">
        <form onSubmit={handleSubmit(submitAddress)}>
          <h2 className="mb-4 text-lg font-bold">Enter Shipping Address</h2>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-bold">Country</label>
            <select
              {...register("regionCode", { required: true })}
              className="w-full rounded border border-gray-300 p-2"
            >
              <option value="PL">Poland</option>
              <option value="GB">United Kingdom</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-bold">Postal Code</label>
            <input
              {...register("postalCode", {
                required: "Postal Code is required.",
                minLength: { value: 5, message: "Min 5 chars." },
              })}
              className="w-full rounded border border-gray-300 p-2"
              placeholder="Postal Code"
            />
            {errors.postalCode && (
              <p className="mt-1 text-xs text-red-500">
                {errors.postalCode.message}
              </p>
            )}
          </div>

          <div className="mb-4 grid grid-cols-4 gap-2">
            <div className="col-span-3">
              <label className="mb-1 block text-sm font-bold">Street</label>
              <input
                {...register("street", { required: "Street is required." })}
                className="w-full rounded border border-gray-300 p-2"
                placeholder="Street Name"
              />
            </div>
            <div className="col-span-1">
              <label className="mb-1 block text-sm font-bold">No.</label>
              <input
                {...register("streetNumber", { required: "Req" })}
                className="w-full rounded border border-gray-300 p-2"
                placeholder="#"
              />
            </div>
          </div>

          {(errors.street || errors.streetNumber) && (
            <p className="mb-4 text-xs text-red-500">
              Street and Number are required.
            </p>
          )}

          <div className="mb-6">
            <label className="mb-1 block text-sm font-bold">City</label>
            <input
              {...register("city", { required: "City is required." })}
              className="w-full rounded border border-gray-300 p-2"
              placeholder="City"
            />
            {errors.city && (
              <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>
            )}
          </div>

          <button
            disabled={!isValid}
            type="submit"
            className={`w-full rounded px-4 py-3 font-bold transition-colors ${
              !isValid
                ? "cursor-not-allowed bg-gray-300 text-gray-500"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            Continue to Payment
          </button>

          {status === "FIX" && (
            <div className="mt-4 rounded bg-red-50 p-3 text-sm text-red-600">
              We couldn&apos;t locate that address on the map. Please
              double-check your details.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
