interface SearchParams {
  page?: string;
  size?: string;
}
export default function getSelectedPagination(searchParams: SearchParams) {
  const page = parseInt(searchParams.page ?? "1") || 1;
  const pageSize = parseInt(searchParams.size ?? "12") || 12;
  return {
    page,
    pageSize,
  };
}
