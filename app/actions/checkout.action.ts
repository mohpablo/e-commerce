"use server";

import { CheckoutErrors } from "@/types/checkout.type";
import { CheckoutInput } from "@/services/checkout/checkout.validation";
import { checkout } from "@/services/checkout/checkout.service";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export type CheckoutState = {
  errors?: CheckoutErrors;
};

export async function checkoutAction(
  _prevState: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const raw = Object.fromEntries(formData);
  const data = raw as unknown as CheckoutInput;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(`/login?callbackUrl=${encodeURIComponent("/")}`);
  const result = await checkout(data, session.user);

  if (!result.success) {
    return {
      errors: result.errors,
    };
  }

  const publicKey = process.env.PAYMOB_PUBLIC_KEY;
  if (!publicKey) {
    return {
      errors: {
        _form: ["Configuration error: Missing public key."],
      },
    };
  }

  const clientSecret = result.data?.client_secret;
  if (!clientSecret) {
    return {
      errors: {
        _form: ["Failed to retrieve payment client secret."],
      },
    };
  }

  const paymobUrl = new URL("https://accept.paymob.com/unifiedcheckout");
  paymobUrl.searchParams.set("clientSecret", clientSecret);
  paymobUrl.searchParams.set("publicKey", publicKey);

  redirect(paymobUrl.toString());
}
