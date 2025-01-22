import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

function SearchForm() {
  return (
    <form
      action="/search"
      className="h-[32px] w-full max-w-72 lg:max-w-96 xl:max-w-xl 2xl:max-w-2xl hidden lg:flex items-center"
    >
      <MagnifyingGlassIcon className="text-white mr-4 w-6 h-[100%]" />
      <input
        type="text"
        name="query"
        placeholder="Search products..."
        className="text-2xl flex-1 bg-transparent border-b border-white text-white placeholder-white focus:outline-none"
      />
    </form>
  );
}

export default SearchForm;
