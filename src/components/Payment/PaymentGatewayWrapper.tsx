"use client";

import { useStore } from "@/zustandStore/zustandStore";
import PaymentGatewayComponent from "@/components/Payment/PaymentGatewayComponent";
import PaymentStatusShowComponent from "@/components/Payment/PaymentStatusShowComponent";

export default function PaymentGatewayWrapper() {
  const { initiatingCheckout, showPaymentConcluded } = useStore();

  return (
    <>
      {initiatingCheckout && <PaymentGatewayComponent />}
      {showPaymentConcluded && <PaymentStatusShowComponent />}
    </>
  );
}

