"use client"
import Navbar from '@/components/Navbar';
import Carousel from '@/components/Carousel';
import CategorySection from '@/components/CategorySection';
import ProductCarousel, { Product } from '@/components/ProductCarousel';
import BentoGrid from '@/components/BentoGrid';
import Image from 'next/image';

export default function LandingPage() {
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

  return (
    <div className="min-h-screen bg-white">
      <Navbar cartCount={0} />
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
        {/* <ProductCarousel
          sectionHeading="Best Sellers"
          products={bestSellerProducts}
          onAddToCart={handleAddToCart}
          onWishlistToggle={handleWishlistToggle}
        /> */}
      </main>
    </div>
  );
}