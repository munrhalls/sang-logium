import { Suspense } from "react";
import MobileCategoriesDrawerShellInner from "./MobileCategoriesDrawerShellInner";
import MobileCategoriesDrawerWrapper from "./MobileCategoriesDrawerWrapper";

export default function MobileCategoriesDrawerShell() {
  return (
    <Suspense fallback={null}>
      <MobileCategoriesDrawerShellInner>
        <MobileCategoriesDrawerWrapper />
      </MobileCategoriesDrawerShellInner>
    </Suspense>
  );
}
