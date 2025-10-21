"use client";
import { useState } from "react";
import EmbeddedCheckout from "@/app/components/checkout/EmbeddedCheckout";

interface NewCardFormProps {
  isSignedIn: boolean;
}

export default function NewCardForm({ isSignedIn }: NewCardFormProps) {
  const [savePaymentMethod, setSavePaymentMethod] = useState(false);

  return (
    <>
      {isSignedIn && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={savePaymentMethod}
              onChange={(e) => setSavePaymentMethod(e.target.checked)}
              className="mt-1 h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex-1">
              <span className="font-medium text-gray-900">
                Save payment method for future purchases
              </span>
              <p className="mt-1 text-sm text-gray-600">
                Securely save this card to make checkout faster next time. You
                can manage saved cards in your account settings.
              </p>
            </div>
          </label>
        </div>
      )}
      <EmbeddedCheckout savePaymentMethod={savePaymentMethod} />
    </>
  );
}
