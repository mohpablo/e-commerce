"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const options = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
];

export function ProductSortSelect({
  value,
  className = "w-48",
}: {
  value: string;
  className?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <Select
      value={value}
      items={options}
      onValueChange={(next) => {
        if (next === null) return;
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", next);
        params.delete("page");
        router.push(`/products?${params.toString()}`);
      }}
    >
      <SelectTrigger className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
