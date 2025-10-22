interface PaymentMethod {
  stripePaymentMethodId: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault?: boolean;
}

interface SavedCardsListProps {
  methods: PaymentMethod[];
  selectedId: string | null;
  onSelectId: (id: string | null) => void;
}

export default function SavedCardsList({
  methods,
  selectedId,
  onSelectId,
}: SavedCardsListProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900">Select Payment Method</h3>

      {methods.map((method) => (
        <div
          key={method.stripePaymentMethodId}
          onClick={() => onSelectId(method.stripePaymentMethodId)}
          className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
            selectedId === method.stripePaymentMethodId
              ? "border-blue-600 bg-blue-50"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                type="radio"
                checked={selectedId === method.stripePaymentMethodId}
                onChange={() => onSelectId(method.stripePaymentMethodId)}
                className="h-4 w-4 text-blue-600"
              />
              <div>
                <div className="font-medium text-gray-900">
                  {method.brand.toUpperCase()} •••• {method.last4}
                  {method.isDefault && (
                    <span className="ml-2 text-xs text-blue-600">
                      ⭐ Default
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  Expires {method.expMonth}/{method.expYear}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div
        onClick={() => onSelectId(null)}
        className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
          selectedId === null
            ? "border-blue-600 bg-blue-50"
            : "border-gray-200 bg-white hover:border-gray-300"
        }`}
      >
        <div className="flex items-center gap-3">
          <input
            type="radio"
            checked={selectedId === null}
            onChange={() => onSelectId(null)}
            className="h-4 w-4 text-blue-600"
          />
          <div>
            <div className="font-medium text-gray-900">+ Add New Card</div>
            <div className="text-sm text-gray-500">
              Use a different payment method
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
