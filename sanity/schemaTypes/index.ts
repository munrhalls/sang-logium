import { blockContentType } from "./blockContentType";
import { productType } from "./productType";
import { orderType } from "./orderType";
import { saleType } from "./saleType";
import { exhibitionType } from "./exhibitionType";
import { commercialType } from "./commercialType";
import { categoryFiltersType } from "./categoryFiltersType";
import { categorySortablesType } from "./categorySortablesType";
import { userType } from "./userType";
import { categoryType } from "./categoryType";
import { menuItemType } from "./menuItemType";
import { settingsType } from "./settingsType";

// TODO 4. delete all blockContent

export const schema = {
  types: [
    menuItemType,
    categoryType,
    settingsType,
    categoryFiltersType,
    categorySortablesType,
    // productType,
    // orderType,
    // saleType,
    // exhibitionType,
    // commercialType,
    // userType,
  ],
};

// TODO product type, blockContentType is bugged - schema extraction fails when uncommented
// TODO
