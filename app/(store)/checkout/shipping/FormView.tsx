"use client";

import { useForm } from "react-hook-form";
import { useCheckout } from "../CheckoutProvider";
import { Address } from "../checkout.types";
import { useEffect } from "react";

export default function ShippingFormView() {
  const { submitAddress, status, address, apiErrors } = useCheckout();

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    formState: { errors, isValid },
  } = useForm<Address>({
    mode: "onChange",
    defaultValues: address || undefined,
  });

  useEffect(() => {
    if (address) {
      reset(address);
      trigger();
    }
  }, [address, reset, trigger]);

  const DXfillScenario = (scenario: "valid" | "invalid_zip" | "partial") => {
    const scenarios = {
      valid: {
        regionCode: "PL",
        postalCode: "50-100",
        street: "Rynek",
        streetNumber: "1",
        city: "Wroclaw",
      },
      invalid_zip: {
        regionCode: "PL",
        postalCode: "00-000",
        street: "Nowhere",
        streetNumber: "99",
        city: "Ghost Town",
      },
      partial: {
        regionCode: "GB",
        postalCode: "SW1A 1AA",
        street: "Buckingham",
        streetNumber: "",
        city: "London",
      },
    };
    reset(scenarios[scenario]);
    trigger();
  };
  // TODO Checkout Form - add onNavigation to link, with "are you sure you want to leave?"
  return (
    <div className="flex justify-center">
      <div className="relative w-full max-w-md rounded bg-white p-4">
        {process.env.NODE_ENV === "development" && (
          <div className="mb-4 flex gap-2">
            <button
              type="button"
              onClick={() => DXfillScenario("valid")}
              className="bg-green-100 px-2 py-1 text-xs text-green-800"
            >
              Fill Valid
            </button>
            <button
              type="button"
              onClick={() => DXfillScenario("invalid_zip")}
              className="bg-red-100 px-2 py-1 text-xs text-red-800"
            >
              Fill Invalid
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit(submitAddress)}>
          <h2 className="mb-4 text-lg font-bold">Enter Shipping Address</h2>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-bold">Country</label>
            <select
              {...register("regionCode", { required: true })}
              className="w-full rounded border border-gray-300 p-2"
            >
              <option value="PL">Poland</option>
              <option value="GB">Great Britain</option>
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
              {apiErrors.form ||
                "We couldn't locate that address on the map. Please double-check your details."}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
