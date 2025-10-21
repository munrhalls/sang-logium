"use client";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { usePaymentMethods } from "@/app/hooks/payment/usePaymentMethods";
import { usePaymentProcessor } from "@/app/hooks/payment/usePaymentProcessor";
import SavedCardsList from "./SavedCardsList";
import NewCardForm from "./NewCardForm";
import PayWithSavedCardButton from "./PayWithSavedCardButton";

interface BasketItem {
  stripePriceId: string;
  quantity: number;
}

interface PaymentSegmentProps {
  basketItems: BasketItem[];
  onBack: () => void;
}

export default function PaymentSegment({
  basketItems,
  onBack,
}: PaymentSegmentProps) {
  const { isSignedIn } = useAuth();
  const { methods, isLoading } = usePaymentMethods({
    isSignedIn: isSignedIn ?? false,
  });
  const { processPayment, isProcessing } = usePaymentProcessor();

  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<
    string | null
  >(null);

  const handlePayWithSavedCard = async () => {
    if (!selectedPaymentMethodId) return;

    await processPayment({
      basketItems,
      paymentMethodId: selectedPaymentMethodId,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-2xl font-bold">Complete Payment</h2>
        <button
          onClick={onBack}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to Summary
        </button>
      </div>

      {isLoading && (
        <div className="py-8 text-center text-gray-600">
          Loading payment methods...
        </div>
      )}

      {!isLoading && isSignedIn && methods.length > 0 && (
        <SavedCardsList
          methods={methods}
          selectedId={selectedPaymentMethodId}
          onSelectId={setSelectedPaymentMethodId}
        />
      )}

      {!isLoading &&
        (methods.length === 0 || selectedPaymentMethodId === null) && (
          <NewCardForm isSignedIn={isSignedIn ?? false} />
        )}

      {!isLoading && selectedPaymentMethodId !== null && methods.length > 0 && (
        <PayWithSavedCardButton
          onPay={handlePayWithSavedCard}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
}
