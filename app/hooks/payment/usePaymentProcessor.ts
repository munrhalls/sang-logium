import { useState } from "react";
import { useRouter } from "next/navigation";
import { processPaymentWithSavedMethod } from "@/app/actions/checkout/saved_payment";

interface BasketItem {
  stripePriceId: string;
  quantity: number;
}

interface ProcessPaymentOptions {
  basketItems: BasketItem[];
  paymentMethodId: string;
}

interface UsePaymentProcessorReturn {
  processPayment: (options: ProcessPaymentOptions) => Promise<void>;
  isProcessing: boolean;
  error: string | null;
  clearError: () => void;
}

export function usePaymentProcessor(): UsePaymentProcessorReturn {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => {
    setError(null);
  };

  const processPayment = async ({
    basketItems,
    paymentMethodId,
  }: ProcessPaymentOptions) => {
    if (!paymentMethodId) {
      setError("Please select a payment method");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const items = basketItems.map((item) => ({
        priceId: item.stripePriceId,
        quantity: item.quantity,
      }));

      const result = await processPaymentWithSavedMethod(
        items,
        paymentMethodId
      );

      if (result.success) {
        router.push(`/success?payment_intent=${result.paymentIntentId}`);
      } else {
        throw new Error("Payment processing failed");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Payment failed. Please try again or use a different payment method."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processPayment,
    isProcessing,
    error,
    clearError,
  };
}
