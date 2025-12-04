export default function CategoriesLoadingSkeleton() {
  return (
    <div className="p-4">
      <div className="grid gap-6 bg-white">
        {/* Skeleton for multiple category sections */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-2">
            {/* Category header skeleton */}
            <div className="flex items-center">
              <div className="mr-3 h-6 w-6 animate-pulse rounded bg-gray-200" />
              <div className="h-7 w-32 animate-pulse rounded bg-gray-200" />
            </div>
            {/* Subcategories skeleton */}
            <div className="ml-6 space-y-1">
              {[1, 2, 3].map((j) => (
                <div
                  key={j}
                  className="h-5 w-24 animate-pulse rounded bg-gray-100"
                  style={{ animationDelay: `${j * 50}ms` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
