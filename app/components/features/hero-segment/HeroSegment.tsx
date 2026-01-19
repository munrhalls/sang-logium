import CarouselSingleSlide from "@/ui/carousel-single-slide"; // Your existing carousel
import { HeroPayload } from "@/types";
import { HeroSlide } from "./../hero-slide/HeroSlide";

export default function HeroSegment({ data }: { data: HeroPayload }) {
  const { layout, slides } = data;

  // A. Carousel Layout
  if (layout === "carousel") {
    // Map data to the format your generic carousel expects,
    // OR update your carousel to accept children/components.
    // Here we wrap our nice HeroSlide in the carousel.
    const carouselSlides = slides.map((slide, index) => (
      <HeroSlide
        key={slide._id}
        slide={slide}
        layout="overlay" // Carousels usually look best as overlays
        priority={index === 0}
      />
    ));

    return (
      <section className="h-[600px] w-full">
        <CarouselSingleSlide
          prebuiltSlides={carouselSlides}
          keys={slides.map((s) => s._id)}
        />
      </section>
    );
  }

  // B. Static Layout (Split or Overlay)
  // We just take the first slide since static heroes only show one thing.
  const activeSlide = slides[0];

  if (!activeSlide) return null;

  return (
    <section className="h-[600px] w-full border-b">
      <HeroSlide slide={activeSlide} layout={layout} priority={true} />
    </section>
  );
}
