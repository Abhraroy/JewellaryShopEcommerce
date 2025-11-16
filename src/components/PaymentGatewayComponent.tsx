import PhonePe from "./PhonePe";
import axios from "axios";
import { getAuthToken } from "@/app/utils/Phonepe";
import { useState } from "react";
import { useStore } from "@/zustandStore/zustandStore";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";

export default function PaymentGatewayComponent() {
  const [transacToken, setTransacToken] = useState<string | null>(null);
  const { setInitiatingCheckout, cartItems } = useStore();
  const [showOrderdetails, setShowOrderdetails] = useState(false);
  const getAuthToken = async () => {
    const res = await axios.post("/api/payment/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    console.log("res", res);
    setTransacToken(res.data.data.redirectUrl);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Payment Gateway Modal */}
      <div className="fixed inset-0 sm:inset-auto sm:top-[50%] sm:left-[50%] sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2 w-full sm:w-[85vw] md:w-[75vw] lg:w-[65vw] xl:w-[55vw] 2xl:w-[45vw] sm:max-w-md h-full sm:h-[90vh] sm:max-h-[90vh] bg-white rounded-none sm:rounded-xl shadow-2xl z-[70] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="pt-3 sm:pt-4 md:pt-6 pb-3 sm:pb-4 border-b border-gray-200 flex items-start justify-start gap-3 sm:gap-4 bg-amber-500">
          <button
            onClick={() => setInitiatingCheckout(false)}
            className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 flex-1">
            Payment Gateway
          </h1>
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto px-1 sm:px-2 md:px-4 py-2 sm:py-4 md:py-6">
          <div className="w-full h-full flex items-center justify-center">
            <div
              className="w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl h-full
                        flex flex-col items-start justify-start 
                        "
            >
              {/* Responsive content div */}
              <div className="flex flex-row items-center justify-around w-full border-2 border-gray-200 rounded-lg p-2  ">
                <div className="relative flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-gray-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-5h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                    />
                  </svg>
                  {cartItems && cartItems.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
                      {cartItems.reduce(
                        (sum: number, item: any) => sum + item.quantity,
                        0
                      )}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-start justify-start">
                  <span className="text-gray-900 text-sm font-medium">
                    Order Summary
                  </span>
                  <span className="text-gray-500 text-sm">Saved so far</span>
                </div>
                <div className="flex flex-col items-end justify-start">
                  <span className="text-gray-900 text-sm font-medium">
                    {cartItems.reduce(
                      (sum: number, item: any) => sum + item.quantity,
                      0
                    )}{" "}
                    items
                  </span>
                  <div className="flex flex-row">
                    <span className="text-gray-500 line-through text-sm mr-2 ">
                      ₹
                      {cartItems
                        .reduce(
                          (sum: number, item: any) =>
                            sum + item.products.base_price * item.quantity,
                          0
                        )
                        .toFixed(2)}
                    </span>
                    <span className="text-gray-900 text-sm font-medium">
                      ₹
                      {cartItems
                        .reduce(
                          (sum: number, item: any) =>
                            sum + item.products.final_price * item.quantity,
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                </div>
                {showOrderdetails ? (
                  <MdOutlineKeyboardArrowUp
                    className="text-[1.2rem] cursor-pointer"
                    onClick={() => setShowOrderdetails(false)}
                  />
                ) : (
                  <MdOutlineKeyboardArrowDown
                    className="text-[1.2rem] cursor-pointer"
                    onClick={() => setShowOrderdetails(true)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Continue Button */}
        <div className=" w-full px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-t border-gray-200 bg-gray-50 space-y-4 sm:space-y-6
        ">
            {/* Get Auth Token Button */}
            <div className="flex flex-col gap-3 sm:gap-4 w-full">
             {!transacToken ? <button
                onClick={() => {
                  getAuthToken();
                }}
                className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg sm:rounded-xl transition-colors duration-200 text-sm sm:text-base"
              >
                Continue
              </button>
              : <PhonePe redirectUrl={transacToken ?? ""} />}
            </div>
        </div>
      </div>
    </>
  );
}
