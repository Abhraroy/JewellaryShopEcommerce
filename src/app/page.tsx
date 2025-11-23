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
import YTpayment from "@/components/YTpayment";

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
  } = useStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
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
            if(localCartItems){
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
            
            }
            else{
              console.log("No cart items from local storage");
            }
            localStorage.removeItem("cartItems");
          } 
          else {
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
    const getProducts = async () => {
      const supabase = createClient();
      const { data, error }: any = await supabase.from("products").select("*");
      if (error) {
        console.log("error", error);
      } else {
        setProducts(data);
      }
    };
    getProducts();
  }, []);


  useEffect(()=>{
    const getAllCategories = async () =>{
      const {data,error} = await supabase.from("categories").select("*");
      if(error){
        console.log("error",error)
      }
      else{
        console.log("data",data)
        setCategories(data);
      }
    }
    getAllCategories();
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
    <div className="min-h-screen bg-white">
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
          sectionHeading="New Arrival"
          products={products}
          onAddToCart={handleAddToCart}
          onWishlistToggle={handleWishlistToggle}
        />

        {/* Bento Grid Category Section */}
        <BentoGrid />

        {/* You can add more ProductCarousel sections with different data */}
        <ProductCarousel
          sectionHeading="Best Sellers"
          products={products}
          onAddToCart={handleAddToCart}
          onWishlistToggle={handleWishlistToggle}
        />
        {initiatingCheckout && <PaymentGatewayComponent />}
        {/* {
          initiatingCheckout && <YTpayment />
        } */}
      </main>
    </div>
  );
}
