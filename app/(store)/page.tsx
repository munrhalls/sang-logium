import Footer from "../components/layout/footer/Footer";
import HeroSegment from "../components/features/homepage/aggregate/HeroSegment";
import MainSegment from "../components/features/homepage/aggregate/MainSegment";
import BottomSegment from "../components/features/homepage/aggregate/BottomSegment";

export const revalidate = 5400;
export const dynamic = "force-static";

export default async function Page() {
  // TODO Single MEGA-QUERY
  return (
    <main className="relative h-full overflow-x-hidden">
      {/* // TODO
      1. Define the Component "Asks" (The Fragment)
Don't write the query yet. Write the TypeScript Interface each component needs. This defines the "Reality" the components expect. */}
      <HeroSegment />
      <MainSegment />
      <BottomSegment />
      <Footer />
    </main>
  );
}
