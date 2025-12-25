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
  } = useStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const supabase = createClient();

  // Model images with jewelry information
  const modelImages = [
    {
      id: 1,
      src: "https://battulaaljewels.com/website/images/product-banner.webp",
      alt: "Model wearing gold necklace set",
      jewelry: "Gold Necklace Set · Diamond Earrings · Gold Bangles",
    },
    {
      id: 2,
      src: "https://battulaaljewels.com/website/images/product-banner.webp",
      alt: "Model wearing pearl jewelry",
      jewelry: "Pearl Necklace · Pearl Earrings · Gold Chain",
    },
    {
      id: 3,
      src: "https://battulaaljewels.com/website/images/product-banner.webp",
      alt: "Model wearing bridal jewelry",
      jewelry: "Bridal Necklace Set · Kundan Earrings · Maang Tikka",
    },
    {
      id: 4,
      src: "https://battulaaljewels.com/website/images/product-banner.webp",
      alt: "Model wearing modern jewelry",
      jewelry: "Silver Pendant · Silver Chain · Silver Rings",
    },
    {
      id: 5,
      src: "https://battulaaljewels.com/website/images/product-banner.webp",
      alt: "Model wearing traditional jewelry",
      jewelry: "Traditional Gold Set · Jhumkas · Gold Bracelet",
    },
    {
      id: 6,
      src: "https://battulaaljewels.com/website/images/product-banner.webp",
      alt: "Model wearing statement jewelry",
      jewelry: "Statement Necklace · Chandelier Earrings · Armlet",
    },
    {
      id: 7,
      src: "https://battulaaljewels.com/website/images/product-banner.webp",
      alt: "Model wearing gemstone jewelry",
      jewelry: "Ruby Necklace · Emerald Earrings · Sapphire Ring",
    },
    {
      id: 8,
      src: "https://battulaaljewels.com/website/images/product-banner.webp",
      alt: "Model wearing layered chains",
      jewelry: "Layered Gold Chains · Minimal Studs · Cuff Bracelet",
    },
  ];
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
      .contains("tags",["best-sellers"])
      .eq("listed_status", true);
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
      .contains("tags",["new-arrivals"])
      .eq("listed_status", true);
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

  // Auto-play carousel (pauses on hover)
  useEffect(() => {
    if (isPaused) return;
    
    const timer = setInterval(() => {
      setCarouselIndex((prev) => {
        const next = (prev + 1) % modelImages.length;
        return next;
      });
    }, 4000); // Auto-advance every 4 seconds
    
    return () => {
      clearInterval(timer);
    };
  }, [isPaused, modelImages.length]);

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

        {/* Model Carousel Section - 3 Slides Visible */}
        <section className="w-full py-12 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                See Our Jewellery in Action
              </h2>
              <p className="text-gray-600 text-lg">
                Discover elegant pieces that complement your style. Auto-plays and pauses on hover.
              </p>
            </div>

            <div
              className="relative h-[450px] md:h-[550px] lg:h-[650px] overflow-visible"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Carousel Container */}
              <div className="relative w-full h-full flex items-center justify-center">
                <div
                  className="flex items-center justify-center relative"
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                >
                  {modelImages.map((item, idx) => {
                    // Calculate position relative to current index
                    let position = idx - carouselIndex;
                    
                    // Handle wrapping for infinite loop
                    if (position > modelImages.length / 2) {
                      position = position - modelImages.length;
                    } else if (position < -modelImages.length / 2) {
                      position = position + modelImages.length;
                    }

                    // Only show 3 slides: previous (-1), current (0), next (+1)
                    if (Math.abs(position) > 1) return null;

                    // Calculate styles based on position
                    const isCenter = position === 0;
                    const isLeft = position === -1;
                    const isRight = position === 1;

                    // Transform calculations - more spacing for better visibility
                    const translateX = position * 42; // Percentage offset (increased for better spacing)
                    // Reduced scale difference for imperceptible size change
                    const scale = isCenter ? 1 : 0.92; // Minimal scale difference for smooth transition
                    const opacity = 1; // Full opacity for all slides
                    const zIndex = isCenter ? 10 : isLeft ? 4 : 4;

                    return (
                      <div
                        key={item.id}
                        className="absolute"
                        style={{
                          left: "50%",
                          top: "50%",
                          transform: `translate(-50%, -50%) translateX(${translateX}%) scale(${scale})`,
                          transformOrigin: "center center",
                          opacity: opacity,
                          zIndex: zIndex,
                          width: "90%",
                          maxWidth: "700px",
                          height: "100%",
                          transition: "transform 1.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.4s cubic-bezier(0.16, 1, 0.3, 1)",
                          willChange: "transform, opacity",
                          pointerEvents: isCenter ? "auto" : "none",
                          backfaceVisibility: "hidden",
                          WebkitBackfaceVisibility: "hidden",
                          WebkitTransition: "transform 1.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.4s cubic-bezier(0.16, 1, 0.3, 1)",
                        }}
                      >
                        <div 
                          className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl"
                          style={{
                            transition: "box-shadow 1s ease-out",
                            transform: "translateZ(0)", // Force GPU acceleration
                          }}
                        >
                          <Image
                            src={item.src}
                            alt={item.alt}
                            fill
                            className="object-cover"
                            priority={isCenter || Math.abs(position) <= 1}
                            style={{
                              transition: "opacity 0.3s ease-out",
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                          <div className="absolute inset-0 flex items-end justify-center p-6 md:p-8 lg:p-12">
                            <div className="text-center text-white space-y-2 md:space-y-3 max-w-2xl">
                              <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-lime-300 font-semibold opacity-90">
                                Featured Collection
                              </p>
                              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-1 md:mb-2">
                                {item.alt}
                              </h3>
                              <p className="text-xs md:text-sm text-gray-200 opacity-90">
                                {item.jewelry}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Navigation arrows - positioned on far left and right */}
              <button
                type="button"
                onClick={() =>
                  setCarouselIndex((prev) =>
                    prev === 0 ? modelImages.length - 1 : prev - 1
                  )
                }
                className="absolute left-0 md:-left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/90 backdrop-blur-sm text-gray-800 shadow-xl hover:bg-white hover:shadow-2xl transition-all duration-300 z-20 flex items-center justify-center group"
                aria-label="Previous slide"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-6 h-6 md:w-7 md:h-7 group-hover:scale-110 transition-transform"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={() =>
                  setCarouselIndex((prev) => (prev + 1) % modelImages.length)
                }
                className="absolute right-0 md:-right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/90 backdrop-blur-sm text-gray-800 shadow-xl hover:bg-white hover:shadow-2xl transition-all duration-300 z-20 flex items-center justify-center group"
                aria-label="Next slide"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-6 h-6 md:w-7 md:h-7 group-hover:scale-110 transition-transform"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>

              {/* Carousel indicators */}
              <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {modelImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCarouselIndex(index)}
                    className={`h-2 rounded-full transition-all duration-500 ease-out ${
                      index === carouselIndex
                        ? "w-8 bg-white shadow-lg"
                        : "w-2 bg-white/40 hover:bg-white/60"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Social Media Bento Section */}
        <section className="w-full py-12 md:py-16 px-0">
          <div className="w-full">
            {/* Heading row */}
            <div className="flex flex-col items-center justify-center gap-3 md:gap-4 mb-8 px-4 sm:px-6 lg:px-10 text-center">
              <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.25em] text-lime-500">
                Social Gallery
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                See how our jewellery lives on social
              </h2>
              <button
                type="button"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-gray-900 text-white text-sm md:text-base font-semibold shadow-lg hover:shadow-xl hover:bg-lime-400 hover:text-black transition-all duration-200"
              >
                Follow our socials
                <span className="ml-2 text-lg leading-none">↗</span>
              </button>
            </div>

            {/* Bento grid inspired by reference image - now using images in each tile */}
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4 text-white px-2 sm:px-4 lg:px-6">
              {/* Left column cluster */}
              <div className="col-span-4 md:col-span-3 space-y-3 md:space-y-4">
                <div className="grid grid-cols-4 gap-3 md:gap-4">
                  {/* Reels card */}
                  <div className="col-span-2 relative rounded-2xl overflow-hidden">
                    <Image
                      src="https://battulaaljewels.com/website/images/product-banner.webp"
                      alt="Reels preview"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="relative z-10 p-4 flex flex-col justify-between h-full">
                      <span className="text-[11px] uppercase tracking-[0.18em] text-lime-300">
                        Reels
                      </span>
                      <p className="text-lg md:text-xl font-extrabold leading-tight mt-2">
                        No filter,
                        <br />
                        just shine.
                      </p>
                    </div>
                  </div>
                  {/* Stories card */}
                  <div className="col-span-2 relative rounded-2xl overflow-hidden">
                    <Image
                      src="https://battulaaljewels.com/website/images/product-banner.webp"
                      alt="Stories preview"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="relative z-10 p-3 md:p-4 flex flex-col justify-between h-full text-black">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] bg-white/80 px-2 py-1 rounded-full w-fit">
                        Stories
                      </span>
                      <p className="mt-1 text-xs md:text-sm font-medium text-white">
                        Daily styling tips & drops.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 md:gap-4">
                  {/* Instagram card */}
                  <div className="col-span-3 relative rounded-2xl overflow-hidden">
                    <Image
                      src="https://battulaaljewels.com/website/images/product-banner.webp"
                      alt="Instagram grid"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-700/50 to-transparent" />
                    <div className="relative z-10 p-4 flex flex-col justify-between h-full">
                      <p className="text-xs uppercase tracking-[0.2em] text-blue-100">
                        Instagram
                      </p>
                      <p className="mt-2 text-lg md:text-xl font-bold leading-tight">
                        Plastic free,
                        <br />
                        planet friendly
                      </p>
                      <span className="mt-3 inline-flex items-center text-[11px] font-medium bg-black/60 px-2 py-1 rounded-full w-fit">
                        @yourbrand
                      </span>
                    </div>
                  </div>
                  {/* New drops small tile */}
                  <div className="col-span-1 relative rounded-2xl overflow-hidden">
                    <Image
                      src="https://battulaaljewels.com/website/images/product-banner.webp"
                      alt="New drops"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="relative z-10 p-2 flex items-center justify-center">
                      <span className="text-xs font-semibold text-white text-center bg-black/50 px-2 py-1 rounded-full">
                        New
                        <br />
                        drops
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center tall tiles */}
              <div className="col-span-4 md:col-span-3 space-y-3 md:space-y-4">
                {/* More glow banner */}
                <div className="relative rounded-2xl overflow-hidden h-32 md:h-40">
                  <Image
                    src="https://battulaaljewels.com/website/images/product-banner.webp"
                    alt="More glow banner"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
                  <div className="relative z-10 p-4 flex items-center justify-center h-full">
                    <p className="text-xl md:text-2xl font-extrabold tracking-tight text-white text-center">
                      More glow,
                      <span className="text-black ml-1 px-2 py-1 rounded-full bg-yellow-300">
                        less noise
                      </span>
                    </p>
                  </div>
                </div>
                {/* TikTok / YouTube row */}
                <div className="grid grid-cols-4 gap-3 md:gap-4 h-40 md:h-48">
                  <div className="col-span-2 relative rounded-2xl overflow-hidden">
                    <Image
                      src="https://battulaaljewels.com/website/images/product-banner.webp"
                      alt="TikTok behind the scenes"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="relative z-10 p-4 flex flex-col justify-between h-full">
                      <p className="text-xs uppercase tracking-[0.2em] text-purple-200">
                        TikTok
                      </p>
                      <p className="text-sm md:text-base font-medium mt-2">
                        Behind-the-scenes
                        <br />
                        from our studio.
                      </p>
                    </div>
                  </div>
                  <div className="col-span-2 relative rounded-2xl overflow-hidden">
                    <Image
                      src="https://battulaaljewels.com/website/images/product-banner.webp"
                      alt="YouTube stories"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="relative z-10 p-4 flex flex-col justify-between h-full">
                      <p className="text-xs uppercase tracking-[0.2em] text-blue-50">
                        YouTube
                      </p>
                      <p className="text-lg md:text-xl font-bold leading-tight mt-2">
                        Craft stories
                        <br />
                        in motion.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right narrow column */}
              <div className="hidden md:flex md:flex-col md:col-span-2 space-y-4">
                <div className="relative rounded-2xl overflow-hidden h-32">
                  <Image
                    src="https://battulaaljewels.com/website/images/product-banner.webp"
                    alt="Choose positivity"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-white/80" />
                  <div className="relative z-10 p-4 text-black flex flex-col justify-between h-full">
                    <p className="text-[11px] uppercase tracking-[0.18em]">
                      Choose
                    </p>
                    <div className="flex items-center justify-between mt-2 text-xs font-semibold">
                      <span className="px-2 py-1 rounded-full bg-black text-white">
                        Love
                      </span>
                      <span className="px-2 py-1 rounded-full bg-pink-500 text-white">
                        Shine
                      </span>
                    </div>
                  </div>
                </div>
                <div className="relative rounded-2xl overflow-hidden h-40">
                  <Image
                    src="https://battulaaljewels.com/website/images/product-banner.webp"
                    alt="Community looks"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-700/80 via-emerald-400/40 to-transparent" />
                  <div className="relative z-10 p-4 flex flex-col justify-between h-full">
                    <p className="text-xs uppercase tracking-[0.2em] text-emerald-100">
                      Community
                    </p>
                    <p className="text-sm font-medium">
                      Tag us in your
                      <br />
                      favourite looks.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Second bento row to fill width more strongly, also image-based */}
            <div className="mt-6 grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4 text-white px-2 sm:px-4 lg:px-6">
              <div className="col-span-4 md:col-span-4 grid grid-cols-4 gap-3 md:gap-4">
                <div className="col-span-2 relative rounded-2xl overflow-hidden">
                  <Image
                    src="https://battulaaljewels.com/website/images/product-banner.webp"
                    alt="Live sparkle"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="relative z-10 p-4 flex flex-col justify-between h-full">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-100">
                      Live
                    </p>
                    <p className="text-lg md:text-xl font-extrabold leading-tight mt-2">
                      Sparkle in
                      <br />
                      real time.
                    </p>
                  </div>
                </div>
                <div className="col-span-2 relative rounded-2xl overflow-hidden">
                  <Image
                    src="https://battulaaljewels.com/website/images/product-banner.webp"
                    alt="Collab edits"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-pink-600/70" />
                  <div className="relative z-10 p-4 flex flex-col justify-between h-full">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-pink-100">
                      Collabs
                    </p>
                    <p className="text-xs md:text-sm font-medium mt-2">
                      Creator edits &
                      <br />
                      style challenges.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-span-4 md:col-span-4 grid grid-cols-4 gap-3 md:gap-4">
                <div className="col-span-2 relative rounded-2xl overflow-hidden">
                  <Image
                    src="https://battulaaljewels.com/website/images/product-banner.webp"
                    alt="Pinterest moodboard"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-indigo-900/70" />
                  <div className="relative z-10 p-4 flex flex-col justify-between h-full">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-indigo-200">
                      Pinterest
                    </p>
                    <p className="text-sm md:text-base font-medium mt-2">
                      Save dream looks
                      <br />
                      for later.
                    </p>
                  </div>
                </div>
                <div className="col-span-2 relative rounded-2xl overflow-hidden">
                  <Image
                    src="https://battulaaljewels.com/website/images/product-banner.webp"
                    alt="Highlights grid"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-yellow-300/90 via-orange-500/70 to-transparent" />
                  <div className="relative z-10 p-4 flex flex-col justify-between h-full">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-black">
                      Highlights
                    </p>
                    <p className="text-lg md:text-xl font-extrabold leading-tight text-black mt-2">
                      Let&apos;s
                      <br />
                      make it great.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
