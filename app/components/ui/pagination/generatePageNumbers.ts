export default function generatePageNumbers(
  currentPage: number,
  pagesCount: number,
): (number | string)[] {
  currentPage = Math.max(
    1,
    Math.min(
      Math.floor(currentPage) || 1,
      Math.max(1, Math.floor(pagesCount) || 1),
    ),
  );
  pagesCount = Math.max(1, Math.floor(pagesCount) || 1);

  const pages = new Set([1, pagesCount, currentPage]);
  if (currentPage > 1) pages.add(currentPage - 1);
  if (currentPage < pagesCount) pages.add(currentPage + 1);
  if (pagesCount > 10) {
    const third = Math.round(pagesCount / 3);
    const twoThirds = Math.round((2 * pagesCount) / 3);
    if (Math.abs(third - currentPage) > 2 && third > 2) pages.add(third);
    if (Math.abs(twoThirds - currentPage) > 2 && twoThirds < pagesCount - 1)
      pages.add(twoThirds);
  }

  const sortedPages = Array.from(pages).sort((a, b) => a - b);

  const result = [];
  for (let i = 0; i < sortedPages.length; i++) {
    result.push(sortedPages[i]);

    if (i < sortedPages.length - 1 && sortedPages[i + 1] - sortedPages[i] > 1) {
      result.push("...");
    }
  }

  return result;
}
