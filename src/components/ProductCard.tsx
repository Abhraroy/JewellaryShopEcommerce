"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/zustandStore/zustandStore";
import { addToDbCart, addToLocalCart } from "@/utilityFunctions/CartFunctions";
import { createClient } from "@/app/utils/supabase/client";


export interface Product {
  product_id: string;
  title: string;
  imageUrl: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  slug?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  onWishlistToggle?: (productId: string) => void;
  isWishlisted?: boolean;
  size?: 'small' | 'default';
}

export default function ProductCard({
  product,
  onAddToCart,
  onWishlistToggle,
  isWishlisted = false,
  size = 'default',
}: ProductCardProps) {
  const [isWishlistActive, setIsWishlistActive] = useState(isWishlisted);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isCartClicked, setIsCartClicked] = useState(false);
  const { cartItems, setCartItems,AuthenticatedState,AuthUserId,CartId } = useStore();
  const supabase = createClient();
  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlistActive(!isWishlistActive);
    onWishlistToggle?.(product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCartClicked(true);
    onAddToCart?.(product.id);
    if(AuthenticatedState){
      addToDbCart(product,AuthUserId,CartId,supabase)
    }
    else{
      addToLocalCart(product)
    }
    // Reset animation after it completes
    setTimeout(() => {
      setIsCartClicked(false);
    }, 500);
  };

  const discountPercentage =
    product.originalPrice && product.discount
      ? product.discount
      : product.originalPrice
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : 0;

  const CardContent = (
    <div
      className="group relative bg-white rounded-2xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col h-full transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Gradient Overlay */}
      <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {!imageError ? (
          <>
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className={`object-cover transition-all duration-700 ${
                isHovered ? "scale-110 brightness-105" : "scale-100"
              }`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onError={() => setImageError(true)}
            />
            {/* Gradient Overlay on Hover */}
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/0 via-black/0 to-black/0 transition-all duration-500 ${
                isHovered ? "via-black/5 to-black/10" : ""
              }`}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <svg
              className="w-20 h-20 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Discount Badge - Redesigned */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg transform transition-all duration-300 hover:scale-110">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {discountPercentage}% OFF
            </span>
          </div>
        )}

        {/* Wishlist Button - Enhanced */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 p-2.5 bg-white/95 backdrop-blur-sm hover:bg-white rounded-full shadow-lg z-10"
          aria-label={
            isWishlistActive ? "Remove from wishlist" : "Add to wishlist"
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={isWishlistActive ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className={`w-5 h-5 ${
              isWishlistActive ? "text-red-500 fill-red-500" : "text-gray-700"
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>

        {/* Quick View Overlay - Appears on Hover */}
        <div
          className={`absolute inset-0 bg-black/0 flex items-center justify-center transition-all duration-300 ${
            isHovered ? "bg-black/5 opacity-100" : "opacity-0"
          }`}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className={`transform transition-all duration-300 ${
              isHovered
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            } bg-white/95 backdrop-blur-sm text-gray-900 px-6 py-2.5 rounded-full font-medium text-sm shadow-xl hover:bg-white`}
          >
            Quick View
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 md:p-5 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-sm md:text-base font-semibold text-gray-900 line-clamp-2 mb-3 min-h-[2.5rem] md:min-h-[3rem] leading-snug group-hover:text-gray-700 transition-colors duration-300">
          {product.title}
        </h3>

        {/* Price Section - Enhanced */}
        <div className="mt-auto pt-3 border-t border-gray-100">
          <div className={`flex gap-2 ${size === 'small' ? 'mb-3 flex-wrap md:flex-nowrap items-baseline md:items-baseline' : 'mb-4 items-baseline'}`}>
            <div className="flex items-baseline gap-2">
              <span className={`font-bold text-gray-900 tracking-tight ${
                size === 'small' 
                  ? 'text-base md:text-lg' 
                  : 'text-xl md:text-2xl'
              }`}>
                ₹{product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className={`text-gray-400 line-through font-medium ${
                  size === 'small' 
                    ? 'text-xs md:text-sm' 
                    : 'text-sm md:text-base'
                }`}>
                  ₹{product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className={`font-semibold text-green-600 bg-green-50 rounded ${
                size === 'small' 
                  ? 'text-[10px] md:text-xs px-1.5 py-0.5 w-full md:w-auto' 
                  : 'text-xs md:text-sm px-2 py-0.5'
              }`}>
                Save ₹{(product.originalPrice - product.price).toFixed(2)}
              </span>
            )}
          </div>

          {/* Action Button - Redesigned */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-white text-gray-900 font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:shadow-[0_1px_3px_0_rgba(0,0,0,0.08)] transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group/btn"
          >
            <span className="transition-transform duration-300 group-hover/btn:translate-x-0.5 underline"
            
            >
              Add to Cart 
            </span>
            <svg
              className={`w-5 h-5 transition-transform duration-300 origin-center ${
                isCartClicked ? "rotate-90" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  if (product.slug) {
    return (
      <Link href={`/product/${product.slug}`} className="block h-full">
        {CardContent}
      </Link>
    );
  }

  return CardContent;
}
