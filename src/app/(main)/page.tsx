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
import ProductCard from "@/components/ProductCard";
import OccasionSection from "@/components/OccasionSection";
import SocialMediaBento from "@/components/SocialMediaBento";

export default function LandingPage() {
  const {
    setMobnoInputState,
    setAuthenticatedState,
    AuthenticatedState,
    setAuthUserId,
    setCartId,
    setCartItems,
    CartId,
    setCategories,
    categories,
    setCartCount,
    cartCount,
  } = useStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loadingBestSellers, setLoadingBestSellers] = useState(true);
  const [loadingNewArrivals, setLoadingNewArrivals] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const supabase = createClient();

  // Simple slides array for the carousel
  const carouselItems = [
    "https://battulaaljewels.com/website/images/product-banner.webp",
    "https://battulaaljewels.com/website/images/product-banner.webp",
    "https://battulaaljewels.com/website/images/product-banner.webp",
  ].map((src, index) => (
    <div
      key={index}
      className="w-full h-[400px] md:h-[500px] lg:h-[600px] relative"
    >
      <Image
        src={src}
        alt={`Jewelry Banner ${index + 1}`}
        fill={true}
        className="object-cover"
        priority={index === 0}
        fetchPriority={index === 0 ? "high" : "auto"}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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

  // ✅ FIXED - Get full cart after merging
  const mergeLocalCartItems = async (cartId: string): Promise<void> => {
    try {
      const localCartItems = localStorage.getItem("cartItems");
      if (!localCartItems) return;

      const localCartItemsArray = JSON.parse(localCartItems);
      if (
        !Array.isArray(localCartItemsArray) ||
        localCartItemsArray.length === 0
      ) {
        localStorage.removeItem("cartItems");
        return;
      }

      // Process all items in parallel
      const addPromises = localCartItemsArray.map((item) =>
        addToDbCart(item.products, cartId, supabase)
      );

      await Promise.allSettled(addPromises);

      // Fetch the complete updated cart from DB
      const { data: cartData, error } = await supabase
        .from("cart")
        .select(`*, cart_items(*)`)
        .eq("cart_id", cartId)
        .single();

      if (!error && cartData) {
        setCartItems(cartData.cart_items);
        const totalCount = cartData.cart_items.reduce(
          (sum: number, item: any) => sum + item.quantity,
          0
        );
        setCartCount(totalCount);
      }

      localStorage.removeItem("cartItems");
    } catch (error) {
      console.error("Local cart merge error:", error);
      localStorage.removeItem("cartItems");
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        console.log("User not authenticated");
        setAuthenticatedState(false);
        return;
      }
      setAuthenticatedState(true);
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("phone_number", "+" + data?.user?.phone)
        .single();
      if (userError || !userData?.user_id) {
        console.log("User logged but no data found in db");
        setAuthenticatedState(false);
        return;
      }
      console.log("User data found in db", userData?.user_id);
      setAuthUserId(userData?.user_id);
      const { data: cartData, error: cartError } = await supabase
        .from("cart")
        .select(`*,cart_items(quantity)`)
        .eq("user_id", userData?.user_id)
        .maybeSingle();
      if (cartError || !cartData?.cart_id) {
        console.log("No cart found for user", userData?.user_id);
        const {
          success,
          data: newCart,
          error: createError,
        } = await createCart(userData.user_id, supabase);

        if (success && newCart?.cart_id) {
          console.log("✅ Recovery cart created:", newCart.cart_id);
          setCartId(newCart.cart_id);
          setCartCount(0);
          await mergeLocalCartItems(newCart.cart_id);
        } else {
          console.error("❌ Failed to create recovery cart:", createError);
          // Optionally show error to user
          setCartId("");
        }
        return; // Exit early
      }
      setCartId(cartData?.cart_id);
      const Count =
        cartData?.cart_items?.reduce(
          (sum: number, item: any) => sum + item.quantity,
          0
        ) ?? 0;
      setCartCount(Count);
      console.log("calling mergeLocalCartItems");
      mergeLocalCartItems(cartData?.cart_id);
    };
    checkAuthentication();
  }, []);


  useEffect(()=>{
    const FetchLandingPageData = async () => {
   setLoadingBestSellers(true);
   setLoadingNewArrivals(true);
   setLoadingCategories(true);
   

   const [catgoriesRes,bestSellersRes,newArrivalsRes] = await Promise.all([
    supabase.from("categories").select("*"),
    supabase.from("products").select("*").contains("tags", ["best-sellers"]).eq("listed_status", true),
    supabase.from("products").select("*").contains("tags", ["new-arrivals"]).eq("listed_status", true),
   ])
   if (!catgoriesRes.error) setCategories(catgoriesRes.data || []);
   if (!bestSellersRes.error) setBestSellers(bestSellersRes.data || []);
   if (!newArrivalsRes.error) setNewArrivals(newArrivalsRes.data || []);
   setLoadingBestSellers(false);
   setLoadingNewArrivals(false);
   setLoadingCategories(false);

    }
    FetchLandingPageData();
  },[])



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
      {/* Cart Component - receives isOpen state and onClose handler */}
      {isCartOpen && <Cart isOpen={isCartOpen} onClose={handleCloseCart} />}
      <main className="w-full">
        <Carousel
          items={carouselItems}
          autoSlideInterval={3000}
          className="h-[250px] md:h-[500px] lg:h-[600px]"
        />
        {loadingCategories ? (
          <CategorySectionSkeleton />
        ) : categories.length > 0 ? (
          <CategorySection categories={categories} />
        ) : null}

        {/* New Arrival Products Section */}
        {loadingBestSellers ? (
          <ProductCarouselSkeleton title="Best Sellers" />
        ) : bestSellers.length > 0 ? (
          <ProductCarousel
            sectionHeading="Best Sellers"
            products={bestSellers}
            onAddToCart={handleAddToCart}
            onWishlistToggle={handleWishlistToggle}
          />
        ) : null}

        {/* collection wise division of products */}
        <Collection />

        {/* You can add more ProductCarousel sections with different data */}
        {loadingNewArrivals ? (
          <ProductCarouselSkeleton title="New Arrivals" />
        ) : newArrivals.length > 0 ? (
          <ProductCarousel
            sectionHeading="New Arrivals"
            products={newArrivals}
            onAddToCart={handleAddToCart}
            onWishlistToggle={handleWishlistToggle}
          />
        ) : null}

        {/* Occasion Selection Section */}
        <OccasionSection />

        {/* Model Carousel Section */}
        {/* <ModelCaraousel /> */}

        {/* Social Media Bento Section */}
        <SocialMediaBento />
      </main>
    </div>
  );
}

