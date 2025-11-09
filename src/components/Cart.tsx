"use client";

import Image from "next/image";
import { useStore } from "@/zustandStore/zustandStore";
import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { addToLocalCart, decreaseQuantityFromLocalCart, getCartData, removeFromLocalCart } from "@/utilityFunctions/CartFunctions";

interface CartProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Cart({ isOpen = false, onClose }: CartProps) {
  const { AuthenticatedState, cartItems, setCartItems , setCartId,CartId } = useStore();
  const [subtotal, setSubtotal] = useState(0);
  // Sample cart items for UI demonstration
  const supabase = createClient();

  if (cartItems && cartItems.length > 0) {
    const subtotal = cartItems.reduce(
      (sum: number, item: any) =>  sum + item.products.final_price * item.quantity,0
  
    );
    console.log("subtotal",subtotal)
    const shipping: number = 0;
    const total = subtotal + shipping;
  }


  const calculateSubTotal = (cartItems:any)=>{
    if(cartItems.length === 0){
      return 0;
    }
    else{
      return cartItems.reduce((sum: number, item: any) => sum + item.products.final_price * item.quantity, 0);
    }
  }

  useEffect(() => {
    if(cartItems){
      setSubtotal(calculateSubTotal(cartItems));
    }
    else{
      setSubtotal(0);
    }
  }, [cartItems]);

  useEffect(() => {
    const getCartItems = async () => {



      if (!AuthenticatedState) {
        const localCartItems = localStorage.getItem("cartItems");
        console.log("cart items from local storage", localCartItems);
        if (cartItems) {
          const tempCartItems = localCartItems
            ? JSON.parse(localCartItems)
            : [];
          console.log("tempCartItems", typeof tempCartItems);
          setCartItems(tempCartItems);
        }
      } else if (AuthenticatedState) {
        // let user_id:any;
        // const getuserdetails = async () => {
        //   const { data, error } = await supabase.auth.getUser();
        //   if (error) {
        //     console.log("error", error);
        //   }
        //   if (data) {
        //     console.log("data from cart", data.user?.phone);
        //     const user_data = await supabase
        //       .from("users")
        //       .select("*")
        //       .eq("phone_number", "+" + data?.user?.phone)
        //       .maybeSingle();
        //     console.log("user_data from cart", user_data);
        //     return user_data.data?.user_id;
        //   }
        // };
        // user_id = await getuserdetails();
        // console.log("user_id 2nd from cart", user_id);
    
        if(CartId){
          console.log("cart found",CartId)
          const {success,data,message} = await getCartData(CartId,supabase)
          if(success){
            console.log("data from cart",data)
            setCartItems(data)
          }
          else{
            console.log("error",message)
          }
      }else{
        console.log("No cart found")
      }
    };
}
    getCartItems()
  }, [AuthenticatedState]);

  useEffect(() => {
    console.log("cart items from cart", cartItems);
  }, [cartItems]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Cart Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 md:w-[420px] lg:w-[480px] bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Cart Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Shopping Cart
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200"
              aria-label="Close cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-4 px-4 sm:px-6">
            {cartItems && cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-12 h-12 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.4 2.924-6.375a48.567 48.567 0 0 0-8.563-4.137M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  Looks like you haven't added anything to your cart yet.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems &&
                  cartItems.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                    >
                      {/* Product Image */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-white rounded-lg overflow-hidden border border-gray-200">
                        <Image
                          src={item.products.thumbnail_image}
                          alt={item.products.product_name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 80px, 96px"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                          {item.products.product_name}
                        </h3>
                        <p className="text-lg font-bold text-gray-900 mb-3">
                          ₹{item.products.final_price}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 border border-gray-300 rounded-lg bg-white">
                            <button
                              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors duration-200"
                              aria-label="Decrease quantity"
                              onClick={() => {
                                const updatedItem = decreaseQuantityFromLocalCart(item);
                                setCartItems(updatedItem);
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2.5}
                                stroke="currentColor"
                                className="w-4 h-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19.5 12h-15"
                                />
                              </svg>
                            </button>
                            <span className="px-3 py-1 text-sm font-medium text-gray-900 min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors duration-200"
                              aria-label="Increase quantity"
                              onClick={() => {
                                const updatedItem =  addToLocalCart(item);
                                setCartItems(updatedItem);
                                setSubtotal(calculateSubTotal(updatedItem));
                              }
                            }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2.5}
                                stroke="currentColor"
                                className="w-4 h-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 4.5v15m7.5-7.5h-15"
                                />
                              </svg>
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors duration-200"
                            aria-label="Remove item"
                            onClick={() => {
                              const updatedItem = removeFromLocalCart(item);
                              setCartItems(updatedItem);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Cart Footer - Summary & Checkout */}
          {cartItems && cartItems.length > 0 && (
            <div className="border-t border-gray-200 bg-white p-4 sm:p-6 space-y-4 sticky bottom-0">
              {/* Price Summary */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>

                  <span className="font-medium text-lg text-gray-900">
                  <span className="font-medium text-red-900 line-through text-sm mr-2 ">
                    ₹70
                  </span>
                    Free
                  </span>
                  
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-base font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-xl font-bold text-gray-900">
                    ₹{subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button className="w-full bg-gray-900 text-white font-semibold py-3.5 px-6 rounded-xl hover:bg-gray-800 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg">
                Proceed to Checkout
              </button>

              {/* Continue Shopping Link */}
              <button
                onClick={onClose}
                className="w-full text-center text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
