import Loader from "./Loader";
import { ShoppingCart } from "lucide-react";

export default function BuyButton({
  handlePurchase,
  loading,
  isInvalid,
}: {
  handlePurchase: () => Promise<void>;
  loading: boolean;
  isInvalid: boolean;
}) {
  return (
    <button
      onClick={handlePurchase}
      disabled={loading || isInvalid}
      className="w-full rounded-lg bg-yellow-600 px-6 py-3 text-center font-black uppercase tracking-wider text-black transition duration-200 hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:bg-gray-400 sm:w-auto"
      aria-busy={loading}
    >
      <span className="flex items-center justify-center gap-2">
        <ShoppingCart className="h-5 w-5" />
        {loading ? <Loader /> : "BUY"}
      </span>
    </button>
  );
}
