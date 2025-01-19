import { blockContentType } from "./blockContentType";
import { categoryType } from "./categoryType";
import { productType } from "./productType";
import { orderType } from "./orderType";
import { saleType } from "./saleType";
import { commercialType } from "./commercialType";

export const schema = {
  types: [
    blockContentType,
    categoryType,
    productType,
    orderType,
    saleType,
    commercialType,
  ],
};
