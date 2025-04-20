"use client ";

const pagesCount = 15;
const pageSize = 10;
const totalPages = Math.ceil(pagesCount / pageSize);
const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
console.log("pageNumbers", pageNumbers);

const initialNums = [1, 2, 3];
const throughNums = [7];
const lastNum = 12;

const NumberButton = function (n) {
  return <button className="mx-1">{n}</button>;
};

const PageNumbers = function () {
  return (
    <div className="flex">
      {initialNums.map((pageNum) => NumberButton(pageNum))}...
      {throughNums.map((pageNum) => NumberButton(pageNum))}...
      {NumberButton(lastNum)}
    </div>
  );
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
      <div className="flex justify-around items-center">
        <PrevButton />
        <PageNumbers />
        <NextButton />
      </div>
    </div>
  );
}
