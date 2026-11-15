"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, useTransition } from "react";

import GooeySearch from "@/components/originkit/ui/gooey-search";


type Props = {
  className?: string;
  variant?: "animated" | "compact";
};

export function SearchForm({ className, variant = "animated" }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isPending, startTransition] = useTransition();
  const urlQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(urlQuery);

  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);
  if (prevUrlQuery !== urlQuery) {
    setPrevUrlQuery(urlQuery);
    setQuery(urlQuery);
  }

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const targetPath =
      pathname === "/products" || pathname.startsWith("/categories/")
        ? pathname
        : "/products";

    if (term.trim()) {
      params.set("q", term.trim());
    } else {
      params.delete("q");
    }

    params.delete("page");

    startTransition(() => {
      router.replace(`${targetPath}?${params.toString()}`, { scroll: false });
    });
  };

  const onChange = (value: string) => {
    setQuery(value);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      handleSearch(value);
    }, 300);
  };

  const onSubmit = (term: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    handleSearch(term);
  };



  return (
    <div role="search" aria-busy={isPending} className={className}>
      <GooeySearch
        placeholder="Search products"
        value={query}
        onChange={onChange}
        onSubmit={onSubmit}
        width={400}
        barHeight={64}
        scale={64}
        fill="var(--background)"
        borderColor="var(--border)"
        iconColor="var(--foreground)"
        textColor="var(--foreground)"
        placeholderColor="var(--muted-foreground)"
        style={{ height: "67px" }}
      />
    </div>
  );
}
