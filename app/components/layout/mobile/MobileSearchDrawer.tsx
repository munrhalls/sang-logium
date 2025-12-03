import { CloseDrawerButton } from "./CloseDrawerButton";

export default function MobileSearchDrawer({ isOpen }: { isOpen: boolean }) {
  return (
    <div
      className={`pointer-events-auto absolute inset-0 z-50 h-full w-full overflow-hidden bg-slate-50 text-black transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-4">
        <div className="border-b border-gray-200 p-2">
          <div className="flex items-center justify-end">
            <CloseDrawerButton />
          </div>
        </div>
        <form action="/search" className="mt-4">
          <input
            type="text"
            name="query"
            placeholder="Look for products by name..."
            className="w-full rounded bg-gray-800 p-2 text-white"
          />
          <div className="mt-4 flex justify-center">
            <button
              type="submit"
              className="rounded border border-gray-800 px-3 py-2"
            >
              SEARCH
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
