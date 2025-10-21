import useOrderTotals from "@/app/hooks/useOrderTotals";
interface Item {
  id: string;
  name: string;
  price: number;
  quantity: number;
}
interface OrderDetailsProps {
  cartItems: Item[];
}
export default function OrderDetails({ cartItems }: OrderDetailsProps) {
  const [subtotal, tax, total] = useOrderTotals(cartItems);
  return (
    <>
      <h2 className="mb-4 border-b border-gray-200 pb-2 text-lg font-bold">
        Order Summary
      </h2>
      <div>
        {cartItems.length > 0 ? (
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b border-gray-100 pb-2"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
            <div className="space-y-2 pt-3">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax (8%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-300 pt-2 text-lg font-bold text-gray-900">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="font-black text-gray-700">No items in cart</p>
        )}
      </div>
    </>
  );
}
