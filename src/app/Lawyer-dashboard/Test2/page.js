"use client";
import React, { useState, useEffect } from "react";
import { isIOS } from "react-device-detect";

const ApplePayButton = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState({
    isIOS: false,
    hasApplePaySession: false,
  });

  useEffect(() => {
    const checkApplePaySupport = () => {
      const isIOSDevice = /iphone|ipad|ipod/.test(
        window.navigator.userAgent.toLowerCase()
      );

      const hasApplePay =
        window.ApplePaySession && ApplePaySession.canMakePayments();

      setDebugInfo({
        isIOS: isIOSDevice,
        hasApplePaySession: !!window.ApplePaySession,
      });

      setIsSupported(isIOSDevice && hasApplePay);
      setIsLoading(false);
    };

    checkApplePaySupport();
  }, []);

  const handleApplePay = async () => {
    try {
      const paymentRequest = {
        countryCode: 'US',
        currencyCode: 'USD',
        supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
        merchantCapabilities: ['supports3DS', 'supportsCredit', 'supportsDebit'],
        total: {
          label: 'Your Company Name', // Replace with your company name
          type: 'final',
          amount: '1.00'
        },
        requiredBillingContactFields: ['postalAddress', 'name'],
        requiredShippingContactFields: ['postalAddress', 'name', 'email', 'phone']
      };

      const session = new ApplePaySession(6, paymentRequest); // Using latest version (6)

      session.onvalidatemerchant = async (event) => {
        try {
          // You need to implement this endpoint on your server
          const response = await fetch('/api/apple-pay/validate-merchant', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              validationURL: event.validationURL
            })
          });
          
          const merchantSession = await response.json();
          session.completeMerchantValidation(merchantSession);
        } catch (err) {
          console.error('Merchant validation failed:', err);
          session.abort();
        }
      };

      session.onpaymentauthorized = (event) => {
        // Process the payment on your server
        console.log('Payment authorized:', event.payment);
        
        // Complete the payment
        session.completePayment(ApplePaySession.STATUS_SUCCESS);
      };

      session.oncancel = (event) => {
        console.log('Payment cancelled:', event);
      };

      session.begin();
    } catch (error) {
      console.error('Apple Pay error:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {isSupported ? (
        <button
          onClick={handleApplePay}
          className="bg-black text-white h-10 min-w-[200px] px-5 rounded-md flex items-center justify-center gap-1 font-[-apple-system,system-ui,BlinkMacSystemFont,sans-serif] text-sm font-medium cursor-pointer antialiased hover:bg-black/90 transition-colors"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 17 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.498 4.974c.694-.835 1.17-2.001 1.04-3.169-1.006.041-2.226.67-2.947 1.517-.648.75-1.214 1.945-1.06 3.094 1.122.088 2.27-.571 2.967-1.442zm3.381 11.12c-.385 1.146-.573 1.658-1.071 2.673-.687 1.402-1.656 3.148-2.86 3.167-.963.016-1.396-.517-2.6-.517-1.205 0-1.582.5-2.576.533-1.034.033-1.821-1.517-2.508-2.918-1.366-2.786-2.405-7.876-1.006-11.32.937-2.317 2.616-3.787 4.442-3.828 1.389-.033 2.27.834 3.426.834 1.157 0 1.862-.834 3.524-.834.67 0 2.564.267 3.774 2.017-3.327 1.733-2.783 6.233.455 10.193z"
              fill="currentColor"
            />
          </svg>
          Pay
        </button>
      ) : (
        <div>
          <p>Apple Pay غير متاح لهذا الجهاز.</p>
          <p style={{ fontSize: "12px", color: "gray" }}>
            Debug: {debugInfo.isIOS ? "iOS detected" : "Not iOS"} |
            {debugInfo.hasApplePaySession
              ? " ApplePay Available"
              : " No ApplePay"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ApplePayButton;
