"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentInfo, setPaymentInfo] = useState({
    id: "",
    status: "",
    amount: "",
    message: "",
  });

  useEffect(() => {
    // Get payment details from URL parameters
    const id = searchParams.get("id");
    const status = searchParams.get("status");
    const amount = searchParams.get("amount");
    const message = searchParams.get("message");

    setPaymentInfo({
      id,
      status,
      amount,
      message,
    });

    // Log payment information
    console.log("Payment callback received:", {
      id,
      status,
      amount,
      message,
    });

    // You can handle the payment result here
    // For example, make an API call to your backend to verify the payment
  }, [searchParams]);

  return (
    <div className="container mx-auto p-4 mt-32 max-w-2xl">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Payment Result</h1>

        {paymentInfo.status === "paid" ? (
          <div className="text-green-600">
            <p className="text-lg font-semibold">Payment Successful!</p>
            <div className="mt-4">
              <p>Transaction ID: {paymentInfo.id}</p>
              <p>Amount: {paymentInfo.amount} SAR</p>
              <p>Status: {paymentInfo.status}</p>
              <p>Message: {paymentInfo.message}</p>
            </div>
          </div>
        ) : (
          <div className="text-red-600">
            <p className="text-lg font-semibold">Payment Failed</p>
            <div className="mt-4">
              <p>Status: {paymentInfo.status}</p>
              <p>Message: {paymentInfo.message}</p>
            </div>
          </div>
        )}

        <button
          onClick={() => router.push("/TestPayment")}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Back to Payment Page
        </button>
      </div>
    </div>
  );
}

export default function PaymentCallback() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  );
}
