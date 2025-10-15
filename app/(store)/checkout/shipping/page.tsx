"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCheckoutStore } from "@/store/checkout";
import { useState } from "react";

const shippingSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  address: z
    .string()
    .min(1, "Address is required")
    .min(5, "Address must be at least 5 characters"),
  city: z
    .string()
    .min(1, "City is required")
    .min(2, "City must be at least 2 characters"),
  postalCode: z
    .string()
    .min(1, "Postal code is required")
    .min(3, "Postal code must be at least 3 characters"),
  country: z
    .string()
    .min(1, "Country is required")
    .min(2, "Country must be at least 2 characters"),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

export default function Shipping() {
  const router = useRouter();
  const { shippingInfo, setShippingInfo } = useCheckoutStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    mode: "onChange",
    defaultValues: {
      name: shippingInfo?.name || "",
      email: shippingInfo?.email || "",
      address: shippingInfo?.address || "",
      city: shippingInfo?.city || "",
      postalCode: shippingInfo?.postalCode || "",
      country: shippingInfo?.country || "",
    },
  });

  const onSubmit = async (data: ShippingFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Simulate async operation (e.g., API call)
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Save to global state
      setShippingInfo(data);

      setSubmitSuccess(true);

      // Redirect to payment page
      setTimeout(() => {
        router.push("/checkout/payment");
      }, 300);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "An error occurred. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="rounded-lg border border-black p-3">
          <h2 className="mb-4 border-b border-gray-200 pb-2 text-lg font-bold">
            Shipping Information
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                autoComplete="name"
                aria-invalid={errors.name ? "true" : "false"}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <p
                  id="name-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                autoComplete="email"
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p
                  id="email-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="address"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <input
                id="address"
                type="text"
                {...register("address")}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                autoComplete="street-address"
                aria-invalid={errors.address ? "true" : "false"}
                aria-describedby={errors.address ? "address-error" : undefined}
              />
              {errors.address && (
                <p
                  id="address-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.address.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="city"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  {...register("city")}
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  autoComplete="address-level2"
                  aria-invalid={errors.city ? "true" : "false"}
                  aria-describedby={errors.city ? "city-error" : undefined}
                />
                {errors.city && (
                  <p
                    id="city-error"
                    className="mt-1 text-sm text-red-600"
                    role="alert"
                  >
                    {errors.city.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="postalCode"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Postal Code
                </label>
                <input
                  id="postalCode"
                  type="text"
                  {...register("postalCode")}
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  autoComplete="postal-code"
                  aria-invalid={errors.postalCode ? "true" : "false"}
                  aria-describedby={
                    errors.postalCode ? "postalCode-error" : undefined
                  }
                />
                {errors.postalCode && (
                  <p
                    id="postalCode-error"
                    className="mt-1 text-sm text-red-600"
                    role="alert"
                  >
                    {errors.postalCode.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="country"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Country
              </label>
              <input
                id="country"
                type="text"
                {...register("country")}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                autoComplete="country"
                aria-invalid={errors.country ? "true" : "false"}
                aria-describedby={errors.country ? "country-error" : undefined}
              />
              {errors.country && (
                <p
                  id="country-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.country.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {submitError && (
          <div
            className="my-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-600"
            role="alert"
          >
            {submitError}
          </div>
        )}

        {submitSuccess && (
          <div
            className="my-4 rounded-lg border border-green-300 bg-green-50 p-3 text-sm text-green-600"
            role="alert"
          >
            Shipping information saved successfully! Redirecting...
          </div>
        )}

        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="my-8 inline-block w-full rounded-lg bg-black px-6 py-3 text-center font-semibold uppercase tracking-wider text-white transition duration-200 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-black sm:w-auto"
          aria-busy={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Continue to Payment"}
        </button>
      </form>
    </div>
  );
}
