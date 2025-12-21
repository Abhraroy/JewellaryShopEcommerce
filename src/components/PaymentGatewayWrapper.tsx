"use client";

import { useStore } from "@/zustandStore/zustandStore";
import PaymentGatewayComponent from "@/components/PaymentGatewayComponent";
import PaymentStatusShowComponent from "@/components/PaymentStatusShowComponent";

export default function PaymentGatewayWrapper() {
  const { initiatingCheckout, showPaymentConcluded } = useStore();

  return (
    <>
      {initiatingCheckout && <PaymentGatewayComponent />}
      {showPaymentConcluded && <PaymentStatusShowComponent />}
    </>
  );
}

