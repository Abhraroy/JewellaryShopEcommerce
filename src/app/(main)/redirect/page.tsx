 "use client";

import Link from "next/link";
import { useEffect,useState } from "react";
import axios from "axios";
import { createClient } from "@/app/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useStore } from "@/zustandStore/zustandStore";

export default function RedirectPage() {
  const [status, setStatus] = useState("pending");
  const {
    initiatingCheckout,
    setInitiatingCheckout,
    setPaymentConcluded,
    setShowPaymentConcluded
  } = useStore();
  const router = useRouter();
  useEffect(() => {
    const merchantOrderId = localStorage.getItem("merchantOrderId");
    if(!merchantOrderId) {
      return;
    }
    const checkOrderStatus = async () => {
        const res = await axios.get(`/api/payment/confirm?merchantOrderId=${merchantOrderId}`)
        console.log('res', res)
        if(res.data.orderStatusResponse.state === "COMPLETED"){
          setStatus("completed");
          setPaymentConcluded(true);
          setShowPaymentConcluded(true);
          setInitiatingCheckout(false);
          router.push("/");
        }else if(res.data.orderStatusResponse.state === "FAILED"){
          setStatus("failed");
          setPaymentConcluded(false);
          setShowPaymentConcluded(true);
          setInitiatingCheckout(false);
          router.push("/");
        }
        if(res.data.orderStatusResponse.state === "PENDING"){
          setTimeout(() => {
            checkOrderStatus();
          }, 1000);
        }
    }
    checkOrderStatus();
    
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-xl border border-gray-100 p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Payment Confirmation
          </h1>
          <span className="px-3 py-1 text-xs sm:text-sm font-medium rounded-full border bg-gray-100 text-gray-800 border-gray-200">
            Pending
          </span>
        </div>

        <p className="mt-3 text-gray-600 text-sm sm:text-base">
          Thank you for completing the payment flow. You can return to the app
          or continue shopping.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            href="/(main)/orders"
            className="flex-1 inline-flex items-center justify-center rounded-lg bg-gray-900 text-white px-4 py-2.5 text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            View Orders
          </Link>
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center rounded-lg border border-gray-300 text-gray-800 px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
