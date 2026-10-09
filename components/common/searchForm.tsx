"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, useTransition } from "react";

import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "../ui/input-group";

type Props = {
  className?: string;
};

export function SearchForm({ className }: Props) {
  const router = useRouter();
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

    if (term.trim()) {
      params.set("q", term.trim());
    } else {
      params.delete("q");
    }

    params.delete("page");

    startTransition(() => {
      router.replace(`/products?${params.toString()}`, { scroll: false });
    });
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      handleSearch(value);
    }, 300);
  };

  const onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    handleSearch(query);
  };

  return (
    <form onSubmit={onSubmit} role="search" className={className}>
      <InputGroup className="h-10 rounded-full bg-muted/60">
        <InputGroupInput
          name="q"
          type="search"
          placeholder="Search products"
          aria-label="Search products"
          value={query}
          onChange={onChange}
        />

        <InputGroupAddon>
          <Search className={isPending ? "animate-pulse opacity-50" : ""} />
        </InputGroupAddon>

        <InputGroupAddon align="inline-end">
          <InputGroupButton
            type="submit"
            variant="secondary"
            className="rounded-full"
            disabled={isPending}
          >
            Search
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
