"use client";

import React from "react";
import { isIOS } from "react-device-detect";

const ApplePayButton = () => {
  const handleApplePay = () => {
    // تحقق من دعم Apple Pay
    if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
      const paymentRequest = {
        countryCode: "US", // رمز الدولة
        currencyCode: "USD", // العملة
        supportedNetworks: ["visa", "masterCard", "amex"], // شبكات الدفع المدعومة
        merchantCapabilities: ["supports3DS"], // إمكانيات التاجر
        total: {
          label: "My Store", // اسم المتجر
          amount: "19.99", // المبلغ
        },
      };

      // إنشاء جلسة Apple Pay
      const session = new ApplePaySession(3, paymentRequest);

      // بدء الجلسة
      session.begin();

      // معالجة الأحداث
      session.onvalidatemerchant = (event) => {
        // هنا يمكنك الاتصال بخادمك للتحقق من التاجر
        const validationURL = event.validationURL;
        fetch("/api/validate-merchant", {
          method: "POST",
          body: JSON.stringify({ validationURL }),
        })
          .then((response) => response.json())
          .then((data) => {
            session.completeMerchantValidation(data.merchantSession);
          });
      };

      session.onpaymentauthorized = (event) => {
        // هنا يمكنك الاتصال بخادمك لإكمال عملية الدفع
        const payment = event.payment;
        fetch("/api/process-payment", {
          method: "POST",
          body: JSON.stringify({ payment }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              session.completePayment(ApplePaySession.STATUS_SUCCESS);
            } else {
              session.completePayment(ApplePaySession.STATUS_FAILURE);
            }
          });
      };
    } else {
      alert("Apple Pay غير مدعوم على هذا الجهاز.");
    }
  };

  // Add new function to check Apple Pay support
  const isApplePaySupported = () => {
    if (typeof window === "undefined") return false;
    return isIOS && window.ApplePaySession && ApplePaySession.canMakePayments();
  };

  return (
    <div>
      {isApplePaySupported() ? (
        <button
          onClick={handleApplePay}
          style={{
            backgroundColor: "black",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Pay with Apple Pay
        </button>
      ) : (
        <p>Apple Pay غير متاح لهذا الجهاز.</p>
      )}
    </div>
  );
};

export default ApplePayButton;
