import MobileCategoriesDrawerWrapper from "./MobileCategoriesDrawerWrapper";
import MobileSearchDrawer from "./MobileSearchDrawer";

export default async function MobileDrawersWrapper({
  searchParams,
}: {
  searchParams?: { menu?: string; search?: string };
}) {
  const isSearchOpen =
    searchParams?.search === "true" && searchParams?.menu !== "true";
  const isMenuOpen =
    searchParams?.menu === "true" && searchParams?.search !== "true";

  return (
    <>
      <MobileCategoriesDrawerWrapper isOpen={isMenuOpen} />
      <MobileSearchDrawer isOpen={isSearchOpen} />
    </>
  );
}
