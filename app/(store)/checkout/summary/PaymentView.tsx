"use client";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import PaymentSegment from "./PaymentSegment";
import ErrorMessage from "@/app/components/common/ErrorMessage";

interface BasketItem {
  stripePriceId: string;
  quantity: number;
}

interface PaymentViewProps {
  basketItems: BasketItem[];
}

export default function PaymentView({ basketItems }: PaymentViewProps) {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<
    string | null
  >(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // TODO: These will be used in future iterations
  console.log({
    isSignedIn,
    router,
    basketItems,
    selectedPaymentMethodId,
    setSelectedPaymentMethodId,
    setPaymentError,
  });

  return (
    <div>
      {paymentError && <ErrorMessage error={paymentError} />}
      <PaymentSegment />
    </div>
  );
}
