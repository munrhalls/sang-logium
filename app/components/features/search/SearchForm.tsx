import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

function SearchForm() {
  return (
    <form
      action="/search"
      className="hidden lg:grid h-full w-full grid-cols-[auto_1fr] place-content-center"
    >
      <div className="h-full grid place-content-center">
        <MagnifyingGlassIcon className="text-white" height={16} width={16} />
      </div>
      <input
        type="text"
        name="query"
        placeholder="Search products..."
        className="ml-3 w-full text-xl bg-transparent border-b border-white text-white placeholder-white focus:outline-none"
      />
    </form>
  );
}

export default SearchForm;
