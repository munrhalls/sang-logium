import Address from "app/(store)/checkout/checkout.types";

import { test } from "vitest";
import { sum } from "./test";

test("sum function", () => {
  const a = 2;
  const b = 14;
  const result = sum({ a: 1, b: 2 }, 10);

  console.log({ a, b, result });
});
