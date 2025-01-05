/**
 * ---------------------------------------------------------------------------------
 * This file has been generated by Sanity TypeGen.
 * Command: `sanity typegen generate`
 *
 * Any modifications made directly to this file will be overwritten the next time
 * the TypeScript definitions are generated. Please make changes to the Sanity
 * schema definitions and/or GROQ queries if you need to update these types.
 *
 * For more information on how to use Sanity TypeGen, visit the official documentation:
 * https://www.sanity.io/docs/sanity-typegen
 * ---------------------------------------------------------------------------------
 */

// Source: schema.json
export type SanityImagePaletteSwatch = {
  _type: "sanity.imagePaletteSwatch";
  background?: string;
  foreground?: string;
  population?: number;
  title?: string;
};

export type SanityImagePalette = {
  _type: "sanity.imagePalette";
  darkMuted?: SanityImagePaletteSwatch;
  lightVibrant?: SanityImagePaletteSwatch;
  darkVibrant?: SanityImagePaletteSwatch;
  vibrant?: SanityImagePaletteSwatch;
  dominant?: SanityImagePaletteSwatch;
  lightMuted?: SanityImagePaletteSwatch;
  muted?: SanityImagePaletteSwatch;
};

export type SanityImageDimensions = {
  _type: "sanity.imageDimensions";
  height?: number;
  width?: number;
  aspectRatio?: number;
};

export type SanityFileAsset = {
  _id: string;
  _type: "sanity.fileAsset";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  originalFilename?: string;
  label?: string;
  title?: string;
  description?: string;
  altText?: string;
  sha1hash?: string;
  extension?: string;
  mimeType?: string;
  size?: number;
  assetId?: string;
  uploadId?: string;
  path?: string;
  url?: string;
  source?: SanityAssetSourceData;
};

export type Geopoint = {
  _type: "geopoint";
  lat?: number;
  lng?: number;
  alt?: number;
};

export type Commercial = {
  _id: string;
  _type: "commercial";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title?: string;
  feature?: "hero" | "category" | "campaign";
  image?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
  };
  text?: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "normal" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "blockquote";
    listItem?: "bullet" | "number";
    markDefs?: Array<{
      _key: string;
    } & TextColor | {
      _key: string;
    } & HighlightColor>;
    level?: number;
    _type: "block";
    _key: string;
  }>;
  sale?: {
    _ref: string;
    _type: "reference";
    _weak?: boolean;
    [internalGroqTypeReferenceTo]?: "sale";
  };
  products?: Array<{
    _ref: string;
    _type: "reference";
    _weak?: boolean;
    _key: string;
    [internalGroqTypeReferenceTo]?: "product";
  }>;
};

export type Sale = {
  _id: string;
  _type: "sale";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title?: string;
  slug?: Slug;
  discount?: number;
  products?: Array<{
    _ref: string;
    _type: "reference";
    _weak?: boolean;
    _key: string;
    [internalGroqTypeReferenceTo]?: "product";
  }>;
  validFrom?: string;
  validUntil?: string;
  isActive?: boolean;
};

export type Order = {
  _id: string;
  _type: "order";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  orderNumber?: string;
  orderId?: string;
  stripeCheckoutSessionId?: string;
  stripeCustomerId?: string;
  clerkUserId?: string;
  customerName?: string;
  email?: string;
  stripePaymentIntentId?: string;
  products?: Array<{
    product?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "product";
    };
    quantity?: number;
    _key: string;
  }>;
  totalPrice?: number;
  currency?: string;
  amountDiscounct?: number;
  status?: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  orderDate?: string;
};

export type Product = {
  _id: string;
  _type: "product";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name?: string;
  slug?: Slug;
  brand?: string;
  image?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
  };
  gallery?: Array<{
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
    _key: string;
  }>;
  description?: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "normal" | "h1" | "h2" | "h3" | "h4" | "blockquote";
    listItem?: "bullet";
    markDefs?: Array<{
      href?: string;
      _type: "link";
      _key: string;
    } | {
      _key: string;
    } & TextColor | {
      _key: string;
    } & HighlightColor>;
    level?: number;
    _type: "block";
    _key: string;
  } | {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    alt?: string;
    _type: "image";
    _key: string;
  }>;
  sku?: string;
  price?: number;
  stock?: number;
  categoryPath?: string;
  tags?: Array<string>;
  overviewFields?: Array<{
    title?: string;
    value?: string;
    information?: string;
    _type: "overviewField";
    _key: string;
  }>;
  specifications?: Array<{
    title?: string;
    value?: string;
    information?: string;
    _type: "spec";
    _key: string;
  }>;
};

export type Category = {
  _id: string;
  _type: "category";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name?: string;
  icon?: string;
  slug?: Slug;
  metadata?: {
    path?: string;
    depth?: number;
  };
};

export type Slug = {
  _type: "slug";
  current?: string;
  source?: string;
};

