import PhonePe from "./PhonePe";
import axios from "axios";
import { getAuthToken } from "@/app/utils/Phonepe";
import { useState, useEffect } from "react";
import { useStore } from "@/zustandStore/zustandStore";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import PhoneNumberInput from "./PhoneNumberInput";
import OtpInput from "./OtpInput";
import AddressForm from "./AddressForm";
import { createClient } from "@/app/utils/supabase/client";

export default function PaymentGatewayComponent() {
  const [transacToken, setTransacToken] = useState<string | null>(null);
  const { setInitiatingCheckout, cartItems, AuthenticatedState, AuthUserId } = useStore();
  const [showPhoneNumberInput, setShowPhoneNumberInput] = useState(true);
  const [showOrderdetails, setShowOrderdetails] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const supabase = createClient();

  // Fetch addresses when authenticated
  useEffect(() => {
    const fetchAddresses = async () => {
      if (AuthenticatedState && AuthUserId) {
        setLoadingAddresses(true);
        try {
          const { data, error } = await supabase
            .from("addresses")
            .select("*")
            .eq("user_id", AuthUserId)
            .order("is_default", { ascending: false });

          if (error) {
            console.error("Error fetching addresses:", error);
          } else {
            setAddresses(data || []);
            // Auto-select default address if available
            const defaultAddress = data?.find((addr) => addr.is_default);
            if (defaultAddress) {
              setSelectedAddress(defaultAddress.address_id);
            } else if (data && data.length > 0) {
              setSelectedAddress(data[0].address_id);
            }
          }
        } catch (err) {
          console.error("Error fetching addresses:", err);
        } finally {
          setLoadingAddresses(false);
        }
      }
    };
    fetchAddresses();
  }, [AuthenticatedState, AuthUserId]);

  const getAuthToken = async () => {
    const res = await axios.post("/api/payment/auth", {
      address_id: selectedAddress,
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("res", res);
    setTransacToken(res.data.data.redirectUrl);
  };

  const handleAddressSuccess = () => {
    setShowAddressForm(false);
    // Refresh addresses
    if (AuthenticatedState && AuthUserId) {
      supabase
        .from("addresses")
        .select("*")
        .eq("user_id", AuthUserId)
        .order("is_default", { ascending: false })
        .then(({ data, error }) => {
          if (!error && data) {
            setAddresses(data);
            if (data.length > 0 && !selectedAddress) {
              const defaultAddress = data.find((addr) => addr.is_default);
              setSelectedAddress(defaultAddress?.address_id || data[0].address_id);
            }
          }
        });
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Payment Gateway Modal */}
      <div className="fixed inset-0 sm:inset-auto sm:top-[50%] sm:left-[50%] sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2 w-full sm:w-[85vw] md:w-[75vw] lg:w-[65vw] xl:w-[55vw] 2xl:w-[45vw] sm:max-w-md h-full sm:h-[90vh] sm:max-h-[90vh] bg-white rounded-none sm:rounded-xl shadow-2xl z-[70] overflow-hidden flex flex-col ">
        {/* Header */}
        <div className="pt-4 sm:pt-5 pb-4 sm:pb-5 border-b border-amber-600/30 flex items-center justify-between gap-4 px-4 sm:px-6 bg-gradient-to-r from-amber-500 to-orange-500">
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <button
              onClick={() => setInitiatingCheckout(false)}
              className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 transition-all duration-200 hover:scale-110 active:scale-95 flex-shrink-0"
              aria-label="Go back"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">
              Payment Gateway
            </h1>
          </div>
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="w-full space-y-4">
            {/* Order Summary Card */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 p-3 shadow-sm">
              <button
                onClick={() => setShowOrderdetails(!showOrderdetails)}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-6 h-6 text-amber-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-5h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                      />
                    </svg>
                    {cartItems && cartItems.length > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                        {cartItems.reduce(
                          (sum: number, item: any) => sum + item.quantity,
                          0
                        )}
                      </span>
                    )}
                  </div>
                  <div className="text-left">
                    <span className="text-gray-900 text-sm font-semibold block">
                      Order Summary
                    </span>
                    <span className="text-gray-600 text-xs">
                      {cartItems.reduce(
                        (sum: number, item: any) => sum + item.quantity,
                        0
                      )}{" "}
                      items • ₹
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
                  <MdOutlineKeyboardArrowUp className="text-xl text-gray-600" />
                ) : (
                  <MdOutlineKeyboardArrowDown className="text-xl text-gray-600" />
                )}
              </button>
              {showOrderdetails && (
                <div className="mt-3 pt-3 border-t border-gray-200 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-gray-900 font-medium">
                      ₹
                      {cartItems
                        .reduce(
                          (sum: number, item: any) =>
                            sum + item.products.base_price * item.quantity,
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Discount:</span>
                    <span className="text-green-600 font-medium">
                      -₹
                      {(
                        cartItems.reduce(
                          (sum: number, item: any) =>
                            sum + item.products.base_price * item.quantity,
                          0
                        ) -
                        cartItems.reduce(
                          (sum: number, item: any) =>
                            sum + item.products.final_price * item.quantity,
                          0
                        )
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-gray-200">
                    <span className="text-sm font-bold text-gray-900">Total:</span>
                    <span className="text-base font-bold text-amber-600">
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
              )}
            </div>

            {/* Authentication Section */}
            {!AuthenticatedState ? (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                {showPhoneNumberInput ? (
                  <PhoneNumberInput
                    containerClassName="w-full"
                    onClick={() => setShowPhoneNumberInput(false)}
                  />
                ) : (
                  <OtpInput
                    containerClassName="w-full"
                    onClick={() => setShowPhoneNumberInput(true)}
                  />
                )}
              </div>
            ) : (
              /* Address Selection Section */
              <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4 text-amber-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                      />
                    </svg>
                    Delivery Address
                  </h3>
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded-md transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-3.5 h-3.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                    Add New
                  </button>
                </div>

                {loadingAddresses ? (
                  <div className="flex items-center justify-center py-6">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
                  </div>
                ) : addresses.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {addresses.map((address) => (
                      <label
                        key={address.address_id}
                        className={`block p-3 rounded-md border-2 cursor-pointer transition-all ${
                          selectedAddress === address.address_id
                            ? "border-amber-500 bg-amber-50"
                            : "border-gray-200 hover:border-gray-300 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <input
                            type="radio"
                            name="address"
                            value={address.address_id}
                            checked={selectedAddress === address.address_id}
                            onChange={() => setSelectedAddress(address.address_id)}
                            className="mt-0.5 w-4 h-4 text-amber-600 focus:ring-amber-500"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="text-xs font-semibold text-gray-900 capitalize">
                                {address.address_type}
                              </span>
                              {address.is_default && (
                                <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-medium rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-700 leading-relaxed break-words">
                              {address.street_address}
                            </p>
                            <p className="text-xs text-gray-600 mt-0.5">
                              {address.city}, {address.state} - {address.postal_code}
                            </p>
                            <p className="text-xs text-gray-600">{address.country}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-10 h-10 text-gray-400 mx-auto mb-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                      />
                    </svg>
                    <p className="text-gray-600 text-xs mb-3">No addresses saved</p>
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded-md transition-colors"
                    >
                      Add Address
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer with Continue Button */}
        <div className="w-full px-4 sm:px-6 py-4 sm:py-5 border-t border-gray-200 bg-gray-50">
          {!transacToken ? (
            <button
              onClick={() => {
                getAuthToken();
              }}
              className="w-full px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all duration-200 text-sm shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              disabled={!AuthenticatedState || (AuthenticatedState && !selectedAddress && addresses.length > 0)}
            >
              {AuthenticatedState ? "Proceed to Payment" : "Login to Continue"}
            </button>
          ) : (
            <PhonePe redirectUrl={transacToken ?? ""} />
          )}
          {AuthenticatedState && !selectedAddress && addresses.length > 0 && (
            <p className="text-xs text-red-600 mt-2 text-center">
              Please select a delivery address
            </p>
          )}
        </div>
      </div>

      {/* Address Form Modal */}
      {showAddressForm && AuthUserId && (
        <AddressForm
          userId={AuthUserId}
          onClose={() => setShowAddressForm(false)}
          onSuccess={handleAddressSuccess}
        />
      )}
    </>
  );
}
