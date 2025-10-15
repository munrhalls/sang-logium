import { create } from "zustand";

export interface ShippingFormData {
  name: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface PaymentFormData {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

interface CheckoutState {
  shippingInfo: ShippingFormData | null;
  setShippingInfo: (data: ShippingFormData) => void;
}

interface PaymentState {
  paymentInfo: PaymentFormData | null;
  setPaymentInfo: (data: PaymentFormData) => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  shippingInfo: null,
  setShippingInfo: (data) => set({ shippingInfo: data }),
}));

export const usePaymentStore = create<PaymentState>((set) => ({
  paymentInfo: null,
  setPaymentInfo: (data) => set({ paymentInfo: data }),
}));
