import MobileCategoriesDrawerWrapper from "./MobileCategoriesDrawerWrapper";
import MobileSearchDrawer from "./MobileSearchDrawer";
export default async function MobileDrawersWrapper() {
  return (
    <>
      <MobileCategoriesDrawerWrapper />
      <MobileSearchDrawer />
    </>
  );
}
