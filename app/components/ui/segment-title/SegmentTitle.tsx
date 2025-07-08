import Image from "next/image";
import LogoOrbit from "@/public/logo-orbit.svg";
import LogoOrbitWhite from "@/public/logo-orbit-white.svg";
export default function SegmentTitle({
  title,
  width,
  white = false,
}: {
  title: string;
  white?: boolean;
  width?: number;
  height?: number;
}) {
  const Logo = white ? LogoOrbitWhite : LogoOrbit;
  return (
    <div className={`flex items-center justify-center gap-1`}>
      <Image
        src={Logo}
        alt="Logo"
        width={width ?? 60}
        unoptimized
      />
      <h1
        className={`${white ? "text-white" : "text-black"} font-black text-3xl`}
      >
        {title}
      </h1>
    </div>
  );
}
