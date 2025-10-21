export default function useOrderTotals(
  cartItems: { price: number; quantity: number }[]
) {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  return [subtotal, tax, total];
}
