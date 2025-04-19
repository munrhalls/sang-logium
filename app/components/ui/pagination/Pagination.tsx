export default function Pagination() {
  return (
    <div className="px-2 flex bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
      <h1 className="font-black">Page</h1>
      <div>
        <button className="text-black font-black mx-1">1</button>
        <button className="text-black font-black mx-1">2</button>
        <button className="text-black font-black mx-1">3</button>
        ...
        <button className="text-black font-black mx-1">last</button>
      </div>
    </div>
  );
}
