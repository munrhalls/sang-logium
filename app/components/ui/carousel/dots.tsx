// import Logo from "@/public/icons/Logo.svg";
// import Ellipse from "@/public/icons/Ellipse.svg";

interface CarouselDotsProps {
  keys: string[];
  currentIndex: number;
  onDotClick: (index: number) => void;
}

export default function Dots(
  {
    // keys,
    // currentIndex,
    // onDotClick,
  }: CarouselDotsProps
) {
  return (
    <div className="h-full text-white text-center z-50  sm:bg-transparent flex flex-shrink-0 justify-center items-center gap-2 lg:gap-3 xl:gap-4 xl:mb-4 cursor-pointer">
      return <div>dots</div>
      {/* {keys.map((key, i) => {
        return currentIndex === i ? (
          <Logo key={key} />
        ) : (
          <Ellipse key={key} onClick={() => onDotClick(i)} />
        );
      })} */}
    </div>
  );
}

{
  /* {Array.from({ length: numberOfDots }).map((_, i) => (

        <Image
          loading="lazy"
          quality={50}
          key={i}
          src={currentIndex === i ? Logo : Ellipse}
          height={32}
          width={32}
          alt={"Icon"}
          className={`${currentIndex === i ? "cursor-default h-6 w-6 sm:h-8 sm:w-8 lg:h-12 lg:w-12 xl:h-12 xl:w-12 sm:mb-2" : "cursor-pointer h-4 w-4 sm:h-6 sm:w-6 lg:h-8 lg:w-8 sm:mb-2"}`}
          onClick={() => onDotClick(i)}
        />
      ))} */
}
