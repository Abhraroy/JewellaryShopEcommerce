"use client";
import { useStore } from "@/zustandStore/zustandStore";
import { useEffect } from "react";

export default function PaymentStatusShowComponent() {
    const {paymentConcluded, showPaymentConcluded, setShowPaymentConcluded} = useStore();

    // Auto-hide after 5 seconds for success, 8 seconds for error
    useEffect(() => {
        if (showPaymentConcluded) {
            const timer = setTimeout(() => {
                setShowPaymentConcluded(false);
            }, paymentConcluded ? 5000 : 8000);
            return () => clearTimeout(timer);
        }
    }, [showPaymentConcluded, paymentConcluded, setShowPaymentConcluded]);

    if (!showPaymentConcluded) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className={`relative w-full max-w-md transform transition-all duration-300 ${
                paymentConcluded ? 'animate-scaleIn' : 'animate-scaleIn'
            }`}>
                {/* Close Button */}
                <button
                    onClick={() => setShowPaymentConcluded(false)}
                    className="absolute -top-2 -right-2 z-10 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors duration-200 group"
                    aria-label="Close"
                >
                    <svg
                        className="w-5 h-5 text-gray-600 group-hover:text-gray-800"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                {/* Success Card */}
                {paymentConcluded ? (
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-green-100">
                        {/* Animated Background Gradient */}
                        <div className="h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 animate-shimmer"></div>
                        
                        <div className="p-8 text-center">
                            {/* Success Icon */}
                            <div className="mb-6 flex justify-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
                                    <div className="relative w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                                        <svg
                                            className="w-12 h-12 text-white animate-checkmark"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={3}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Success Message */}
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 animate-fadeInUp">
                                Order Placed Successfully!
                            </h2>
                            <p className="text-gray-600 text-base md:text-lg mb-6 animate-fadeInUp animation-delay-100">
                                Thank you for shopping with us. Your order has been confirmed and you'll receive a confirmation email shortly.
                            </p>

                            {/* Action Button */}
                            <button
                                onClick={() => setShowPaymentConcluded(false)}
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Error Card */
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-red-100">
                        {/* Animated Background Gradient */}
                        <div className="h-2 bg-gradient-to-r from-red-400 via-rose-500 to-red-600 animate-shimmer"></div>
                        
                        <div className="p-8 text-center">
                            {/* Error Icon */}
                            <div className="mb-6 flex justify-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-red-100 rounded-full animate-pulse opacity-75"></div>
                                    <div className="relative w-20 h-20 bg-gradient-to-br from-red-400 to-rose-600 rounded-full flex items-center justify-center shadow-lg">
                                        <svg
                                            className="w-12 h-12 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={3}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Error Message */}
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 animate-fadeInUp">
                                Payment Failed
                            </h2>
                            <p className="text-gray-600 text-base md:text-lg mb-4 animate-fadeInUp animation-delay-100">
                                Oops! Something went wrong and your order could not be placed.
                            </p>
                            <p className="text-gray-700 text-sm md:text-base mb-6 font-medium animate-fadeInUp animation-delay-200">
                                Please reach out to our support team for assistance.
                            </p>

                            {/* Contact Info */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-6 animate-fadeInUp animation-delay-300">
                                <p className="text-sm text-gray-500 mb-1">Contact Support</p>
                                <a
                                    href="tel:+1234567890"
                                    className="text-lg font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                                >
                                    +1 (234) 567-890
                                </a>
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={() => setShowPaymentConcluded(false)}
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-rose-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}