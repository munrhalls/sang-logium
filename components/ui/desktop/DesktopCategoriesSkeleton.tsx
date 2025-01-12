const CategorySkeleton = () => {
  return (
    <nav
      className="hidden lg:flex items-center justify-center z-50 w-full bg-gray-900"
      style={{
        position: "fixed",
        top: "var(--header-height)",
        height: "var(--categories-nav-height)",
      }}
    >
      <div className="h-full max-w-7xl mx-auto px-4">
        <ul className="h-full flex justify-center items-center gap-8">
          {/* Create 5 skeleton items to match your CATEGORY_ORDER length */}
          {[...Array(5)].map((_, index) => (
            <li key={index} className="h-full flex items-center">
              <div className="flex items-center gap-2">
                {/* Icon placeholder */}
                <div className="w-4 h-4 bg-gray-600 rounded animate-pulse" />
                {/* Text placeholder */}
                <div className="w-24 h-8 bg-gray-600 rounded animate-pulse" />
                {/* Chevron placeholder */}
                <div className="w-3 h-3 bg-gray-600 rounded animate-pulse ml-2" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default CategorySkeleton;
