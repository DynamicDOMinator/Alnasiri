"use client";

import { useEffect, useState } from "react";

export default function TestPayment() {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [formData, setFormData] = useState({
    amount: 2000, // Default amount: 10 SAR
    cardNumber: "",
    cardHolder: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "amount") {
      setFormData({
        ...formData,
        amount: Math.floor(parseFloat(value) * 100),
      });
    } else if (name === "cardNumber") {
      // Format card number with spaces every 4 digits
      const formatted = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim();
      setFormData({
        ...formData,
        cardNumber: formatted,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Sending payment data:", formData); // Log the request data

      const response = await fetch("/api/process-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Payment response:", data); // Log the response data

      setPaymentDetails(data);
      setPaymentStatus(data.status);
    } catch (error) {
      console.error("Error processing payment:", error);
      setPaymentStatus("error");
      setPaymentDetails({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 mt-32 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Payment Form</h1>

      {/* Custom Payment Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6"
      >
        {/* Amount Input */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Amount (SAR)
          </label>
          <input
            type="number"
            name="amount"
            min="0.01"
            step="0.01"
            value={formData.amount / 100}
            onChange={handleInputChange}
            className="border rounded-md px-3 py-2 w-full"
            required
          />
        </div>

        {/* Card Number */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Card Number
          </label>
          <input
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleInputChange}
            placeholder="1234 5678 9012 3456"
            maxLength="19"
            className="border rounded-md px-3 py-2 w-full"
            required
          />
        </div>

        {/* Card Holder */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Card Holder Name
          </label>
          <input
            type="text"
            name="cardHolder"
            value={formData.cardHolder}
            onChange={handleInputChange}
            className="border rounded-md px-3 py-2 w-full"
            required
          />
        </div>

        {/* Expiry Date and CVV */}
        <div className="flex space-x-4 mb-4">
          <div className="flex-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Expiry Month
            </label>
            <select
              name="expiryMonth"
              value={formData.expiryMonth}
              onChange={handleInputChange}
              className="border rounded-md px-3 py-2 w-full"
              required
            >
              <option value="">MM</option>
              {Array.from({ length: 12 }, (_, i) => {
                const month = (i + 1).toString().padStart(2, "0");
                return (
                  <option key={month} value={month}>
                    {month}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Expiry Year
            </label>
            <select
              name="expiryYear"
              value={formData.expiryYear}
              onChange={handleInputChange}
              className="border rounded-md px-3 py-2 w-full"
              required
            >
              <option value="">YYYY</option>
              {Array.from({ length: 10 }, (_, i) => {
                const year = (new Date().getFullYear() + i).toString();
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              CVV
            </label>
            <input
              type="text"
              name="cvv"
              value={formData.cvv}
              onChange={handleInputChange}
              maxLength="4"
              placeholder="123"
              className="border rounded-md px-3 py-2 w-full"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
        >
          {isLoading ? "Processing..." : "Pay Now"}
        </button>
      </form>

      {/* Test Card Information */}
      <div className="bg-blue-50 p-4 rounded-lg mt-6">
        <h2 className="font-semibold mb-2">Test Cards:</h2>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-semibold">Successful Payment:</span>
          </p>
          <ul className="list-disc pl-5">
            <li>Visa: 4111 1111 1111 1111</li>
            <li>Mastercard: 5454 5454 5454 5454</li>
            <li>mada: 4462 0300 0000 0001</li>
          </ul>
          <p>
            <span className="font-semibold">Failed Payment:</span>
          </p>
          <ul className="list-disc pl-5">
            <li>Insufficient Funds: 4111 1111 1111 1113</li>
            <li>General Decline: 4242 4242 4242 4242</li>
          </ul>
        </div>
      </div>

      {/* Payment Status Display */}
      {paymentStatus && !isLoading && (
        <div className="mt-6 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Status</h2>
          <div className="space-y-4">
            <div>
              <span className="font-semibold">Status: </span>
              <span
                className={`${
                  paymentStatus === "paid"
                    ? "text-green-600"
                    : paymentStatus === "failed"
                      ? "text-red-600"
                      : "text-yellow-600"
                }`}
              >
                {paymentStatus.toUpperCase()}
              </span>
            </div>
            {paymentDetails && paymentStatus === "paid" && (
              <>
                <div>
                  <span className="font-semibold">Amount: </span>
                  {paymentDetails.amount / 100} SAR
                </div>
                <div>
                  <span className="font-semibold">Transaction ID: </span>
                  {paymentDetails.id}
                </div>
              </>
            )}
            {paymentStatus === "failed" && paymentDetails?.error && (
              <div className="text-red-600">Error: {paymentDetails.error}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
