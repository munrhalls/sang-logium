import { ALL_CATEGORIES_QUERYResult } from "@/sanity.types";
import Link from "next/link";
import { FaRegCircle } from "react-icons/fa";

type MenuItem = NonNullable<ALL_CATEGORIES_QUERYResult>[0];

const MenuHeader = ({ title }: { title: string | null }) => (
  <h3 className="px-4 py-2 font-black text-gray-500">{title}</h3>
);

const MenuLink = ({
  title,
  href,
  onClick,
}: {
  title: string | null;
  href: string;
  onClick?: () => void;
}) => (
  <Link
    href={href}
    onClick={onClick}
    className="group flex min-w-0 items-center rounded-md px-4 py-2 text-gray-800 transition-all duration-100 hover:bg-gray-300 hover:text-yellow-600"
  >
    <FaRegCircle className="mr-2 text-sm" />
    <span className="block overflow-hidden whitespace-nowrap">{title}</span>
  </Link>
);

export function SubcategoryList({
  items,
  parentPath,
}: {
  items: MenuItem[];
  parentPath: string;
}) {
  if (items.length === 0) return null;

  return (
    <div className="pl-4">
      {items.map((item) => {
        if (item.type === "header") {
          return (
            <div key={item._key}>
              <MenuHeader title={item.title} />
              <SubcategoryList items={item.children} parentPath={parentPath} />
            </div>
          );
        }

        const href = `${parentPath}/${item.slug}`;
        return (
          <div key={item._key}>
            <MenuLink title={item.title} href={href} />
            <SubcategoryList items={item.children} parentPath={href} />
          </div>
        );
      })}
    </div>
  );
}
