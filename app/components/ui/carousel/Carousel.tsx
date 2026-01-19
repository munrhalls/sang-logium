"use client";
// ui/carousel.tsx
import * as React from "react";

// 1. Context to share state (Can we scroll left? Right?)
type CarouselContextProps = {
  scrollNext: () => void;
  scrollPrev: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
};
const CarouselContext = React.createContext<CarouselContextProps | null>(null);

// 2. The Root
export function Carousel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(true);

  const scrollNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: scrollRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollPrev = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -scrollRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  // Listen to scroll events to toggle button visibility
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollPrev(scrollLeft > 0);
      setCanScrollNext(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  return (
    <CarouselContext.Provider
      value={{ scrollNext, scrollPrev, canScrollPrev, canScrollNext }}
    >
      <div
        className={`relative ${className}`}
        // The "Data Attribute" allows us to find the scroll container in children if needed
        data-carousel-root
      >
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="no-scrollbar flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth"
          style={{ scrollbarWidth: "none" }} // Hide scrollbar Firefox
        >
          {children}
        </div>
      </div>
    </CarouselContext.Provider>
  );
}

// 3. The Content Wrapper (Just a flex container)
export function CarouselContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 shrink-0 grow-0 basis-full">{children}</div>
  );
}

// 4. The Item (Forces snap alignment)
export function CarouselItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`min-w-0 shrink-0 grow-0 basis-full snap-center ${className}`}
    >
      {children}
    </div>
  );
}

// 5. The Controls (Consume Context)
export function CarouselNext({ className }: { className?: string }) {
  const { scrollNext, canScrollNext } = React.useContext(CarouselContext)!;
  return (
    <button
      onClick={scrollNext}
      disabled={!canScrollNext}
      className={`absolute right-4 top-1/2 -translate-y-1/2 ${className}`}
    >
      Next
    </button>
  );
}

// ... CarouselPrev is identical but calls scrollPrev
