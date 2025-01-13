import { NextResponse } from "next/server";


export async function POST(request) {
  try {
    const body = await request.json();
    console.log("API received payment data:", body); // Log received data

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
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-callback`,
    };

    console.log("Sending to Moyasar:", paymentData); // Log Moyasar request

    const response = await fetch("https://api.moyasar.com/v1/payments", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(process.env.MOYASAR_SECRET_KEY + ":").toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    const payment = await response.json();
    console.log("Moyasar response:", payment); // Log Moyasar response

    if (!response.ok) {
      throw new Error(payment.message || "Payment failed");
    }

    return NextResponse.json(payment);
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json(
      { status: "failed", error: error.message || "Failed to process payment" },
      { status: 500 }
    );
  }
}
