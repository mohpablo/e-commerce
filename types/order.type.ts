import { Prisma } from "@/lib/generated/prisma/client";

export type CreateOrderData = Prisma.OrderUncheckedCreateInput;

export type OrderWithItems = Prisma.OrderGetPayload<{
  include: { items: true };
}>;