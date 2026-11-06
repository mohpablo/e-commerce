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
    const value = key.split(".").reduce<unknown>((obj, part) => {
      if (obj === null || obj === undefined || typeof obj !== "object") {
        return undefined;
      }

      return (obj as Record<string, unknown>)[part];
    }, transaction);

    concatenatedString +=
      value !== undefined && value !== null ? String(value) : "";
  }

  const calculatedHmac = crypto
    .createHmac("sha512", HMAC_SECRET)
    .update(concatenatedString)
    .digest("hex");

  const calculatedBuffer = Buffer.from(calculatedHmac, "hex");
  const receivedBuffer = Buffer.from(receivedHmac, "hex");

  if (
    receivedHmac.length !== 128 ||
    calculatedBuffer.length !== receivedBuffer.length
  ) {
    return false;
  }

  return crypto.timingSafeEqual(calculatedBuffer, receivedBuffer);
}
