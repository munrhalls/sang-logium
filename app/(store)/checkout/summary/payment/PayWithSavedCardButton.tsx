interface PayWithSavedCardButtonProps {
  onPay: () => void;
  isProcessing: boolean;
}

export default function PayWithSavedCardButton({
  onPay,
  isProcessing,
}: PayWithSavedCardButtonProps) {
  return (
    <button
      onClick={onPay}
      disabled={isProcessing}
      className="w-full rounded-lg bg-blue-600 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isProcessing ? (
        <span className="flex items-center justify-center gap-2">
          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          Processing Payment...
        </span>
      ) : (
        "Pay with Selected Card"
      )}
    </button>
  );
}
