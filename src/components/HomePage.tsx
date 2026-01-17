"use client";
import dynamic from "next/dynamic";
import Carousel from "@/components/Carousel";
import CategorySection from "@/components/CategorySection";
import ProductCarousel from "@/components/ProductUI/ProductCarousel";
import Image from "next/image";
import { useStore } from "@/zustandStore/zustandStore";
import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";

import {
  createCart,
  calculateCartCount,
  getLocalCartCount,
} from "@/utilityFunctions/CartFunctions";
import { Product } from "@/utilityFunctions/TypeInterface";
import ProductCarouselSkeleton from "@/components/ProductUI/ProductCaraouselSkeleton";

const OccasionSection = dynamic(
    () => import("./OccasionSection"),
    { ssr: false }
  );
  
  const SocialMediaBento = dynamic(
    () => import("./SocialMediaBento"),
    { ssr: false }
  );
  
  const ImageGalleryCarousel = dynamic(
    () => import("./ImageView/ImageGalleryCarousel"),
    { ssr: false }
  );
  
  const Collection = dynamic(
    () => import("./Collection"),
    { ssr: false }
  );
  




const BestSellersSection = dynamic(
    () => import("./HomePageComponents/BestSellerSection"),
    { ssr: false }
  );
  const NewArrivalSection = dynamic(
    () => import("./HomePageComponents/NewArrivalSection"),
    { ssr: false }
  );
  const Cart = dynamic(() => import("./CartUI/Cart"), {
    ssr: false,
  });

export default function HomePage(
    {
        categoriesProps,
        bestSellers,
        newArrivals,
    }:{
        categoriesProps: any;
        bestSellers: Product[];
        newArrivals: Product[];
    }
) {
  const {
    setAuthenticatedState,
    setAuthUserId,
    setCartId,
    setCartItems,
    setCategories,
    categories,
    setCartCount,
  } = useStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
//   const [loadingBestSellers, setLoadingBestSellers] = useState(true);
//   const [loadingNewArrivals, setLoadingNewArrivals] = useState(true);
//   const [loadingCategories, setLoadingCategories] = useState(true);
  const supabase = createClient();

  // Simple slides array for the carousel
  const carouselItems = [
    "https://battulaaljewels.com/website/images/product-banner.webp",
    "https://battulaaljewels.com/website/images/product-banner.webp",
    "https://battulaaljewels.com/website/images/product-banner.webp",
    "https://battulaaljewels.com/website/images/product-banner.webp",
    "https://battulaaljewels.com/website/images/product-banner.webp",
  ].map((src, index) => (
    <div
      key={index}
      className="w-full h-full relative"
    >
      <Image
        src={src}
        alt={`Jewelry Banner ${index + 1}`}
        fill={true}
        className="object-cover"
        priority={index === 0}
        fetchPriority={index === 0 ? "high" : "auto"}
        sizes="100vw"
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

  // ✅ FIXED - Get full cart after merging with quantity handling
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

      // First, fetch current cart items from DB to check what already exists
      const { data: existingCartItems, error: fetchError } = await supabase
        .from("cart_items")
        .select("product_id, quantity")
        .eq("cart_id", cartId);

      if (fetchError) {
        console.error("Error fetching existing cart items:", fetchError);
        return;
      }

      // Create a map of existing products for quick lookup
      const existingProductsMap = new Map(
        (existingCartItems || []).map((item) => [
          item.product_id,
          item.quantity,
        ])
      );

      // Process each local cart item
      const updatePromises = localCartItemsArray.map(async (item) => {
        const productId = item.products?.product_id || item.product_id;
        const localQuantity = item.quantity || 1;

        if (existingProductsMap.has(productId)) {
          // Product exists - update quantity by adding local quantity
          const currentQuantity = existingProductsMap.get(productId) || 0;
          const { error: updateError } = await supabase
            .from("cart_items")
            .update({ quantity: currentQuantity + localQuantity })
            .eq("cart_id", cartId)
            .eq("product_id", productId);

          if (updateError) {
            console.error(
              `Error updating cart item ${productId}:`,
              updateError
            );
          }
        } else {
          // Product doesn't exist - add it with local quantity
          const { error: insertError } = await supabase
            .from("cart_items")
            .insert({
              cart_id: cartId,
              product_id: productId,
              quantity: localQuantity,
            });

          if (insertError) {
            console.error(
              `Error inserting cart item ${productId}:`,
              insertError
            );
          }
        }
      });

      await Promise.allSettled(updatePromises);

      // Fetch the complete updated cart from DB
      const { data: cartData, error } = await supabase
        .from("cart")
        .select(`*, cart_items(*)`)
        .eq("cart_id", cartId)
        .single();

      if (!error && cartData) {
        setCartItems(cartData.cart_items);
        setCartCount(calculateCartCount(cartData.cart_items));
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
        // Set cart count from local storage for unauthenticated users
        setCartCount(getLocalCartCount());
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
      setCartCount(calculateCartCount(cartData?.cart_items ?? []));
      console.log("calling mergeLocalCartItems");
      mergeLocalCartItems(cartData?.cart_id);
    };
    const run = () => checkAuthentication();

    if ("requestIdleCallback" in window) {
        requestIdleCallback(run);
      } else {
        setTimeout(run, 1500);
      }
  }, []);

  useEffect(() => {
    // const FetchLandingPageData = async () => {
    //   setLoadingBestSellers(true);
    //   setLoadingNewArrivals(true);
    //   setLoadingCategories(true);

    //   const [catgoriesRes, bestSellersRes, newArrivalsRes] = await Promise.all([
    //     supabase.from("categories").select("*"),
    //     supabase
    //       .from("products")
    //       .select("*")
    //       .contains("tags", ["best-sellers"])
    //       .eq("listed_status", true),
    //     supabase
    //       .from("products")
    //       .select("*")
    //       .contains("tags", ["new-arrivals"])
    //       .eq("listed_status", true),
    //   ]);
    //   if (!catgoriesRes.error) setCategories(catgoriesRes.data || []);
    //   if (!bestSellersRes.error) setBestSellers(bestSellersRes.data || []);
    //   if (!newArrivalsRes.error) setNewArrivals(newArrivalsRes.data || []);
    //   setLoadingBestSellers(false);
    //   setLoadingNewArrivals(false);
    //   setLoadingCategories(false);
    // };
    // FetchLandingPageData();
  setCategories(categoriesProps);
}, [categoriesProps]);

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
          className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px]"
        />
        <CategorySection categories={categoriesProps} />

        {/* Best Sellers Products Section */}
        <BestSellersSection
          products={bestSellers}
          onAddToCart={handleAddToCart}
          onWishlistToggle={handleWishlistToggle}
        />
        {/* {loadingBestSellers ? (
          <ProductCarouselSkeleton title="Best Sellers" />
        ) : bestSellers.length > 0 ? (
          <ProductCarousel
            sectionHeading="Best Sellers"
            products={bestSellers}
            tagSlug="best-sellers"
            onAddToCart={handleAddToCart}
            onWishlistToggle={handleWishlistToggle}
          />
        ) : null} */}

        {/* collection wise division of products */}
        <Collection />

        {/* New Arrivals Products Section */}
        <NewArrivalSection  products={newArrivals} onAddToCart={handleAddToCart} onWishlistToggle={handleWishlistToggle} />

        {/* Occasion Selection Section */}
        <OccasionSection />

        {/* Image Gallery Carousel */}
        <ImageGalleryCarousel />

        {/* Social Media Bento Section */}
        <SocialMediaBento />
      </main>
    </div>
  );
}




