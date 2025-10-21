import { useState, useEffect } from "react";
import { getUserPaymentMethods } from "@/app/actions/paymentMethods";
import { processPaymentWithSavedCard } from "@/app/actions/paymentMethods";

export function usePaymentHandler() {
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<any[]>([]);
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(false);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<
    string | null
  >(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  // Fetch user's saved payment methods
  const fetchPaymentMethods = async () => {
    setLoadingPaymentMethods(true);
    try {
      const methods = await getUserPaymentMethods();
      setSavedPaymentMethods(methods);
      const defaultMethod = methods.find(
        (m: { isDefault?: boolean }) => m.isDefault
      );
      if (defaultMethod) {
        setSelectedPaymentMethodId(defaultMethod.stripePaymentMethodId);
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    } finally {
      setLoadingPaymentMethods(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  // Handle payment with saved card
  const handlePayWithSavedCard = async () => {
    if (!selectedPaymentMethodId) {
      setPaymentError("No payment method selected");
      return;
    }
    setProcessingPayment(true);
    setPaymentError(null);
    try {
      const result = await processPaymentWithSavedCard(selectedPaymentMethodId);
      if (result.success) {
        setShowCheckout(false);
      } else {
        setPaymentError(result.message || "Payment failed");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Payment processing error";
      setPaymentError(errorMessage);
    } finally {
      setProcessingPayment(false);
    }
  };

  return {
    savedPaymentMethods,
    loadingPaymentMethods,
    selectedPaymentMethodId,
    setSelectedPaymentMethodId,
    processingPayment,
    paymentError,
    showCheckout,
    setShowCheckout,
    handlePayWithSavedCard,
  };
}
