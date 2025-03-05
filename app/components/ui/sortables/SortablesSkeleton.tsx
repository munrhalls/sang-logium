export default function SortablesSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((item) => (
        <div key={item}>
          <div className="h-5 w-24 bg-gray-700 rounded mb-3"></div>
          <div className="space-y-2">
            {[1, 2, 3].map((option) => (
              <div
                key={option}
                className="h-4 w-full bg-gray-700 rounded"
              ></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
