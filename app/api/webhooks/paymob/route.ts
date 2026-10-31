import { NextResponse } from "next/server";
import { PaymobWebhookPayload } from "@/types/payment.type";
import { verifyPaymobHmac } from "@/services/payment/payment.service";
import { orderRepository } from "@/repositories/order.repository"; 

export async function POST(req: Request) {
  try {
    const body: PaymobWebhookPayload = await req.json();

    const transaction = body.obj;
    const receivedHmac = body.hmac;

    if (!transaction || !receivedHmac) {
      return NextResponse.json(
        { error: "Invalid payload format" },
        { status: 400 },
      );
    }

    const verified = await verifyPaymobHmac(transaction, receivedHmac);

    if (!verified) {
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

    if (!localOrderId) {
      console.error(
        `Missing merchant_order_id for Paymob transaction: ${paymobTransactionId}`,
      );
      return NextResponse.json(
        { status: "Missing merchant order ID" },
        { status: 400 },
      );
    }

    const order = await orderRepository.findById(localOrderId);

    if (!order) {
      console.error(
        `Order not found for Paymob transaction: ${paymobTransactionId}`,
      );
      return NextResponse.json({ status: "Order not found" }, { status: 404 });
    }

    if (order.status !== "PENDING") {
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
    }

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
