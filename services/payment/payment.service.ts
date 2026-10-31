"use server";

import {
  CreateIntentionRequest,
  CreateIntentionResponse,
  hmacKeys,
  PaymobTransactionObject,
} from "@/types/payment.type";
import crypto from "crypto";

const BASE_URL = process.env.PAYMOB_BASE_URL;
const KEY = process.env.PAYMOB_SECRET_KEY;
const INTEGRATION_ID = Number(process.env.PAYMOB_INTEGRATION_ID!);
const HMAC_SECRET = process.env.PAYMOB_HMAC_SECRET!;

export async function CreateIntention(
  createIntentionRequest: Omit<CreateIntentionRequest, "payment_methods">,
): Promise<CreateIntentionResponse> {
  const response = await fetch(`${BASE_URL}/v1/intention/`, {
    method: "POST",
    headers: {
      Authorization: `"token"  ${KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...createIntentionRequest,
      payment_methods: [INTEGRATION_ID],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Paymob API Error:", errorText);
    throw new Error(`Paymob error: ${errorText}`);
  }

  return response.json();
}

export async function verifyPaymobHmac(
  transaction: PaymobTransactionObject,
  receivedHmac: string,
): Promise<boolean> {
  let concatenatedString = "";

  for (const key of hmacKeys) {
    let value: unknown;
    if (key === "order") {
      const orderField = transaction.order;
      value =
        typeof orderField === "object" && orderField !== null
          ? orderField.id
          : orderField;
    } else if (key.startsWith("source_data.")) {
      const subKey = key.split(
        ".",
      )[1] as keyof PaymobTransactionObject["source_data"];
      value = transaction.source_data[subKey];
    } else {
      value = transaction[key as keyof PaymobTransactionObject];
    }

    concatenatedString +=
      value !== undefined && value !== null ? String(value) : "";
  }

  const calculatedHmac = crypto
    .createHmac("sha512", HMAC_SECRET)
    .update(concatenatedString)
    .digest("hex");

  const bufCalculated = Buffer.from(calculatedHmac, "utf8");
  const bufReceived = Buffer.from(receivedHmac, "utf8");

  if (bufCalculated.length !== bufReceived.length) {
    return false;
  }

  return crypto.timingSafeEqual(bufCalculated, bufReceived);
}
