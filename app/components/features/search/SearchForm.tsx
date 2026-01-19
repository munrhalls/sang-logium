import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
function SearchForm() {
  return (
    <form
      action="/search"
      className="hidden h-full w-full grid-cols-[auto_1fr] place-content-center lg:grid"
    >
      <div className="grid h-full place-content-center">
        <MagnifyingGlassIcon className="text-white" height={16} width={16} />
      </div>
      <input
        type="text"
        name="query"
        placeholder="Search products..."
        className="ml-3 w-full border-b border-white bg-transparent text-xl text-white placeholder-orange-400 focus:outline-none"
      />
    </form>
  );
}
export default SearchForm;
