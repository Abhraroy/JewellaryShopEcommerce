"use client";
import Navbar from "@/components/Navbar";
import Carousel from "@/components/Carousel";
import CategorySection from "@/components/CategorySection";
import ProductCarousel from "@/components/ProductCarousel";
import BentoGrid from "@/components/BentoGrid";
import Image from "next/image";
import Footer from "@/components/Footer";
import { useStore } from "@/zustandStore/zustandStore";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import OtpInput from "@/components/OtpInput";
import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import Cart from "@/components/Cart";
import { addToDbCart, createCart } from "@/utilityFunctions/CartFunctions";
import { Product } from "@/utilityFunctions/TypeInterface";
import PaymentGatewayComponent from "@/components/PaymentGatewayComponent";
import PaymentStatusShowComponent from "@/components/PaymentStatusShowComponent";
import Collection from "@/components/Collection";
import Link from "next/link";

export default function LandingPage() {
  const {
    MobnoInputState,
    OtpInputState,
    setMobnoInputState,
    setAuthenticatedState,
    AuthenticatedState,
    setAuthUserId,
    setCartId,
    setCartItems,
    CartId,
    setCategories,
    categories,
    initiatingCheckout,
    setInitiatingCheckout,
    paymentConcluded,
    setPaymentConcluded,
    showPaymentConcluded,
    setShowPaymentConcluded,
  } = useStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const supabase = createClient();
  // Create multiple slides with the same image
  const carouselItems = Array.from({ length: 3 }, (_, index) => (
    <div
      key={index}
      className="w-full h-[400px] md:h-[500px] lg:h-[600px] relative"
    >
      <Image
        src="https://battulaaljewels.com/website/images/product-banner.webp"
        alt={`Jewelry Banner ${index + 1}`}
        fill
        className="object-cover"
        priority={index === 0}
      />
    </div>
  ));

  const handleAddToCart = (productId: string) => {
    console.log("Add to cart:", productId);
    // Implement your add to cart logic here
  };

  const handleWishlistToggle = (productId: string) => {
    console.log("Wishlist toggle:", productId);
    // Implement your wishlist logic here
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log("user", user);
      if (user) {
        setAuthenticatedState(true);

        const userData: any = await supabase
          .from("users")
          .select("*")
          .eq("phone_number", "+" + user.phone)
          .single();
        console.log("userData", userData);
        if (userData.data) {
          setAuthUserId(userData.data?.user_id);
          const { data, error } = await supabase
            .from("cart")
            .select("*")
            .eq("user_id", userData.data?.user_id)
            .maybeSingle();
          if (data) {
            console.log("Setting CartId", data?.cart_id);
            setCartId(data?.cart_id);
            const localCartItems = localStorage.getItem("cartItems");
            if (localCartItems) {
              let localCartItemsArray = localCartItems
                ? JSON.parse(localCartItems)
                : [];
              if (localCartItemsArray.length > 0) {
                console.log(
                  "After authentication cart items from local storage",
                  localCartItemsArray
                );
                for (const item of localCartItemsArray) {
                  console.log(
                    "Adding to db cart from local storage",
                    item.products
                  );
                  console.log("CartId", data?.cart_id);
                  console.log("supabase", supabase);
                  const updatedItem = await addToDbCart(
                    item.products,
                    data?.cart_id,
                    supabase
                  );
                  setCartItems(updatedItem);
                }
              } else {
                console.log("No cart items from local storage");
              }
            } else {
              console.log("No cart items from local storage");
            }
            localStorage.removeItem("cartItems");
          } else {
            const { success, data, error } = await createCart(
              userData.data?.user_id,
              supabase
            );
            if (success) {
              setCartId(data?.cart_id);
              const localCartItems = localStorage.getItem("cartItems");
              let localCartItemsArray = localCartItems
                ? JSON.parse(localCartItems)
                : [];
              if (localCartItemsArray.length > 0) {
                console.log(
                  "After authentication cart items from local storage",
                  localCartItemsArray
                );
                for (const item of localCartItemsArray) {
                  console.log(
                    "Adding to db cart from local storage",
                    item.products
                  );
                  console.log("CartId", data?.cart_id);
                  console.log("supabase", supabase);
                  const updatedItem = await addToDbCart(
                    item.products,
                    data?.cart_id,
                    supabase
                  );
                  setCartItems(updatedItem);
                }
              } else {
                console.log("No cart items from local storage");
              }
            } else {
              console.log("error", error);
            }
            localStorage.removeItem("cartItems");
          }
          console.log("User data", userData.data);
        }
        console.log("User is authenticated");
      } else {
        setAuthenticatedState(false);
        console.log("User is not authenticated");
      }
    };
    checkAuthentication();
  }, [AuthenticatedState]);

  useEffect(() => {
    const getBestSellers = async () => {
      const supabase = createClient();
      const { data, error }: any = await supabase.from("products")
      .select("*")
      .contains("tags",["best-sellers"]);
      if (error) {
        console.log("error", error);
      } else {
        console.log("data", data);
        setBestSellers(data);
      }
    };
    getBestSellers();
    const getNewArrivals = async () => {
      const { data, error }: any = await supabase.from("products")
      .select("*")
      .contains("tags",["new-arrivals"]);
      if (error) {
        console.log("error", error);
      } else {
        console.log("data", data);
        setNewArrivals(data);
      }
    };
    getNewArrivals();
    
  }, []);

  useEffect(() => {
    const getAllCategories = async () => {
      const { data, error } = await supabase.from("categories").select("*");
      if (error) {
        console.log("error", error);
      } else {
        console.log("data", data);
        setCategories(data);
      }
    };
    getAllCategories();
  }, []);

  // Handler to open the cart
  const handleOpenCart = () => {
    setIsCartOpen(true);
  };

  // Handler to close the cart
  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  return (
    <div className="min-h-screen bg-theme-cream">
      {/* Navbar with cart click handler */}
      {/* <Navbar cartCount={0} onCartClick={handleOpenCart} />
      {MobnoInputState && !OtpInputState && <PhoneNumberInput />}
      {OtpInputState && !MobnoInputState && <OtpInput />} */}

      {/* Cart Component - receives isOpen state and onClose handler */}
      {isCartOpen && <Cart isOpen={isCartOpen} onClose={handleCloseCart} />}
      <main className="w-full">
        <Carousel
          items={carouselItems}
          autoSlideInterval={3000}
          className="h-[400px] md:h-[500px] lg:h-[600px]"
        />
        {categories.length > 0 && <CategorySection categories={categories} />}

        {/* New Arrival Products Section */}
        <ProductCarousel
          sectionHeading="Best Sellers"
          products={bestSellers}
          onAddToCart={handleAddToCart}
          onWishlistToggle={handleWishlistToggle}
        />

        {/* Bento Grid Category Section */}
        <Collection />

        {/* You can add more ProductCarousel sections with different data */}
        <ProductCarousel
          sectionHeading="New Arrivals"
          products={newArrivals}
          onAddToCart={handleAddToCart}
          onWishlistToggle={handleWishlistToggle}
        />

        {/* Occasion Selection Section */}
        <section className="w-full py-12 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Shop by Occasion
              </h2>
              <p className="text-gray-600 text-lg">
                Find the perfect jewelry for every special moment
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Everyday Wear Card */}
              <Link
                href="/occasion/everydaywear"
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-50 to-rose-100 hover:from-pink-100 hover:to-rose-200 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <div className="p-8 md:p-10 h-full flex flex-col items-center text-center">
                  <div className="mb-6 w-20 h-20 md:w-24 md:h-24 bg-white/80 rounded-full flex items-center justify-center group-hover:bg-white transition-colors duration-300 group-hover:rotate-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-10 h-10 md:w-12 md:h-12 text-rose-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    Everyday Wear
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Elegant pieces for your daily style
                  </p>
                  <span className="inline-flex items-center text-rose-600 font-semibold group-hover:text-rose-700 transition-colors">
                    Explore
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </span>
                </div>
              </Link>

              {/* Party Wear Card */}
              <Link
                href="/occasion/partywear"
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-pink-100 hover:from-purple-100 hover:to-pink-200 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <div className="p-8 md:p-10 h-full flex flex-col items-center text-center">
                  <div className="mb-6 w-20 h-20 md:w-24 md:h-24 bg-white/80 rounded-full flex items-center justify-center group-hover:bg-white transition-colors duration-300 group-hover:rotate-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-10 h-10 md:w-12 md:h-12 text-purple-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    Party Wear
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Stunning pieces to make you shine
                  </p>
                  <span className="inline-flex items-center text-purple-600 font-semibold group-hover:text-purple-700 transition-colors">
                    Explore
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </span>
                </div>
              </Link>

              {/* Wedding Card */}
              <Link
                href="/occasion/wedding"
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-100 hover:from-amber-100 hover:to-yellow-200 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <div className="p-8 md:p-10 h-full flex flex-col items-center text-center">
                  <div className="mb-6 w-20 h-20 md:w-24 md:h-24 bg-white/80 rounded-full flex items-center justify-center group-hover:bg-white transition-colors duration-300 group-hover:rotate-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-10 h-10 md:w-12 md:h-12 text-amber-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    Wedding
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Timeless elegance for your special day
                  </p>
                  <span className="inline-flex items-center text-amber-600 font-semibold group-hover:text-amber-700 transition-colors">
                    Explore
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>
        {initiatingCheckout && <PaymentGatewayComponent />}
        {showPaymentConcluded && <PaymentStatusShowComponent />}
      </main>
    </div>
  );
}
