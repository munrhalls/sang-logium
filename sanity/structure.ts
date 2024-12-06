import type { StructureResolver, StructureBuilder } from "sanity/structure";

const categoryChildResolver = (S: StructureBuilder, id: string) => {
  return S.documentList()
    .title("Subcategories")
    .filter('_type == "category" && parentCategory._ref == $parentId')
    .params({ parentId: id });
};

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Sang Logium E-commerce Web App")
    .items([
      S.documentTypeListItem("category")
        .title("Categories")
        .child(
          S.documentTypeList("category")
            .title("Categories")
            .filter('_type == "category" && !defined(parentCategory)')
            .child((id) => categoryChildResolver(S, id))
        ),

      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !["category"].includes(item.getId()!)
      ),
    ]);
