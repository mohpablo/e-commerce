import z from "zod";
import { CreateOrderInput, createOrderSchema } from "./order.validation";
import { ServiceResult } from "@/types/ServiceResult";
import { OrderWithItems } from "@/types/order.type";
import { orderRepository } from "@/repositories/order.repository";

export async function createOrder(
  input: CreateOrderInput,
): Promise<ServiceResult<OrderWithItems>> {
  const result = createOrderSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      errors: z.flattenError(result.error).fieldErrors,
    };
  }
  const { items, ...orderData } = result.data;

  const order = await orderRepository.create({
    ...orderData,
    items: {
      create: items,
    },
  });

  return {
    success: true,
    data: order,
  };
}
