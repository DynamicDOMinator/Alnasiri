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
        countryCode: "US",
        currencyCode: "USD",
        supportedNetworks: ["visa", "masterCard", "amex", "discover"],
        merchantCapabilities: ["supports3DS"],
        total: {
          label: "Your Company Name",
          type: "final",
          amount: "10.00",
        },
      };

      const session = new ApplePaySession(3, paymentRequest); // Downgrading to version 3 for better compatibility

      session.onvalidatemerchant = (event) => {
        session.completeMerchantValidation({
          merchantIdentifier: "merchant.com.yourcompany.name",
          domainName: "your-domain.com",
          displayName: "Your Company Name",
        });
      };

      session.onpaymentauthorized = (event) => {
        // Always approve the payment for testing
        session.completePayment(ApplePaySession.STATUS_SUCCESS);
      };

      session.oncancel = (event) => {
        // Handle cancel event
      };

      session.begin();
    } catch (error) {
      alert("Apple Pay Error: " + error.message);
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
          className="bg-black text-white mx-auto mt-56 h-12 min-w-[100px] px-6 rounded-md flex items-center justify-center gap-2 font-[-apple-system,system-ui,BlinkMacSystemFont,sans-serif] text-sm font-medium cursor-pointer antialiased hover:bg-black/90 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-9 h-9 fill-current"
            id="apple-pay"
          >
            <path d="M3.204 8.854c.45.038.9-.228 1.182-.567V8.286C4.663 7.94 4.846 7.472 4.801 7 4.4 7.019 3.909 7.266 3.628 7.613 3.368 7.909 3.147 8.397 3.204 8.854zM2.09 15.046c.498-.019.694-.327 1.294-.327.604 0 .78.327 1.305.32.544-.011.885-.494 1.218-.99.378-.563.536-1.108.544-1.138-.011-.011-1.05-.415-1.062-1.633-.011-1.02.822-1.504.858-1.534-.469-.708-1.2-.784-1.455-.803l.002.001C4.141 8.903 3.583 9.318 3.275 9.318c-.315 0-.787-.358-1.305-.347C1.3 8.983.677 9.368.336 9.98c-.705 1.229-.184 3.045.498 4.046C1.168 14.52 1.565 15.065 2.09 15.046zM14.25 11.187h1.024c.086-.457.502-.758 1.073-.758.694 0 1.084.327 1.084.932v.411l-1.417.088c-1.316.08-2.029.628-2.029 1.579.004.959.738 1.598 1.792 1.599.713 0 1.373-.365 1.672-.947h.022v.891h1.05V11.29c0-1.069-.844-1.762-2.141-1.762C15.176 9.528 14.285 10.227 14.25 11.187zM17.435 12.973c0 .693-.582 1.187-1.35 1.187-.604 0-.99-.297-.99-.746 0-.469.371-.738 1.08-.78l1.26-.08V12.973zM8.558 7.563v7.418h1.136v-2.535h1.571c1.436 0 2.441-1.001 2.441-2.447s-.989-2.436-2.404-2.436H8.558zM12.552 10.003c0 .936-.562 1.477-1.553 1.477H9.694V8.534h1.309C11.989 8.534 12.552 9.066 12.552 10.003z"></path>
            <polygon points="15.777 15.038 15.777 15.038 15.776 15.038"></polygon>
            <path d="M21.487,13.98L20.152,9.6h-1.185l1.92,5.401l-0.105,0.327c-0.173,0.555-0.454,0.773-0.956,0.773c-0.09,0-0.262-0.011-0.334-0.019v0.891C19.56,16.989,19.842,17,19.928,17l-0.001-0.002c1.106,0,1.627-0.43,2.082-1.728L24,9.6h-1.155L21.51,13.98H21.487z"></path>
          </svg>
        </button>
      ) : (
        ""
      )}
    </div>
  );
};

export default ApplePayButton;
