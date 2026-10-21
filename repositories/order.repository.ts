import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@/lib/generated/prisma/enums";
import { CreateOrderData } from "@/types/order.type";

export const orderRepository = {
  create(data: CreateOrderData) {
    return prisma.order.create({
      data,
      include: { items: true },
    });
  },

  findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
  },

  findByIdForUser(id: string, userId: string) {
    return prisma.order.findFirst({
      where: { id, userId },
      include: { items: true },
    });
  },

  updateStatus(id: string, status: OrderStatus) {
    return prisma.order.update({
      where: { id },
      data: { status },
    });
  },

  cancel(id: string) {
    return prisma.order.update({
      where: { id },
      data: { status: OrderStatus.CANCELLED },
    });
  },
};
