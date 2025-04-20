export default function getSelectedPagination(searchParams) {
  const page = parseInt(searchParams.page) || 1;
  const pageSize = parseInt(searchParams.size) || 12;

  return {
    page,
    pageSize,
  };
}
