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
  mockPaymentToken: string;
  cardholderName: string;
  last4: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutState {
  shippingInfo: ShippingFormData | null;
  setShippingInfo: (data: ShippingFormData) => void;
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
  clearCart: () => void;
}

interface PaymentState {
  paymentInfo: PaymentFormData | null;
  setPaymentInfo: (data: PaymentFormData) => void;
}

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
  shippingInfo: null,
  setShippingInfo: (data) => set({ shippingInfo: data }),
  cartItems: [],
  setCartItems: (items) => set({ cartItems: items }),
  clearCart: () => set({ cartItems: [] }),
}));

export const usePaymentStore = create<PaymentState>((set) => ({
  paymentInfo: null,
  setPaymentInfo: (data) => set({ paymentInfo: data }),
}));
