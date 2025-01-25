import { NextResponse } from "next/server";
import Moyasar from "moyasar";

export async function POST(request) {
  try {
    const body = await request.json();

    // Initialize Moyasar with your secret key
    const moyasar = new Moyasar(process.env.MOYASAR_SECRET_KEY);

    // Format the data for Moyasar API
    const paymentData = {
      amount: body.amount,
      currency: "SAR",
      description: "Test Payment",
      source: {
        type: "creditcard",
        name: body.cardHolder,
        number: body.cardNumber.replace(/\s/g, ""),
        cvc: body.cvv,
        month: body.expiryMonth,
        year: body.expiryYear,
      },
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/TestPayment`,
    };

    // Make request to Moyasar API
    const payment = await moyasar.payment.create(paymentData);

    return NextResponse.json(payment);
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json(
      { status: "failed", error: error.message || "Failed to process payment" },
      { status: 500 }
    );
  }
}
