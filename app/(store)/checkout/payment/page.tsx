"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { usePaymentStore } from "@/store/checkout";
import { useState } from "react";

// Use react-hook-form and zod for form handling and validation
// Define zod schema for payment data (e.g., cardNumber, expiry, cvv, cardholderName)
const paymentInputSchema = z.object({
  cardholderName: z
    .string()
    .min(1, "Cardholder name is required")
    .min(2, "Cardholder name must be at least 2 characters"),
  cardNumber: z
    .string()
    .min(1, "Card number is required")
    .regex(/^\d{16}$/, "Card number must be 16 digits"),
  expiry: z
    .string()
    .min(1, "Expiry date is required")
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry must be in MM/YY format"),
  cvv: z
    .string()
    .min(1, "CVV is required")
    .regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
});

type PaymentInputData = z.infer<typeof paymentInputSchema>;

export default function Payment() {
  // Use react-hook-form and zod for form handling and validation
  // Define zod schema for payment data (e.g., cardNumber, expiry, cvv, cardholderName)
  // Use Zustand store (usePaymentStore) to manage payment data (no localStorage for security)
  // Pre-fill form if payment data exists in store
  // Save valid form data to store and redirect to /checkout/summary on submit
  // Disable submit button until form is valid
  // Display validation errors below inputs (red text, small font)
  // Ensure form is responsive (stack on mobile, grid on desktop via Tailwind)
  // Add accessibility: htmlFor on labels, ARIA attributes, focus management
  // Style form with Tailwind for clean, modern design (match Shipping.tsx)
  // Show loading state (spinner) during submission
  // Handle submission errors (inline error message)
  // Show success state (flash message) before redirect
  // Simulate async submission (1s delay, 10% error chance for realism)
  // DO NOT INTEGRATE - I REPEAT - DO NOT INTEGRATE WITH ANY PAYMENT PROCESSING GATEWAY. THAT IS FOR LATER. THAT IS OUT OF SCOPE FOR NOW.

  const router = useRouter();
  const { paymentInfo, setPaymentInfo } = usePaymentStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<PaymentInputData>({
    resolver: zodResolver(paymentInputSchema),
    mode: "onChange",
    defaultValues: {
      cardholderName: paymentInfo?.cardholderName || "",
      cardNumber: "",
      expiry: "",
      cvv: "",
    },
  });

  const formatCardNumber = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "");
    const formatted = digitsOnly.replace(/(\d{4})(?=\d)/g, "$1 ");
    return formatted.slice(0, 19);
  };

  const formatExpiry = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly.length >= 2) {
      return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}`;
    }
    return digitsOnly;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setValue("cardNumber", formatted.replace(/\s/g, ""), {
      shouldValidate: true,
    });
    e.target.value = formatted;
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    setValue("expiry", formatted.replace(/\//g, ""), { shouldValidate: true });
    e.target.value = formatted;
  };

  const cardNumberValue = watch("cardNumber");
  const expiryValue = watch("expiry");

  const onSubmit = async (data: PaymentInputData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() < 0.1) {
            reject(new Error("Payment validation failed. Please try again."));
          } else {
            resolve(true);
          }
        }, 1000);
      });

      const mockPaymentToken = crypto.randomUUID();
      const last4 = data.cardNumber.slice(-4);

      setPaymentInfo({
        mockPaymentToken,
        cardholderName: data.cardholderName,
        last4,
      });

      setSubmitSuccess(true);

      setTimeout(() => {
        router.push("/checkout/summary");
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
            Payment Information
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="cardholderName"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Cardholder Name
              </label>
              <input
                id="cardholderName"
                type="text"
                {...register("cardholderName")}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                autoComplete="cc-name"
                aria-invalid={errors.cardholderName ? "true" : "false"}
                aria-describedby={
                  errors.cardholderName ? "cardholderName-error" : undefined
                }
              />
              {errors.cardholderName && (
                <p
                  id="cardholderName-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.cardholderName.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="cardNumber"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Card Number
              </label>
              <input
                id="cardNumber"
                type="text"
                {...register("cardNumber")}
                onChange={handleCardNumberChange}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                autoComplete="cc-number"
                placeholder="1234 5678 1234 5678"
                maxLength={19}
                aria-invalid={errors.cardNumber ? "true" : "false"}
                aria-describedby={
                  errors.cardNumber ? "cardNumber-error" : undefined
                }
              />
              {errors.cardNumber && (
                <p
                  id="cardNumber-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.cardNumber.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="expiry"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Expiry Date
                </label>
                <input
                  id="expiry"
                  type="text"
                  {...register("expiry")}
                  onChange={handleExpiryChange}
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  autoComplete="cc-exp"
                  placeholder="MM/YY"
                  maxLength={5}
                  aria-invalid={errors.expiry ? "true" : "false"}
                  aria-describedby={errors.expiry ? "expiry-error" : undefined}
                />
                {errors.expiry && (
                  <p
                    id="expiry-error"
                    className="mt-1 text-sm text-red-600"
                    role="alert"
                  >
                    {errors.expiry.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="cvv"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  CVV
                </label>
                <input
                  id="cvv"
                  type="text"
                  {...register("cvv")}
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  autoComplete="cc-csc"
                  placeholder="123"
                  maxLength={4}
                  aria-invalid={errors.cvv ? "true" : "false"}
                  aria-describedby={errors.cvv ? "cvv-error" : undefined}
                />
                {errors.cvv && (
                  <p
                    id="cvv-error"
                    className="mt-1 text-sm text-red-600"
                    role="alert"
                  >
                    {errors.cvv.message}
                  </p>
                )}
              </div>
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
            Payment information saved successfully! Redirecting...
          </div>
        )}

        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="my-8 inline-block w-full rounded-lg bg-black px-6 py-3 text-center font-semibold uppercase tracking-wider text-white transition duration-200 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-black sm:w-auto"
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="h-5 w-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Continue to Summary"
          )}
        </button>
      </form>
    </div>
  );
}
