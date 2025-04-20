"use client ";

const pagesCount = 15;
const pageSize = 10;
const totalPages = Math.ceil(pagesCount / pageSize);
const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
console.log("pageNumbers", pageNumbers);

const NumberButton = function (n) {
  return <button>{n}</button>;
};

const PageNumbers = function () {
  return <div></div>;
};

const PrevButton = function () {
  return <button>Prev</button>;
};

const NextButton = function () {
  return <button>Next</button>;
};

export default function Pagination() {
  return (
    <div>
      <h1>Page</h1>
      <PrevButton />
      <PageNumbers />
      <NextButton />
    </div>
  );
}
