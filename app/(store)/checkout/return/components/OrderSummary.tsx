interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  total: number;
}

interface Order {
  items: OrderItem[];
  amountTotal: number;
}

export function OrderSummary({ order }: { order: Order }) {
  return (
    <div className="mb-8 rounded-lg border border-gray-200 p-6">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        Order Summary
      </h2>
      <div className="space-y-4">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between border-b pb-3">
            <div>
              <p className="font-medium text-gray-900">{item.name}</p>
              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
            </div>
            <p className="font-semibold text-gray-900">
              ${item.total.toFixed(2)}
            </p>
          </div>
        ))}
        <div className="flex justify-between pt-3 text-lg font-bold">
          <span>Total:</span>
          <span>${order.amountTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
