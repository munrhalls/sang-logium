import Image from "next/image";
import LogoOrbit from "@/public/logo-orbit.svg";
import LogoOrbitWhite from "@/public/logo-orbit-white.svg";

export default function SegmentTitle({
  title,
  white = false,
}: {
  title: string;
  white?: boolean;
}) {
  const Logo = white ? LogoOrbitWhite : LogoOrbit;

  return (
    <div className="flex items-center justify-center gap-1">
      <Image src={Logo} alt="Logo" width={60} height={60} unoptimized />
      <h1
        className={`${white ? "text-white" : "text-black"} font-black text-3xl`}
      >
        {title}
      </h1>
    </div>
  );
}
