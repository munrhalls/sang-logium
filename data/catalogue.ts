import { Catalogue } from "@/sanity.types";
import catalogueIndex from "./catalogue-index.json";

export type CatalogueTree = Catalogue["catalogue"];

interface CatalogueIndexData {
  generatedAt: string;
  urlMap: Record<string, string>;
  idMap: Record<string, unknown>;
  tree: CatalogueTree;
}

export const getCatalogue = (): CatalogueTree => {
  const data = catalogueIndex as unknown as CatalogueIndexData;
  return data.tree || [];
};

export const getCatalogueIdByUrl = (url: string) => {
  const data = catalogueIndex as unknown as CatalogueIndexData;
  return data.urlMap[url];
};
