import { NextResponse } from "next/server";

function validatePaymentData(data) {
  const errors = [];

  // Validate amount
  if (!data.amount || data.amount < 100) {
    // Minimum 1 SAR (100 halalas)
    errors.push("Amount must be at least 1 SAR");
  }

  // Validate card number (remove spaces and check length)
  const cardNumber = (data.cardNumber || "").replace(/\s/g, "");
  console.log("Validating card number:", {
    original: data.cardNumber,
    cleaned: cardNumber,
    length: cardNumber.length,
    isNumeric: /^\d+$/.test(cardNumber),
  });

  if (!cardNumber) {
    errors.push("Card number is required");
  } else if (cardNumber.length !== 16) {
    errors.push(
      `Invalid card number length: ${cardNumber.length} digits (expected 16)`
    );
  } else if (!/^\d+$/.test(cardNumber)) {
    errors.push("Card number must contain only digits");
  }

  // Validate CVV
  if (!data.cvv || !/^\d{3,4}$/.test(data.cvv)) {
    errors.push("Invalid CVV");
  }

  // Validate expiry month
  if (!data.expiryMonth || !/^(0[1-9]|1[0-2])$/.test(data.expiryMonth)) {
    errors.push("Invalid expiry month (must be 01-12)");
  }

  // Validate expiry year
  const fullYear = parseInt(data.expiryYear);
  const currentYear = new Date().getFullYear();
  const twoDigitYear = fullYear % 100;

  // Handle both 2-digit and 4-digit years
  const normalizedYear =
    fullYear.toString().length === 2 ? 2000 + fullYear : fullYear;

  if (
    !data.expiryYear ||
    normalizedYear < currentYear ||
    normalizedYear > currentYear + 20
  ) {
    errors.push("Invalid expiry year");
  }

  // Validate card holder name
  if (!data.cardHolder || data.cardHolder.trim().length < 3) {
    errors.push("Invalid card holder name");
  }

  // Log all validation results
  console.log("Validation results:", {
    amount: data.amount,
    cardNumberValid: !errors.some((e) => e.includes("card number")),
    cvvValid: !errors.some((e) => e.includes("CVV")),
    monthValid: !errors.some((e) => e.includes("month")),
    yearValid: !errors.some((e) => e.includes("year")),
    holderValid: !errors.some((e) => e.includes("holder")),
    errors,
  });

  return errors;
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Log the received data (safely)
    console.log("API received payment data:", {
      ...body,
      cardNumber: body.cardNumber
        ? `****${body.cardNumber.slice(-4)}`
        : "invalid",
      cvv: "***",
    });

    // Validate the payment data
    const validationErrors = validatePaymentData(body);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          status: "failed",
          error: "Data validation failed",
          details: validationErrors,
        },
        { status: 400 }
      );
    }

    // Convert full year to two digits for Moyasar
    const twoDigitYear = parseInt(body.expiryYear) % 100;

    const paymentData = {
      amount: body.amount,
      currency: "SAR",
      description: "Test Payment",
      source: {
        type: "creditcard",
        name: body.cardHolder.trim(),
        number: body.cardNumber.replace(/\s/g, ""),
        cvc: body.cvv,
        month: body.expiryMonth,
        year: twoDigitYear.toString(), // Send two-digit year
      },
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/Lawyer-dashboard/Wallet/Deposit`,
      metadata: {
        return_to: "/Lawyer-dashboard/Wallet/Deposit",
      },
    };

    // Log the Moyasar request (safely)
    console.log("Sending to Moyasar:", {
      ...paymentData,
      source: {
        ...paymentData.source,
        number: "****" + paymentData.source.number.slice(-4),
        cvc: "***",
      },
    });

    const response = await fetch("https://api.moyasar.com/v1/payments", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(process.env.MOYASAR_SECRET_KEY + ":").toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    const payment = await response.json();
    console.log("Moyasar response:", payment);

    if (!response.ok) {
      throw new Error(payment.message || "Payment failed");
    }

    return NextResponse.json(payment);
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json(
      {
        status: "failed",
        error: error.message || "Failed to process payment",
      },
      { status: 500 }
    );
  }
}