function SkeletonPulseBlock({ className }: { className?: string }) {
  return <div className={`bg-gray-200 animate-pulse ${className}`} />;
}

function CategorySectionSkeleton() {
  return (
    <section className="w-full bg-theme-cream py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-7 md:h-9 w-48 md:w-60 mx-auto bg-gray-200 animate-pulse rounded mb-6 md:mb-8" />
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 md:gap-6 pb-4 min-w-max md:justify-center md:flex-wrap pt-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center flex-shrink-0 w-20 md:w-24 lg:w-28 gap-2"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full bg-gray-200 animate-pulse" />
                <div className="h-3 md:h-4 w-16 md:w-20 bg-gray-200 animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCarouselSkeleton({ title }: { title: string }) {
  const placeholderCards = Array.from({ length: 4 });
  return (
    <section className="w-full bg-theme-cream py-6 md:py-12 lg:py-16">
      <div className="flex items-center justify-center mb-5 md:mb-8 px-4 sm:px-6 lg:px-8">
        <div
          className="h-6 md:h-8 w-40 md:w-56 bg-gray-200 animate-pulse rounded"
          aria-label={title}
        />
      </div>
      <div className="relative w-full">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-6 pb-10 md:pb-12 pl-4 sm:pl-6 lg:pl-8 pr-4 sm:pr-6 lg:pr-8">
            {placeholderCards.map((_, idx) => (
              <div
                key={idx}
                className="product-card flex-shrink-0 w-[calc((100vw/1.3-3rem)*0.95)] sm:w-[calc((100vw/2-4rem)*0.95)] md:w-[calc((100vw/2.5-5rem)*0.95)] lg:w-[calc(100vw/3-6rem)] xl:w-[380px]"
              >
                <ProductCard product={{}} isLoading />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
