import { useState, useEffect } from "react";
import { getUserPaymentMethods } from "@/app/actions/payment_methods/methods_get";

export interface PaymentMethod {
  stripePaymentMethodId: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault?: boolean;
}

interface UsePaymentMethodsOptions {
  isSignedIn: boolean;
  autoFetch?: boolean;
}

interface UsePaymentMethodsReturn {
  methods: PaymentMethod[];
  isLoading: boolean;
  error: string | null;
  defaultMethodId: string | null;
  refetch: () => Promise<void>;
}

export function usePaymentMethods({
  isSignedIn,
  autoFetch = true,
}: UsePaymentMethodsOptions): UsePaymentMethodsReturn {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [defaultMethodId, setDefaultMethodId] = useState<string | null>(null);

  const fetchPaymentMethods = async () => {
    if (!isSignedIn) {
      setMethods([]);
      setDefaultMethodId(null);
      return;
    }

    console.log("Fetching payment methods for signed in user");
    setIsLoading(true);
    setError(null);

    try {
      const fetchedMethods = await getUserPaymentMethods();
      console.log("Fetched payment methods:", fetchedMethods);
      setMethods(fetchedMethods);

      // Find and set the default payment method
      const defaultMethod = fetchedMethods.find(
        (m: PaymentMethod) => m.isDefault
      );
      console.log("Default method:", defaultMethod);

      if (defaultMethod) {
        setDefaultMethodId(defaultMethod.stripePaymentMethodId);
      } else {
        setDefaultMethodId(null);
      }
    } catch (err) {
      console.error("Failed to load payment methods:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load payment methods. Please try again."
      );
      setMethods([]);
      setDefaultMethodId(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchPaymentMethods();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, autoFetch]);

  return {
    methods,
    isLoading,
    error,
    defaultMethodId,
    refetch: fetchPaymentMethods,
  };
}
