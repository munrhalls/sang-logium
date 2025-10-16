import Loader from "./Loader";

export default function BuyButton({
  handleBuy,
  loading,
  isInvalid,
}: {
  handleBuy: () => Promise<void>;
  loading: boolean;
  isInvalid: boolean;
}) {
  return (
    <button
      onClick={handleBuy}
      disabled={loading || isInvalid}
      className="w-full rounded-lg bg-yellow-600 px-6 py-3 text-center font-black uppercase tracking-wider text-black transition duration-200 hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:bg-gray-400 sm:w-auto"
      aria-busy={loading}
    >
      <span className="flex items-center justify-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
          />
        </svg>
        {loading ? <Loader /> : "BUY"}
      </span>
    </button>
  );
}
