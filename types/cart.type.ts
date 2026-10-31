import { getCart } from "@/services/cart/cart.service";

export type CartData = Awaited<ReturnType<typeof getCart>>;
export type CartLine = CartData["items"][number];