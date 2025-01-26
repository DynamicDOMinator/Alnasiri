"use client";

import { FaArrowRight } from "react-icons/fa6";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function DepositContent() {
  const searchParams = useSearchParams();
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [balance, setBalance] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });
/* eslint-disable */
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
/* eslint-enable */
  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${BASE_URL}/wallet/get-balance`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`
          );
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response was not JSON");
      }

      const data = await response.json();
      if (data && typeof data.balance !== "undefined") {
        setBalance(data.balance);
      } else {
        console.error("Invalid balance data:", data);
        setBalance(0);
      }
    } catch (err) {
      console.error("Error fetching balance:", err.message);
      setBalance(0);
    }
  };

  // Fetch initial balance
  useEffect(() => {
    fetchBalance();
    //eslint-disable-next-line
  }, []);

  const verifyTransaction = async (transactionId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${BASE_URL}/lawyer/check-transaction/${transactionId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to verify transaction");
      }

      const data = await response.json();
      console.log("Transaction verified:", data);

      // Fetch updated balance after successful transaction
      await fetchBalance();

      return data;
    } catch (err) {
      console.error("Transaction verification error:", err);
      throw err;
    }
  };

  useEffect(() => {
    const status = searchParams.get("status");
    const message = searchParams.get("message");
    const amount = searchParams.get("amount");
    const id = searchParams.get("id");

    if (status) {
      if (status === "paid" && id) {
        verifyTransaction(id)
          .then(() => {
            setPaymentSuccess(true);
            setError(null);
            setTimeout(() => {
              setPaymentSuccess(false);
            }, 3000);
          })
          .catch((err) => {
            setError(
              "تم الدفع ولكن فشل التحقق من المعاملة. الرجاء الاتصال بالدعم."
            );
            setPaymentSuccess(false);
          });
      } else {
        setError(message || "Payment failed");
        setPaymentSuccess(false);
      }

      if (window.history.replaceState) {
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleAmountChange = (amount) => {
    setSelectedAmount(amount);
    setError(null);
    setPaymentSuccess(false);
    if (amount === null) {
      setCustomAmount("");
    }
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    setCustomAmount(value);
    if (value) {
      const numericValue = parseInt(value);
      if (!isNaN(numericValue) && numericValue > 0) {
        handleAmountChange(numericValue);
      } else {
        handleAmountChange(null);
      }
    } else {
      handleAmountChange(null);
    }
  };

  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target;
    setError(null);

    if (name === "cardNumber") {
      const formatted = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim();
      setCardDetails((prev) => ({ ...prev, [name]: formatted }));
    } else if (name === "expiryMonth") {
      // Only allow numbers and limit to 2 digits
      const numericValue = value.replace(/\D/g, "");
      if (
        numericValue === "" ||
        (parseInt(numericValue) > 0 && parseInt(numericValue) <= 12)
      ) {
        setCardDetails((prev) => ({ ...prev, [name]: numericValue }));
      }
    } else if (name === "expiryYear") {
      // Only allow numbers and limit to 2 digits
      const numericValue = value.replace(/\D/g, "");
      setCardDetails((prev) => ({ ...prev, [name]: numericValue }));
    } else if (name === "cvv") {
      // Only allow numbers and limit to 4 digits
      const numericValue = value.replace(/\D/g, "");
      setCardDetails((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setCardDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validate card details
      if (!selectedAmount && !customAmount) {
        throw new Error("Please select or enter an amount");
      }

      const amount = selectedAmount || parseInt(customAmount);
      if (!amount || amount <= 0) {
        throw new Error("Please enter a valid amount");
      }

      // Basic card validation
      if (!cardDetails.cardNumber.replace(/\s/g, "").match(/^\d{16}$/)) {
        throw new Error("Please enter a valid 16-digit card number");
      }
      if (!cardDetails.cardHolder) {
        throw new Error("Please enter the card holder name");
      }
      if (!cardDetails.expiryMonth || !cardDetails.expiryYear) {
        throw new Error("Please enter a valid expiry date");
      }
      if (!cardDetails.cvv.match(/^\d{3,4}$/)) {
        throw new Error("Please enter a valid CVV");
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      // First, check if the server is accessible
      const response = await fetch("/api/process-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to smallest currency unit (e.g., cents/halalas)
          cardNumber: cardDetails.cardNumber.replace(/\s/g, ""),
          cardHolder: cardDetails.cardHolder,
          expiryMonth: cardDetails.expiryMonth,
          expiryYear: cardDetails.expiryYear,
          cvv: cardDetails.cvv,
        }),
      });

      // Check content type before trying to parse JSON
      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `Payment failed: ${response.status}`
          );
        } else {
          const textError = await response.text();
          console.error("Server response:", textError);
          throw new Error(`Payment failed: ${response.status}`);
        }
      }

      // Ensure we have JSON response
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid server response format");
      }

      const data = await response.json();

      if (data.redirect_url) {
        window.location.href = data.redirect_url;
      } else if (data.status === "success" || data.status === "initiated") {
        // For initiated status, redirect to the transaction URL if available
        if (data.source && data.source.transaction_url) {
          window.location.href = data.source.transaction_url;
          return;
        }

        setPaymentSuccess(true);
        await fetchBalance(); // Refresh balance after successful payment
        // Reset form
        setCardDetails({
          cardNumber: "",
          cardHolder: "",
          expiryMonth: "",
          expiryYear: "",
          cvv: "",
        });
        setSelectedAmount(null);
        setCustomAmount("");
      } else {
        throw new Error(data.message || "Payment processing failed");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(
        err.message || "An error occurred while processing your payment"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className=" lg:max-w-3xl mx-auto bg-white py-8 px-4 sm:px-6 lg:px-8"
    >
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">خطأ!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {paymentSuccess && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">تم!</strong>
          <span className="block sm:inline"> تمت عملية الدفع بنجاح</span>
        </div>
      )}

      <div className="sticky top-0 bg-white pb-2">
        <div className="pt-10">
          <div className="flex lg:flex-col items-start justify-start relative">
            <Link href="/Lawyer-dashboard/Wallet">
              <FaArrowRight />
            </Link>
            <h1 className="lg:text-3xl font-bold pt-6 w-full text-center lg:text-right">
              إضافة اموال
            </h1>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <p className="bg-gray-200 p-3 font-semibold">
          الرصيد <span>{balance} ر.س</span>
        </p>
      </div>

      <div className="pt-5">
        <p>كمية</p>
      </div>

      <div className="pt-5 flex flex-col gap-4">
        <div className="flex items-center gap-2 border-2 p-3 rounded-md">
          <input
            type="radio"
            name="amount"
            value="30"
            checked={selectedAmount === 30}
            onChange={() => handleAmountChange(30)}
            className="appearance-none w-4 h-4 border-4 border-green-600 rounded-full checked:border-green-600 checked:bg-green-600 focus:outline-none"
          />
          <p>30 ر.س</p>
        </div>

        <div className="flex items-center gap-2 border-2 p-3 rounded-md">
          <input
            type="radio"
            name="amount"
            value="40"
            checked={selectedAmount === 40}
            onChange={() => handleAmountChange(40)}
            className="appearance-none w-4 h-4 border-4 border-green-600 rounded-full checked:border-green-600 checked:bg-green-600 focus:outline-none"
          />
          <p>40 ر.س</p>
        </div>

        <div className="flex items-center gap-2 border-2 p-3 rounded-md">
          <input
            type="radio"
            name="amount"
            value="50"
            checked={selectedAmount === 50}
            onChange={() => handleAmountChange(50)}
            className="appearance-none w-4 h-4 border-4 border-green-600 rounded-full checked:border-green-600 checked:bg-green-600 focus:outline-none"
          />
          <p>50 ر.س</p>
        </div>

        <div className="flex items-center gap-2 border-2 p-3 rounded-md">
          <input
            type="radio"
            name="amount"
            value="60"
            checked={selectedAmount === 60}
            onChange={() => handleAmountChange(60)}
            className="appearance-none w-4 h-4 border-4 border-green-600 rounded-full checked:border-green-600 checked:bg-green-600 focus:outline-none"
          />
          <p>60 ر.س</p>
        </div>

        {/* Custom Amount Input */}
        <div className="flex items-center gap-2 border-2 p-3 rounded-md">
          <input
            type="radio"
            name="amount"
            checked={
              selectedAmount !== null &&
              ![30, 40, 50, 60].includes(selectedAmount)
            }
            onChange={() => {
              if (customAmount) {
                handleAmountChange(parseInt(customAmount));
              }
            }}
            className="appearance-none w-4 h-4 border-4 border-green-600 rounded-full checked:border-green-600 checked:bg-green-600 focus:outline-none"
          />
          <div className="flex flex-col w-full">
            <div className="flex justify-between items-center gap-2">
              <p>كمية محددة</p>
              <input
                type="number"
                min="1"
                placeholder="ادخل المبلغ بالريال السعودي"
                value={customAmount}
                onChange={handleCustomAmountChange}
                className="w-[80%] border rounded-md p-2 text-right"
                dir="ltr"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-20 lg:mb-0 mt-10 lg:mt-20">
        <button
          onClick={() => setShowPaymentModal(true)}
          className={`w-1/2 py-2 px-4 mx-auto rounded ${
            selectedAmount
              ? "bg-green-700 text-white hover:bg-green-800"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!selectedAmount}
        >
          ادفع
        </button>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[80]">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-right">
              اضافة بطاقة الائتمان/الخصم
            </h2>
            <p className="text-right mb-4 text-gray-600">
              عند اضافة بطاقة جديدة سيتم حفظها تلقائيا ويمكنك حذفها <br /> لاحقا
              اذا كنت تفضل ذلك!
            </p>
            {error && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                role="alert"
              >
                <strong className="font-bold">خطأ!</strong>
                <span className="block sm:inline"> {error}</span>
              </div>
            )}
            <form dir="ltr" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Card Number
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={handleCardDetailsChange}
                  maxLength="19"
                  placeholder="1234 5678 9012 3456"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Card Holder Name
                </label>
                <input
                  type="text"
                  name="cardHolder"
                  value={cardDetails.cardHolder}
                  onChange={handleCardDetailsChange}
                  placeholder="John Doe"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Expiry Date
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      name="expiryMonth"
                      value={cardDetails.expiryMonth}
                      onChange={handleCardDetailsChange}
                      placeholder="MM"
                      maxLength="2"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                    <input
                      type="text"
                      name="expiryYear"
                      value={cardDetails.expiryYear}
                      onChange={handleCardDetailsChange}
                      placeholder="YY"
                      maxLength="2"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    CVV
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    value={cardDetails.cvv}
                    onChange={handleCardDetailsChange}
                    placeholder="123"
                    maxLength="3"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setError(null);
                  }}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={isLoading}
                >
                  الغاء
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-2 px-4 bg-green-700 text-white rounded-md ${
                    isLoading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-green-800"
                  }`}
                  disabled={isLoading}
                >
                  {isLoading
                    ? "...جاري المعالجة."
                    : `ادفع ${selectedAmount} ر.س`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Deposit() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      }
    >
      <DepositContent />
    </Suspense>
  );
}
