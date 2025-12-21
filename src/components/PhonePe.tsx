"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { useStore } from "@/zustandStore/zustandStore";

export default function PhonePe({ redirectUrl }: { redirectUrl: string }) {
  const [sdkReady, setSdkReady] = useState(false);
  const {initiatingCheckout,setInitiatingCheckout} = useStore();

  /** Callback handler from PhonePe */
  const callback = (response: string) => {
    console.log("PhonePe Callback Response:", response);

    if (response === "USER_CANCEL") {
      console.log("User cancelled payment");
      return;
    }
    if (response === "CONCLUDED") {
      console.log("Payment concluded");
      setInitiatingCheckout(false);
      return;
    }
  };

  /** Wait for PhonePeCheckout SDK initialization */
  const waitForSDKReady = () => {
    let tries = 0;

    const check = () => {
      const SDK = (window as any).PhonePeCheckout;

      if (SDK) {
        console.log("🔥 PhonePe SDK initialized!");
        setSdkReady(true);
        return;
      }

      tries++;
      if (tries > 40) {
        console.error("❌ PhonePe SDK failed to initialize");
        return;
      }

      setTimeout(check, 80);
    };

    check();
  };

  /** When redirectUrl or script loads */
  useEffect(() => {
    console.log("Token URL received:", redirectUrl);
  }, [redirectUrl]);

  /** It will be called when user clicks pay */
  const initiatePayment = () => {
    if (!sdkReady) {
      alert("PhonePe is still loading… please wait");
      return;
    }

    const PhonePeCheckout = (window as any).PhonePeCheckout;

    console.log("Sending tokenUrl to PhonePe:", redirectUrl);

    PhonePeCheckout.transact({
      tokenUrl: redirectUrl,
      type: "IFRAME",
      callback: callback,
    });
  };

  return (
    <>
      {/** Load PhonePe Checkout Script */}
      <Script
        src="https://mercury.phonepe.com/web/bundle/checkout.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("📦 PhonePe script loaded");
          waitForSDKReady();
        }}
      />

      <button
        disabled={!sdkReady}
        onClick={initiatePayment}
        className={`w-full px-4 py-2.5 rounded-lg text-white font-semibold transition-all duration-200 text-sm shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none ${
          sdkReady ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800" : "bg-gray-400"
        }`}
      >
        {sdkReady ? "Pay with PhonePe" : "Loading PhonePe…"}
      </button>
    </>
  );
}
