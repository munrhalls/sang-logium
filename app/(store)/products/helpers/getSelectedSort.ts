import { SortState } from "@/app/components/ui/sortables/SortTypes";

interface SearchParams {
  sort?: string;
  dir?: string;
}

export default function getSelectedSort(searchParams: SearchParams): SortState {
  const sortField = searchParams.sort || "default";
  const sortDir = searchParams.dir || "asc";

  return {
    field: sortField,
    direction: sortDir as "asc" | "desc",
  };
}
