"use client";

import { Category } from "@/sanity.types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
  CommandGroup,
} from "./command";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "./button";
import cn from "classnames";
import { Check } from "lucide-react";
interface CategorySelectorProps {
  categories: Category[];
}

export default function CategorySelectorComponent({
  categories,
}: CategorySelectorProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>("");

  const router = useRouter();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full max-w-full relative flex justify-center sm:justify-start sm:flex-none items-center space-x-2 bg-blue-500 hover:bg-blue-700 hover:text-white text-white font-bold py-2 px-4 rounded"
        >
          {value
            ? categories.find((category) => category._id === value)?.title
            : "Filter by category"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fukl p-0">
        <Command>
          <CommandInput
            placeholder="Search category..."
            className="h-9"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const selectedCategory = categories.find((c) =>
                  c.title
                    ?.toLowerCase()
                    .includes(e.currentTarget.value.toLowerCase())
                );

                if (selectedCategory?.slug?.current) {
                  setValue(selectedCategory._id);
                  router.push(`/categories/${selectedCategory.slug.current}`);
                  setOpen(false);
                }
              }
            }}
          ></CommandInput>
          <CommandList>
            <CommandEmpty>No categories found.</CommandEmpty>
            <CommandGroup>
              {categories.map((category) => (
                <CommandItem
                  key={category._id}
                  value={category.title}
                  onSelect={() => {
                    setValue(value === category._id ? "" : category._id);
                    router.push(`/categories/${category.slug?.current}`);
                    setOpen(false);
                  }}
                >
                  {category.title}
                  <Check
                    className={
                      (cn("ml-auto h-4 w-4"),
                      value === category._id ? "opacity-100" : "opacity-0")
                    }
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
