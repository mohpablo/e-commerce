import { CheckoutInput } from "@/services/checkout/checkout.validation";

export type CheckoutErrors = Partial<Record<keyof CheckoutInput, string[]>> & {
  _form?: string[];
};
