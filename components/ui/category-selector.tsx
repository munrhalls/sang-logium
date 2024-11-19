"use client";

import { Category } from "@/sanity.types";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CategorySelectorProps {
  categories: Category[];
}

export default function CategorySelectorComponent({
  categories,
}: CategorySelectorProps) {
  const [open, setOpen] = useState(false);
  const [value, setvalue] = useState<string>("");

  const router = useRouter();
  return <div>CategorySelectorComponent</div>;
}
