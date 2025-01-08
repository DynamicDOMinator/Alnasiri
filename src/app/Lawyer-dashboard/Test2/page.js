"use client";
import React, { useState, useEffect } from "react";
import { isIOS } from "react-device-detect";

const ApplePayButton = () => {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check Apple Pay support only on client side
    const checkApplePaySupport = () => {
      const isIOSDevice = /iphone|ipad|ipod/.test(
        window.navigator.userAgent.toLowerCase()
      );

      const hasApplePay =
        window.ApplePaySession && ApplePaySession.canMakePayments();

      console.log("Device checks:", {
        isIOS: isIOSDevice,
        hasApplePaySession: !!window.ApplePaySession,
        canMakePayments: hasApplePay,
      });

      setIsSupported(isIOSDevice && hasApplePay);
    };

    checkApplePaySupport();
  }, []);

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

  return (
    <div>
      {isSupported ? (
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
        <div>
          <p>Apple Pay غير متاح لهذا الجهاز.</p>
          <p style={{ fontSize: "12px", color: "gray" }}>
            Debug:{" "}
            {typeof window !== "undefined" && (
              <>
                {isIOS ? "iOS detected" : "Not iOS"} |
                {window.ApplePaySession
                  ? " ApplePay Available"
                  : " No ApplePay"}
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default ApplePayButton;
