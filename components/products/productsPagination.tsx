"use client";

import { usePathname, useRouter } from "next/navigation";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Props = {
  page: number;
  totalPages: number;
  sort?: string;
  q: string;
};

function getPageNumbers(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "...", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      "...",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}

export function ProductsPagination({ page, totalPages, sort, q }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  if (totalPages <= 1) return null;

  const createHref = (p: number) => {
    const params = new URLSearchParams();

    if (sort) params.set("sort", sort);
    if (q) params.set("q", q);

    params.set("page", p.toString());

    return `${pathname}?${params.toString()}`;
  };

  const handleNavigate = (
    e: React.MouseEvent<HTMLAnchorElement>,
    p: number,
  ) => {
    e.preventDefault();
    router.push(createHref(p), { scroll: false });
  };

  const pages = getPageNumbers(page, totalPages);

  return (
    <Pagination className="mt-12">
      <PaginationContent>
        <PaginationItem>
          {page > 1 ? (
            <PaginationPrevious
              href={createHref(page - 1)}
              onClick={(e) => handleNavigate(e, page - 1)}
            />
          ) : (
            <PaginationPrevious
              aria-disabled="true"
              tabIndex={-1}
              className="pointer-events-none opacity-50"
            />
          )}
        </PaginationItem>

        {pages.map((p, index) => (
          <PaginationItem key={typeof p === "number" ? p : `ellipsis-${index}`}>
            {typeof p === "number" ? (
              <PaginationLink
                href={createHref(p)}
                isActive={p === page}
                onClick={(e) => handleNavigate(e, p)}
              >
                {p}
              </PaginationLink>
            ) : (
              <PaginationEllipsis />
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          {page < totalPages ? (
            <PaginationNext
              href={createHref(page + 1)}
              onClick={(e) => handleNavigate(e, page + 1)}
            />
          ) : (
            <PaginationNext
              aria-disabled="true"
              tabIndex={-1}
              className="pointer-events-none opacity-50"
            />
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
