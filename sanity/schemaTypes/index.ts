import { blockContentType } from "./blockContentType";
import { productType } from "./productType";
import { orderType } from "./orderType";
import { saleType } from "./saleType";
import { exhibitionType } from "./exhibitionType";
import { commercialType } from "./commercialType";
import { userType } from "./userType";
// import { categoryFiltersType } from "./categoryFiltersType";
// import { categorySortablesType } from "./categorySortablesType";
import { catalogueItemType } from "./catalogueItemType";
import { catalogueType } from "./catalogueType";
import { categoryType } from "./categoryType";

// TODO 4. delete all blockContent

export const schema = {
  types: [
    blockContentType,
    catalogueItemType,
    catalogueType,
    categoryType,
    // categoryFiltersType,
    // categorySortablesType,
    productType,
    // orderType,
    // saleType,
    // exhibitionType,
    // commercialType,
    // userType,
  ],
};

// TODO product type, blockContentType is bugged - schema extraction fails when uncommented
// TODO