export type BlockContent = Array<{
  children?: Array<{
    marks?: Array<string>;
    text?: string;
    _type: "span";
    _key: string;
  }>;
  style?: "normal" | "h1" | "h2" | "h3" | "h4" | "blockquote";
  listItem?: "bullet";
  markDefs?: Array<{
    href?: string;
    _type: "link";
    _key: string;
  } | {
    _key: string;
  } & TextColor | {
    _key: string;
  } & HighlightColor>;
  level?: number;
  _type: "block";
  _key: string;
} | {
  asset?: {
    _ref: string;
    _type: "reference";
    _weak?: boolean;
    [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
  };
  hotspot?: SanityImageHotspot;
  crop?: SanityImageCrop;
  alt?: string;
  _type: "image";
  _key: string;
}>;

export type SanityImageCrop = {
  _type: "sanity.imageCrop";
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

export type SanityImageHotspot = {
  _type: "sanity.imageHotspot";
  x?: number;
  y?: number;
  height?: number;
  width?: number;
};

export type SanityImageAsset = {
  _id: string;
  _type: "sanity.imageAsset";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  originalFilename?: string;
  label?: string;
  title?: string;
  description?: string;
  altText?: string;
  sha1hash?: string;
  extension?: string;
  mimeType?: string;
  size?: number;
  assetId?: string;
  uploadId?: string;
  path?: string;
  url?: string;
  metadata?: SanityImageMetadata;
  source?: SanityAssetSourceData;
};

export type SanityAssetSourceData = {
  _type: "sanity.assetSourceData";
  name?: string;
  id?: string;
  url?: string;
};

export type SanityImageMetadata = {
  _type: "sanity.imageMetadata";
  location?: Geopoint;
  dimensions?: SanityImageDimensions;
  palette?: SanityImagePalette;
  lqip?: string;
  blurHash?: string;
  hasAlpha?: boolean;
  isOpaque?: boolean;
};

export type HighlightColor = {
  _type: "highlightColor";
  label?: string;
  value?: string;
};

export type TextColor = {
  _type: "textColor";
  label?: string;
  value?: string;
};

export type SimplerColor = {
  _type: "simplerColor";
  label?: string;
  value?: string;
};

export type AllSanitySchemaTypes = SanityImagePaletteSwatch | SanityImagePalette | SanityImageDimensions | SanityFileAsset | Geopoint | Commercial | Sale | Order | Product | Category | Slug | BlockContent | SanityImageCrop | SanityImageHotspot | SanityImageAsset | SanityAssetSourceData | SanityImageMetadata | HighlightColor | TextColor | SimplerColor;
export declare const internalGroqTypeReferenceTo: unique symbol;
// Source: ./sanity/lib/commercials/getCommercialsByFeature.ts
// Variable: GET_COMMERCIALS_BY_FEATURE_QUERY
// Query: *[_type == "commercial" && feature == $feature] {      title,      "image": image.asset->url,      text,      "products": products[]-> {        _id,        "name": coalesce(name, ""),        "price": coalesce(price, 0),        "image": coalesce(image.asset->url, ""),        "slug": coalesce(slug.current, ""),        "discount": coalesce(^.sale->discount, 0)      }     }
export type GET_COMMERCIALS_BY_FEATURE_QUERYResult = Array<{
  title: string | null;
  image: string | null;
  text: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "blockquote" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "normal";
    listItem?: "bullet" | "number";
    markDefs?: Array<{
      _key: string;
    } & HighlightColor | {
      _key: string;
    } & TextColor>;
    level?: number;
    _type: "block";
    _key: string;
  }> | null;
  products: Array<{
    _id: string;
    name: string | "";
    price: number | 0;
    image: string | "";
    slug: string | "";
    discount: number | 0;
  }> | null;
}>;

// Source: ./sanity/lib/products/getAllCategories.ts
// Variable: ALL_CATEGORIES_QUERY
// Query: *[              _type == "category"          ] | order(name asc)
export type ALL_CATEGORIES_QUERYResult = Array<{
  _id: string;
  _type: "category";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name?: string;
  icon?: string;
  slug?: Slug;
  metadata?: {
    path?: string;
    depth?: number;
  };
}>;

// Source: ./sanity/lib/products/getAllProducts.ts
// Variable: ALL_PRODUCTS_QUERY
// Query: *[            _type == "product"        ] | order(name asc)
export type ALL_PRODUCTS_QUERYResult = Array<{
  _id: string;
  _type: "product";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name?: string;
  slug?: Slug;
  brand?: string;
  image?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
  };
  gallery?: Array<{
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
    _key: string;
  }>;
  description?: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "blockquote" | "h1" | "h2" | "h3" | "h4" | "normal";
    listItem?: "bullet";
    markDefs?: Array<{
      _key: string;
    } & HighlightColor | {
      _key: string;
    } & TextColor | {
      href?: string;
      _type: "link";
      _key: string;
    }>;
    level?: number;
    _type: "block";
    _key: string;
  } | {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    alt?: string;
    _type: "image";
    _key: string;
  }>;
  sku?: string;
  price?: number;
  stock?: number;
  categoryPath?: string;
  tags?: Array<string>;
  overviewFields?: Array<{
    title?: string;
    value?: string;
    information?: string;
    _type: "overviewField";
    _key: string;
  }>;
  specifications?: Array<{
    title?: string;
    value?: string;
    information?: string;
    _type: "spec";
    _key: string;
  }>;
}>;

