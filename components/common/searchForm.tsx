"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";

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

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (term.trim()) {
      params.set("q", term.trim());
    } else {
      params.delete("q");
    }

    params.delete("page"); 

    router.replace(`/products?${params.toString()}`, { scroll: false });
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      handleSearch(e.target.value);
    }, 300);
  };

  const onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const formData = new FormData(e.currentTarget);
    handleSearch(formData.get("q") as string);
  };

  return (
    <form onSubmit={onSubmit} role="search" className={className}>
      <InputGroup className="h-10 rounded-full bg-muted/60">
        <InputGroupInput
          key={searchParams.get("q") ?? "empty"}
          name="q"
          type="search"
          placeholder="Search products"
          aria-label="Search products"
          defaultValue={searchParams.get("q") ?? ""}
          onChange={onChange}
        />

        <InputGroupAddon>
          <Search />
        </InputGroupAddon>

        <InputGroupAddon align="inline-end">
          <InputGroupButton
            type="submit"
            variant="secondary"
            className="rounded-full"
          >
            Search
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
