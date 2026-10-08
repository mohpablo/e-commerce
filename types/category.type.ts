import { Prisma } from "@/lib/generated/prisma/client";

export type Category = Prisma.CategoryGetPayload<{
  select: { id: true; name: true; slug: true };
}>;

export type CategoryWithCount = Prisma.CategoryGetPayload<{
  select: { id: true; name: true; slug: true; _count: true };
}>;