// Source: ./sanity/lib/products/getProductBySlug.ts
// Variable: PRODUCT_BY_ID_QUERY
// Query: *[                _type == 'product'                && slug.current == $slug            ] | order(name asc) [0]
export type PRODUCT_BY_ID_QUERYResult = {
  _id: string;
  _type: "product";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name?: string;
  slug?: Slug;
  brand?: string;
  image?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
  };
  gallery?: Array<{
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
    _key: string;
  }>;
  description?: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "blockquote" | "h1" | "h2" | "h3" | "h4" | "normal";
    listItem?: "bullet";
    markDefs?: Array<{
      _key: string;
    } & HighlightColor | {
      _key: string;
    } & TextColor | {
      href?: string;
      _type: "link";
      _key: string;
    }>;
    level?: number;
    _type: "block";
    _key: string;
  } | {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    alt?: string;
    _type: "image";
    _key: string;
  }>;
  sku?: string;
  price?: number;
  stock?: number;
  categoryPath?: string;
  tags?: Array<string>;
  overviewFields?: Array<{
    title?: string;
    value?: string;
    information?: string;
    _type: "overviewField";
    _key: string;
  }>;
  specifications?: Array<{
    title?: string;
    value?: string;
    information?: string;
    _type: "spec";
    _key: string;
  }>;
} | null;

// Source: ./sanity/lib/products/searchProductsByName.ts
// Variable: SEARCH_FOR_PRODUCTS_QUERY
// Query: *[        _type == "product"        && name match $searchParam    ] | order(name asc)
export type SEARCH_FOR_PRODUCTS_QUERYResult = Array<{
  _id: string;
  _type: "product";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name?: string;
  slug?: Slug;
  brand?: string;
  image?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
  };
  gallery?: Array<{
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
    _key: string;
  }>;
  description?: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "blockquote" | "h1" | "h2" | "h3" | "h4" | "normal";
    listItem?: "bullet";
    markDefs?: Array<{
      _key: string;
    } & HighlightColor | {
      _key: string;
    } & TextColor | {
      href?: string;
      _type: "link";
      _key: string;
    }>;
    level?: number;
    _type: "block";
    _key: string;
  } | {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    alt?: string;
    _type: "image";
    _key: string;
  }>;
  sku?: string;
  price?: number;
  stock?: number;
  categoryPath?: string;
  tags?: Array<string>;
  overviewFields?: Array<{
    title?: string;
    value?: string;
    information?: string;
    _type: "overviewField";
    _key: string;
  }>;
  specifications?: Array<{
    title?: string;
    value?: string;
    information?: string;
    _type: "spec";
    _key: string;
  }>;
}>;

// Source: ./sanity/lib/sales/getSalesByType.ts
// Variable: ACTIVE_SALE_BY_COUPON_QUERY
// Query: *[              _type == "sale"              && isActive == true              && couponCode == $couponCode          ] | order(validFrom desc)[0]
export type ACTIVE_SALE_BY_COUPON_QUERYResult = {
  _id: string;
  _type: "sale";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title?: string;
  slug?: Slug;
  discount?: number;
  products?: Array<{
    _ref: string;
    _type: "reference";
    _weak?: boolean;
    _key: string;
    [internalGroqTypeReferenceTo]?: "product";
  }>;
  validFrom?: string;
  validUntil?: string;
  isActive?: boolean;
} | null;

// Query TypeMap
import "@sanity/client";
declare module "@sanity/client" {
  interface SanityQueries {
    "*[_type == \"commercial\" && feature == $feature] {\n      title,\n      \"image\": image.asset->url,\n      text,\n      \"products\": products[]-> {\n        _id,\n        \"name\": coalesce(name, \"\"),\n        \"price\": coalesce(price, 0),\n        \"image\": coalesce(image.asset->url, \"\"),\n        \"slug\": coalesce(slug.current, \"\"),\n        \"discount\": coalesce(^.sale->discount, 0)\n      }\n     }": GET_COMMERCIALS_BY_FEATURE_QUERYResult;
    "\n          *[\n              _type == \"category\"\n          ] | order(name asc)\n      ": ALL_CATEGORIES_QUERYResult;
    "\n        *[\n            _type == \"product\"\n        ] | order(name asc)\n    ": ALL_PRODUCTS_QUERYResult;
    "\n            *[\n                _type == 'product'\n                && slug.current == $slug\n            ] | order(name asc) [0]\n        ": PRODUCT_BY_ID_QUERYResult;
    "*[\n        _type == \"product\"\n        && name match $searchParam\n    ] | order(name asc)": SEARCH_FOR_PRODUCTS_QUERYResult;
    "\n          *[\n              _type == \"sale\"\n              && isActive == true\n              && couponCode == $couponCode\n          ] | order(validFrom desc)[0]\n      ": ACTIVE_SALE_BY_COUPON_QUERYResult;
  }
}
