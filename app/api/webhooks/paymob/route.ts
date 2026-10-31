import { NextResponse } from "next/server";
import { PaymobWebhookPayload } from "@/types/payment.type";
import { verifyPaymobHmac } from "@/services/payment/payment.service";
import { orderRepository } from "@/repositories/order.repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  console.log("WEBHOOK HIT");

  try {
    const body: PaymobWebhookPayload = await req.json();

    const transaction = body.obj;
    // Paymob sends the HMAC in the URL (?hmac=...), not in the JSON body
    const receivedHmac = new URL(req.url).searchParams.get("hmac");

    if (!transaction || !receivedHmac) {
      console.error("WEBHOOK 400: missing obj or hmac", {
        hasObj: Boolean(transaction),
        hasHmac: Boolean(receivedHmac),
      });
      return NextResponse.json(
        { error: "Invalid payload format" },
        { status: 400 },
      );
    }

    const verified = await verifyPaymobHmac(transaction, receivedHmac);

    if (!verified) {
      console.error("WEBHOOK 401: HMAC mismatch");
      return NextResponse.json(
        { error: "Invalid HMAC signature" },
        { status: 401 },
      );
    }

    const paymobTransactionId = String(transaction.id);
    const isSuccess = transaction.success;
    const amountCents = transaction.amount_cents;

    let paymobOrderId = "";
    let localOrderId: string | undefined = undefined;

    if (typeof transaction.order === "object" && transaction.order !== null) {
      paymobOrderId = String(transaction.order.id);

      if (
        "merchant_order_id" in transaction.order &&
        typeof transaction.order.merchant_order_id === "string"
      ) {
        localOrderId = transaction.order.merchant_order_id;
      }
    } else if (typeof transaction.order === "number") {
      paymobOrderId = String(transaction.order);
    }

    console.log("WEBHOOK parsed", {
      paymobTransactionId,
      paymobOrderId,
      localOrderId,
      isSuccess,
    });

    if (!localOrderId) {
      console.error(
        `WEBHOOK 400: missing merchant_order_id for transaction ${paymobTransactionId}`,
      );
      return NextResponse.json(
        { status: "Missing merchant order ID" },
        { status: 400 },
      );
    }

    const order = await orderRepository.findById(localOrderId);

    if (!order) {
      console.error(
        `WEBHOOK 404: order ${localOrderId} not found (transaction ${paymobTransactionId})`,
      );
      return NextResponse.json({ status: "Order not found" }, { status: 404 });
    }

    if (order.status !== "PENDING") {
      console.log(`WEBHOOK: order ${order.id} already ${order.status}`);
      return NextResponse.json(
        { status: "Already processed" },
        { status: 200 },
      );
    }

    if (isSuccess) {
      await orderRepository.updateStatusAndCreatePayment(
        order.id,
        "PROCESSING",
        {
          paymobTransactionId,
          paymobOrderId,
          amountCents,
          currency: transaction.currency || "EGP",
          status: "SUCCESS",
          paymentMethod:
            transaction.source_data?.sub_type ||
            transaction.source_data?.type ||
            "Card",
          cardSubType: transaction.source_data?.sub_type,
          maskedPan: transaction.source_data?.pan,
        },
      );
      console.log(`WEBHOOK: order ${order.id} -> PROCESSING`);
    } else {
      await orderRepository.updateStatusAndCreatePayment(
        order.id,
        "CANCELLED",
        {
          paymobTransactionId,
          paymobOrderId,
          amountCents,
          currency: transaction.currency || "EGP",
          status: "FAILED",
        },
      );
      console.log(`WEBHOOK: order ${order.id} -> CANCELLED`);
    }

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.error("WEBHOOK 500:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}