import { test } from "vitest";
import { sum } from "./sum";

test("sum function", () => {
  const a = 2;
  const b = 10;
  const result = sum(a, b);

  console.log({ a, b, result });
});
