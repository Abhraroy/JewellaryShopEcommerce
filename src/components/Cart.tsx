"use client";

import { useStore } from "@/zustandStore/zustandStore";
import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { addToDbCart, addToLocalCart, decreaseQuantityFromDbCart, decreaseQuantityFromLocalCart, getCartData, removeFromDbCart, removeFromLocalCart } from "@/utilityFunctions/CartFunctions";
import CartItem from "./CartItem";

interface CartProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Cart({ isOpen = false, onClose }: CartProps) {
  const { AuthenticatedState, cartItems, setCartItems ,CartId,setInitiatingCheckout,initiatingCheckout } = useStore();
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);
  // Sample cart items for UI demonstration
  const supabase = createClient();
  console.log("Initializing supabase",supabase)

  const calculateSubTotal = (items: any) => {
    if (!Array.isArray(items) || items.length === 0) return 0;
    return items.reduce((sum: number, item: any) => {
      const product = item?.products ?? item?.product ?? item;
      const price = Number(product?.final_price ?? product?.price ?? 0);
      const quantity = Number(item?.quantity ?? 1);
      return sum + price * quantity;
    }, 0);
  };

  const handleDecreaseQuantity = async(product:any)=>{
    if(AuthenticatedState){
       const updatedItem = await decreaseQuantityFromDbCart(product,CartId,supabase)
       console.log("updatedItem",updatedItem)
        setCartItems(updatedItem);
    }
    else{
      const updatedItem = await decreaseQuantityFromLocalCart(product)
      setCartItems(updatedItem);
    }
  }

  const handleRemoveItem = async(product:any)=>{
    if(AuthenticatedState){
      const updatedItem = await removeFromDbCart(product,CartId,supabase)
      setCartItems(updatedItem);
    }
    else{
      const updatedItem = await removeFromLocalCart(product)
      setCartItems(updatedItem);
    }
  }
  
  const handleIncreaseQuantity = async(product:any)=>{
    if(AuthenticatedState){
      console.log("Adding to db cart")
      console.log("product",product.product_id)
      console.log("CartId",CartId)
      console.log("supabase",supabase)
      const updatedItem = await addToDbCart(product,CartId,supabase)
      setCartItems(updatedItem);
    }
    else{
      console.log("User is not authenticated adding to local cart")
      const updatedItem = addToLocalCart(product.products)
      setCartItems(updatedItem);
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
      setLoading(true);
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
        setLoading(false);
      } else if (AuthenticatedState) {
    
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
          setLoading(false);
      }else{
        console.log("No cart found")
        setLoading(false);
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
        className={`fixed top-0 right-0 h-full w-full max-w-full sm:w-96 md:w-[420px] lg:w-[480px] bg-[#FDACAC] text-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Cart Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b border-white/20 bg-[#FDACAC] sticky top-0 z-10">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
              Shopping Cart
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-white hover:text-[#FFCDC9] hover:bg-[#FD7979] rounded-full transition-colors duration-200"
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
          <div className="flex-1 overflow-y-auto py-3 sm:py-4 px-3 sm:px-4 md:px-6">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 sm:gap-4 bg-white/10 rounded-lg p-3 sm:p-4 animate-pulse"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-white/20 rounded w-3/4" />
                      <div className="h-3 bg-white/20 rounded w-1/2" />
                      <div className="h-3 bg-white/20 rounded w-1/3" />
                    </div>
                    <div className="w-12 h-10 bg-white/20 rounded" />
                  </div>
                ))}
              </div>
            ) : cartItems && cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-8 sm:py-12 px-4 text-white">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#FFCDC9] rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="#7A1C1C"
                    className="w-10 h-10 sm:w-12 sm:h-12"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.4 2.924-6.375a48.567 48.567 0 0 0-8.563-4.137M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                    />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                  Your cart is empty
                </h3>
                <p className="text-white/80 text-xs sm:text-sm mb-4 sm:mb-6">
                  Looks like you haven't added anything to your cart yet.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 sm:px-6 py-2 sm:py-2.5 bg-[#FFCDC9] text-[#7A1C1C] font-medium rounded-lg hover:bg-[#FD7979] transition-colors duration-200 text-sm sm:text-base"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {cartItems &&
                  cartItems.map((item: any) => {
                    // Use stable unique key - cart_item_id for DB items, product_id for local items
                    const product = item?.products ?? item?.product ?? item;
                    const uniqueKey =
                      item.cart_item_id ||
                      product?.product_id ||
                      item.product_id ||
                      `cart-item-${product?.product_id || "unknown"}`;

                    return (
                      <CartItem
                        key={uniqueKey}
                        item={item}
                        onDecrease={handleDecreaseQuantity}
                        onIncrease={handleIncreaseQuantity}
                        onRemove={handleRemoveItem}
                      />
                    );
                  })}
              </div>
            )}
          </div>

          {/* Cart Footer - Summary & Checkout */}
          {cartItems && cartItems.length > 0 && (
            <div className="border-t border-white/20 bg-[#FFCDC9] text-[#7A1C1C] p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 sticky bottom-0">
              {/* Price Summary */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-[#7A1C1C]/80">Subtotal</span>
                  <span className="font-medium text-[#7A1C1C]">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-[#7A1C1C]/80">Shipping</span>
                  <span className="font-medium text-base sm:text-lg text-[#7A1C1C]">
                    <span className="font-medium text-[#B03030] line-through text-xs sm:text-sm mr-2">
                      ₹70
                    </span>
                    Free
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-2 sm:pt-3">
                  <div className="flex justify-between">
                    <span className="text-sm sm:text-base font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-lg sm:text-xl font-bold text-[#7A1C1C]">
                      ₹{subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button 
                className="w-full bg-[#FFCDC9] text-[#7A1C1C] font-semibold py-2.5 sm:py-3 md:py-3.5 px-4 sm:px-6 rounded-xl hover:bg-[#FD7979] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg text-sm sm:text-base"
                onClick={()=>{
                  setInitiatingCheckout(true);
                  onClose?.(); // Close the cart sidebar
                }}
                disabled={initiatingCheckout}
              >
                {initiatingCheckout ? "Proceeding to checkout..." : "Proceed to Checkout"}
              </button>

              {/* Continue Shopping Link */}
              <button
                onClick={onClose}
                className="w-full text-center text-xs sm:text-sm text-[#7A1C1C] hover:text-[#B03030] font-medium transition-colors duration-200"
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
