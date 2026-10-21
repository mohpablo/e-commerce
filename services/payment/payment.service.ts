"use server";

import {
  CreateIntentionRequest,
  CreateIntentionResponse,
} from "@/types/payment.type";

const BASE_URL = process.env.PAYMOB_BASE_URL;
const KEY = process.env.PAYMOB_SECRET_KEY;
const INTEGRATION_ID = Number(process.env.PAYMOB_INTEGRATION_ID!);

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
