"use client"
import Navbar from '@/components/Navbar';
import Carousel from '@/components/Carousel';
import CategorySection from '@/components/CategorySection';
import ProductCarousel, { Product } from '@/components/ProductCarousel';
import BentoGrid from '@/components/BentoGrid';
import Image from 'next/image';
import Footer from '@/components/Footer';
import { useStore } from '@/zustandStore/zustandStore';
import PhoneNumberInput from '@/components/PhoneNumberInput';
import OtpInput from '@/components/OtpInput';
import { useEffect, useState } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import Cart from '@/components/Cart';
import { createCart } from '@/utilityFunctions/CartFunctions';

export default function LandingPage() {
  const { MobnoInputState, OtpInputState, setMobnoInputState, setAuthenticatedState, AuthenticatedState, setAuthUserId, setCartId } = useStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  // Create multiple slides with the same image
  const carouselItems = Array.from({ length: 3 }, (_, index) => (
    <div key={index} className="w-full h-[400px] md:h-[500px] lg:h-[600px] relative">
      <Image
        src="https://battulaaljewels.com/website/images/product-banner.webp"
        alt={`Jewelry Banner ${index + 1}`}
        fill
        className="object-cover"
        priority={index === 0}
      />
    </div>
  ));

  // Sample product data - you can replace this with your actual data
  const newArrivalProducts: Product[] = [
    {
      id: '1',
      title: 'Riva Bold Pearl 22K Gold Platted stainless steel Tarnish Free Waterproof Combo Necklace with Earrings for Women and Girls',
      imageUrl: 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928',
      price: 549.00,
      originalPrice: 899.00,
      slug: 'riva-bold-pearl-necklace-earrings',
    },
    {
      id: '2',
      title: 'Riva Green Diamond 22K Gold Platted stainless steel Tarnish Free Waterproof Combo Necklace with Earrings for Women and Girls',
      imageUrl: 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928',
      price: 699.00,
      originalPrice: 999.00,
      slug: 'riva-green-diamond-necklace-earrings',
    },
    {
      id: '3',
      title: 'Riva Black Stone 22K Gold Platted stainless steel Tarnish Free Waterproof Combo Necklace with Earrings for Women and Girls',
      imageUrl: 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928',
      price: 699.00,
      originalPrice: 999.00,
      slug: 'riva-black-stone-necklace-earrings',
    },
    {
      id: '4',
      title: 'Riva Rosse Gold 18K Gold Platted Stainless Steel Tarnish free waterproof Earrings for Women and Girls',
      imageUrl: 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928',
      price: 399.00,
      originalPrice: 699.00,
      slug: 'riva-rosse-gold-earrings',
    },
    {
      id: '5',
      title: 'Riva Gold Plated Necklace Set with Matching Earrings',
      imageUrl: 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928',
      price: 799.00,
      originalPrice: 1299.00,
      slug: 'riva-gold-plated-necklace-set',
    },
    {
      id: '6',
      title: 'Riva Silver Plated Diamond Stud Earrings',
      imageUrl: 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928',
      price: 499.00,
      originalPrice: 799.00,
      slug: 'riva-silver-plated-diamond-earrings',
    },
  ];

  const handleAddToCart = (productId: string) => {
    console.log('Add to cart:', productId);
    // Implement your add to cart logic here
  };

  const handleWishlistToggle = (productId: string) => {
    console.log('Wishlist toggle:', productId);
    // Implement your wishlist logic here
  };

  // Gold Chain Products Section
  const goldChainProducts: Product[] = [
    {
      id: '7',
      title: 'Artificial Gold Chain 1 Gram Gold Plated 20 Inch for Boys and Men',
      imageUrl: 'https://gurupujan.com/cdn/shop/files/Artificial_Gold_Chain_1_Gram_Gold_Plated_20_Inch_for_boys_and_men_offering_a_stylish_affordable_accessory_for_any_occasion.1.png?v=1756272428',
      price: 299.00,
      originalPrice: 499.00,
      slug: 'artificial-gold-chain-1-gram-20-inch',
    },
    {
      id: '8',
      title: 'Artificial Gold Chain 2 Gram Gold Plated 22 Inch for Boys and Men',
      imageUrl: 'https://gurupujan.com/cdn/shop/files/Artificial_Gold_Chain_1_Gram_Gold_Plated_20_Inch_for_boys_and_men_offering_a_stylish_affordable_accessory_for_any_occasion.1.png?v=1756272428',
      price: 399.00,
      originalPrice: 599.00,
      slug: 'artificial-gold-chain-2-gram-22-inch',
    },
    {
      id: '9',
      title: 'Artificial Gold Chain 1.5 Gram Gold Plated 24 Inch for Men',
      imageUrl: 'https://gurupujan.com/cdn/shop/files/Artificial_Gold_Chain_1_Gram_Gold_Plated_20_Inch_for_boys_and_men_offering_a_stylish_affordable_accessory_for_any_occasion.1.png?v=1756272428',
      price: 349.00,
      originalPrice: 549.00,
      slug: 'artificial-gold-chain-1-5-gram-24-inch',
    },
    {
      id: '10',
      title: 'Stylish Gold Plated Chain 18 Inch for Boys',
      imageUrl: 'https://gurupujan.com/cdn/shop/files/Artificial_Gold_Chain_1_Gram_Gold_Plated_20_Inch_for_boys_and_men_offering_a_stylish_affordable_accessory_for_any_occasion.1.png?v=1756272428',
      price: 259.00,
      originalPrice: 449.00,
      slug: 'stylish-gold-plated-chain-18-inch',
    },
    {
      id: '11',
      title: 'Premium Gold Chain 2.5 Gram Gold Plated 20 Inch for Men',
      imageUrl: 'https://gurupujan.com/cdn/shop/files/Artificial_Gold_Chain_1_Gram_Gold_Plated_20_Inch_for_boys_and_men_offering_a_stylish_affordable_accessory_for_any_occasion.1.png?v=1756272428',
      price: 449.00,
      originalPrice: 699.00,
      slug: 'premium-gold-chain-2-5-gram-20-inch',
    },
    {
      id: '12',
      title: 'Classic Gold Chain 1 Gram Gold Plated 20 Inch Combo Pack',
      imageUrl: 'https://gurupujan.com/cdn/shop/files/Artificial_Gold_Chain_1_Gram_Gold_Plated_20_Inch_for_boys_and_men_offering_a_stylish_affordable_accessory_for_any_occasion.1.png?v=1756272428',
      price: 549.00,
      originalPrice: 899.00,
      slug: 'classic-gold-chain-combo-pack',
    },
  ];

  useEffect(() => {
    const checkAuthentication = async () => {
      const supabase =  createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setAuthenticatedState(true)
        const userData:any = await  supabase.from("users").select("*").eq("phone_number","+"+user.phone).single();
        if(userData.data){
          setAuthUserId(userData.data?.user_id)
          const {data,error} = await supabase.from("cart").select("*").eq("user_id",userData.data?.user_id).maybeSingle();
          if(data){
            setCartId(data?.cart_id)
          }
          else{
            const {success,data,error} = await createCart(userData.data?.user_id,supabase)
            if(success){
              setCartId(data?.cart_id)
            }
            else{
              console.log("error",error)
            }
          }
          console.log('User data', userData.data)
        }
        console.log('User is authenticated')
      }else{
        setAuthenticatedState(false)
        console.log('User is not authenticated')
      }
    }
    checkAuthentication()
  }, [AuthenticatedState])

  useEffect(() => {
    const getProducts = async () =>{
      const supabase = createClient()
      const {data,error}:any = await supabase.from("products").select("*")
      if(error){
        console.log("error",error)
      }
      else{
        console.log("products",data)
        setProducts(data)
      }
    }
    getProducts()
  }, [])

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
      <Navbar cartCount={0} onCartClick={handleOpenCart} />
      {MobnoInputState && !OtpInputState && <PhoneNumberInput />}
      {OtpInputState && !MobnoInputState && <OtpInput />}
      
      {/* Cart Component - receives isOpen state and onClose handler */}
      {isCartOpen && < Cart isOpen={isCartOpen} onClose={handleCloseCart} />}
      <main className="w-full">
        <Carousel 
          items={carouselItems} 
          autoSlideInterval={3000}
          className="h-[400px] md:h-[500px] lg:h-[600px]"
        />
        <CategorySection />
        
        {/* New Arrival Products Section */}
        <ProductCarousel
          sectionHeading="New Arrival"
          products={newArrivalProducts}
          onAddToCart={handleAddToCart}
          onWishlistToggle={handleWishlistToggle}
        />

        {/* Bento Grid Category Section */}
        <BentoGrid />

        {/* You can add more ProductCarousel sections with different data */}
        <ProductCarousel
          sectionHeading="Best Sellers"
          products={goldChainProducts}
          onAddToCart={handleAddToCart}
          onWishlistToggle={handleWishlistToggle}
        />

        <Footer/>
      </main>
    </div>
  );
}