import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

function SearchForm() {
  return (
    <form
      action="/search"
      className="h-full grid grid-flow-col place-content-center"
    >
      <div className="h-full grid place-content-center">
        <MagnifyingGlassIcon className="text-white" height={16} width={16} />
      </div>
      <input
        type="text"
        name="query"
        placeholder="Search products..."
        className="ml-3 text-lg flex-1 bg-transparent border-b border-white text-white placeholder-white focus:outline-none"
      />
    </form>
  );
}

export default SearchForm;
