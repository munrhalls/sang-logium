import Link from "next/link";
import { HeroPayload } from "@/types"; // Defined in previous step

const SmartLink = ({
  link,
  className,
  children,
}: {
  link: HeroPayload["slides"][0]["link"];
  className?: string;
  children: React.ReactNode;
}) => {
  let href = "/";

  switch (link.type) {
    case "product":
      href = `/products/${link.product?.slug}`;
      break;
    case "sale":
      href = `/sales/${link.sale?.slug}`;
      break;
    case "custom":
      href = link.url || "/";
      break;
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
};
