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
  variant?: "text" | "products";
  displayOrder?: number;
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
  ctaLink?: string;
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
  category?: {
    _ref: string;
    _type: "reference";
    _weak?: boolean;
    [internalGroqTypeReferenceTo]?: "category";
  };
  products?: Array<{
    _ref: string;
    _type: "reference";
    _weak?: boolean;
    _key: string;
    [internalGroqTypeReferenceTo]?: "product";
  }>;
  discount?: number;
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
// Query: *[_type == "commercial" && feature == $feature] {    _id,  title,  "image": image.asset->url,  variant,  displayOrder,  text,  "products": products[]-> {    _id,    name,    price,    "image": image.asset->url,  },  sale-> {    discount,    _id  }}
export type GET_COMMERCIALS_BY_FEATURE_QUERYResult = Array<{
  _id: string;
  title: string | null;
  image: string | null;
  variant: "products" | "text" | null;
  displayOrder: number | null;
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
    name: string | null;
    price: number | null;
    image: string | null;
  }> | null;
  sale: {
    discount: number | null;
    _id: string;
  } | null;
}>;

// Source: ./sanity/lib/products/getAllCategories.ts
// Variable: ALL_CATEGORIES_QUERY
// Query: *[              _type == "category"          ] | order(name desc)
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

// Source: ./sanity/lib/sales/getAllActiveSales.ts
// Variable: GET_ACTIVE_SALES_QUERY
// Query: *[_type == "sale" && isActive == true] {        _id,        title,        "slug": slug.current,        discount,        validFrom,        validUntil,        isActive      }
export type GET_ACTIVE_SALES_QUERYResult = Array<{
  _id: string;
  title: string | null;
  slug: null;
  discount: number | null;
  validFrom: string | null;
  validUntil: string | null;
  isActive: boolean | null;
}>;

// Source: ./sanity/lib/sales/getSaleById.ts
// Variable: SALE_BY_ID_QUERY
// Query: *[_type == "sale" && _id == $saleId]{      name,      "slug": slug.current,      validFrom,      validUntil,      isActive,      description,      "image": image.asset->url,      category->{        name,        "slug": slug.current,        "products": *[_type=='product' && categoryPath == ^.metadata.path]{          name,          "slug": slug.current,          image,          defaultPrice        }      }    }
export type SALE_BY_ID_QUERYResult = Array<{
  name: null;
  slug: null;
  validFrom: string | null;
  validUntil: string | null;
  isActive: boolean | null;
  description: null;
  image: null;
  category: {
    name: string | null;
    slug: string | null;
    products: Array<{
      name: string | null;
      slug: string | null;
      image: {
        asset?: {
          _ref: string;
          _type: "reference";
          _weak?: boolean;
          [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
        };
        hotspot?: SanityImageHotspot;
        crop?: SanityImageCrop;
        _type: "image";
      } | null;
      defaultPrice: null;
    }>;
  } | null;
}>;

// Query TypeMap
import "@sanity/client";
declare module "@sanity/client" {
  interface SanityQueries {
    "*[_type == \"commercial\" && feature == $feature] {\n    _id,\n  title,\n  \"image\": image.asset->url,\n  variant,\n  displayOrder,\n  text,\n  \"products\": products[]-> {\n    _id,\n    name,\n    price,\n    \"image\": image.asset->url,\n  },\n  sale-> {\n    discount,\n    _id\n  }\n}": GET_COMMERCIALS_BY_FEATURE_QUERYResult;
    "\n          *[\n              _type == \"category\"\n          ] | order(name desc)\n      ": ALL_CATEGORIES_QUERYResult;
    "\n        *[\n            _type == \"product\"\n        ] | order(name asc)\n    ": ALL_PRODUCTS_QUERYResult;
    "\n            *[\n                _type == 'product'\n                && slug.current == $slug\n            ] | order(name asc) [0]\n        ": PRODUCT_BY_ID_QUERYResult;
    "*[\n        _type == \"product\"\n        && name match $searchParam\n    ] | order(name asc)": SEARCH_FOR_PRODUCTS_QUERYResult;
    "\n      *[_type == \"sale\" && isActive == true] {\n        _id,\n        title,\n        \"slug\": slug.current,\n        discount,\n        validFrom,\n        validUntil,\n        isActive\n      }\n    ": GET_ACTIVE_SALES_QUERYResult;
    "\n    *[_type == \"sale\" && _id == $saleId]{\n      name,\n      \"slug\": slug.current,\n      validFrom,\n      validUntil,\n      isActive,\n      description,\n      \"image\": image.asset->url,\n      category->{\n        name,\n        \"slug\": slug.current,\n        \"products\": *[_type=='product' && categoryPath == ^.metadata.path]{\n          name,\n          \"slug\": slug.current,\n          image,\n          defaultPrice\n        }\n      }\n    }\n  ": SALE_BY_ID_QUERYResult;
  }
}
