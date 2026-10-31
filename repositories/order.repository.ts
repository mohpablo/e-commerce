import { prisma } from "@/lib/prisma";
import { OrderStatus, PaymentStatus } from "@/lib/generated/prisma/enums";
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


  async updateStatusAndCreatePayment(
    orderId: string,
    orderStatus: OrderStatus,
    paymentData: {
      paymobTransactionId: string;
      paymobOrderId: string;
      amountCents: number;
      currency: string;
      status: PaymentStatus;
      paymentMethod?: string;
      cardSubType?: string;
      maskedPan?: string;
    },
  ) {
    return prisma.$transaction([
      prisma.order.update({
        where: { id: orderId },
        data: { status: orderStatus },
      }),
      prisma.payment.create({
        data: {
          orderId,
          ...paymentData,
        },
      }),
    ]);
  },
};
