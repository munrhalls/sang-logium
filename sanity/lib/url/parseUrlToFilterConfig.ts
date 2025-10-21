// /sanity/lib/url/parseUrlToFilterConfig.ts

export type FilterConfig = {
  categories?: string[];
  price?: {
    min?: number;
    max?: number;
  };
  colors?: string[];
  sizes?: string[];
  sort?: {
    field: string;
    direction: "asc" | "desc";
  };
  page?: number;
  limit?: number;
};

/**
 * Parses URL search parameters into a validated filter configuration
 */
export function parseUrlToFilterConfig(
  searchParams: URLSearchParams | Record<string, string | string[]>
): FilterConfig {
  // Normalize searchParams to handle both URLSearchParams and NextJS searchParams
  const params =
    searchParams instanceof URLSearchParams
      ? Object.fromEntries(searchParams.entries())
      : searchParams;

  const config: FilterConfig = {};

  // Handle categories (support both ?category=a&category=b and ?categories=a,b)
  if ("category" in params || "categories" in params) {
    const categoryParam = params.category || params.categories;
    const categories = Array.isArray(categoryParam)
      ? categoryParam
      : typeof categoryParam === "string"
        ? categoryParam.split(",").map((c) => c.trim())
        : [];

    if (categories.length > 0) {
      config.categories = categories;
    }
  }

  // Handle price range
  const priceMin = extractNumber(params.priceMin);
  const priceMax = extractNumber(params.priceMax);

  if (priceMin !== undefined || priceMax !== undefined) {
    config.price = {};
    if (priceMin !== undefined) config.displayPrice.min = priceMin;
    if (priceMax !== undefined) config.displayPrice.max = priceMax;
  }

  // Handle colors
  if ("color" in params || "colors" in params) {
    const colorParam = params.color || params.colors;
    const colors = Array.isArray(colorParam)
      ? colorParam
      : typeof colorParam === "string"
        ? colorParam.split(",").map((c) => c.trim())
        : [];

    if (colors.length > 0) {
      config.colors = colors;
    }
  }

  // Handle sizes
  if ("size" in params || "sizes" in params) {
    const sizeParam = params.size || params.sizes;
    const sizes = Array.isArray(sizeParam)
      ? sizeParam
      : typeof sizeParam === "string"
        ? sizeParam.split(",").map((s) => s.trim())
        : [];

    if (sizes.length > 0) {
      config.sizes = sizes;
    }
  }

  // Handle sorting
  if ("sort" in params) {
    const sortValue = typeof params.sort === "string" ? params.sort : "";
    const [field, direction] = sortValue.split(":");

    if (field) {
      config.sort = {
        field,
        direction: direction === "desc" ? "desc" : "asc",
      };
    }
  }

  // Handle pagination
  const page = extractNumber(params.page);
  if (page !== undefined && page > 0) {
    config.page = page;
  }

  const limit = extractNumber(params.limit);
  if (limit !== undefined && limit > 0) {
    config.limit = limit;
  }

  return config;
}

/**
 * Safely extracts a number from a string or string[] parameter
 */
function extractNumber(value: unknown): number | undefined {
  if (value === undefined || value === null) return undefined;

  const strValue = Array.isArray(value) ? value[0] : String(value);
  const num = parseFloat(strValue);

  return !isNaN(num) ? num : undefined;
}
