import Image from "next/image";
import LogoOrbit from "@/public/logo-orbit.svg";

export default function SegmentTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center gap-1">
      <Image src={LogoOrbit} alt="Logo" width={60} height={60} unoptimized />
      <h1 className="text-black font-black text-3xl">{title}</h1>
    </div>
  );
}
