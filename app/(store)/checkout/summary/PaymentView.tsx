"use client";
import PaymentSegment from "./PaymentSegment";

interface BasketItem {
  stripePriceId: string;
  quantity: number;
}

interface PaymentViewProps {
  basketItems: BasketItem[];
  onBack: () => void;
}

export default function PaymentView({ basketItems, onBack }: PaymentViewProps) {
  return (
    <div>
      <PaymentSegment basketItems={basketItems} onBack={onBack} />
    </div>
  );
}
