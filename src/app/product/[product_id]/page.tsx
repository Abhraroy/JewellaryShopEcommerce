"use client"
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductDisplay from '@/components/ProductDisplay';
import ProductReview from '@/components/ProductReview';
import { useParams } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/client';
import { useEffect, useState } from 'react';
import { useStore } from '@/zustandStore/zustandStore';

// Demo product data - will be replaced with actual data from Supabase
const demoProduct = {
  name: 'Elegant Gold Chain Necklace',
  price: 2499,
  originalPrice: 3499,
  discount: 29,
  rating: 4.5,
  reviews: 128,
  inStock: true,
  stockCount: 15,
  description: 'Experience luxury with our exquisite gold chain necklace. Crafted with precision and care, this timeless piece features a delicate design that complements any outfit. Perfect for both casual and formal occasions. Made from premium quality materials, this necklace showcases exceptional craftsmanship and attention to detail. The elegant chain design adds sophistication to your look while maintaining comfort throughout the day. Each piece is carefully inspected to ensure the highest standards of quality and durability. The versatile design makes it perfect for layering with other necklaces or wearing as a standalone statement piece. Whether you\'re attending a special event or simply want to elevate your everyday style, this necklace is the perfect addition to your jewelry collection.',
  images: [
    'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928',
    'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928',
    'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928',
    'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928',
  ],
  sizes: ['14"', '16"', '18"', '20"'],
  category: 'Necklaces',
  material: 'Gold Plated',
  weight: '12g',
  sku: 'CH-928725',
};

// Demo review data
const demoReviews = [
  {
    id: '1',
    userName: 'Sarah Johnson',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    date: '2024-11-15',
    title: 'Absolutely stunning piece!',
    comment: 'This necklace exceeded my expectations! The craftsmanship is impeccable and it looks even more beautiful in person. The gold plating is high quality and hasn\'t faded at all. Perfect for both everyday wear and special occasions. I get compliments every time I wear it!',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1611955167811-4711904bb9f0?w=400&h=400&fit=crop'
    ],
    verified: true,
    helpful: 12
  },
  {
    id: '2',
    userName: 'Michael Chen',
    rating: 4,
    date: '2024-11-10',
    title: 'Great quality, fast shipping',
    comment: 'Very happy with this purchase. The necklace arrived quickly and was well packaged. The design is elegant and the weight feels just right - not too heavy but substantial enough to feel premium. Only giving 4 stars because the clasp could be a bit more secure, but overall excellent value.',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1603561596112-0a1323e8e0f6?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1603561591415-8f16e4c0c0e3?w=400&h=400&fit=crop'
    ],
    verified: true,
    helpful: 8
  },
  {
    id: '3',
    userName: 'Emma Davis',
    rating: 5,
    date: '2024-11-08',
    title: 'Perfect gift for my sister',
    comment: 'I bought this as a birthday gift for my sister and she absolutely loves it! The quality is outstanding and it arrived in beautiful packaging. The chain length is perfect and the pendant sits nicely. Will definitely be shopping here again for jewelry gifts.',
    images: [
      'https://images.unsplash.com/photo-1611955167811-4711904bb9f0?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop'
    ],
    verified: true,
    helpful: 6
  },
  {
    id: '4',
    userName: 'James Wilson',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    date: '2024-11-05',
    title: 'Exceptional craftsmanship',
    comment: 'As someone who works in fashion, I can appreciate the attention to detail in this piece. The gold plating is flawless and the chain links are perfectly uniform. It\'s comfortable to wear all day and the design is timeless. Highly recommend for anyone looking for quality jewelry.',
    images: [
      'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1603561591415-8f16e4c0c0e3?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1603561596112-0a1323e8e0f6?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop'
    ],
    verified: true,
    helpful: 15
  },
  {
    id: '5',
    userName: 'Lisa Rodriguez',
    rating: 4,
    date: '2024-11-02',
    title: 'Beautiful but sizing runs small',
    comment: 'Love the design and quality of this necklace! The pendant is gorgeous and the chain is nice and delicate. However, I found that the sizing runs a bit small - I had to exchange for a larger size. Customer service was excellent in helping with the exchange. Would buy again!',
    images: [
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1611955167811-4711904bb9f0?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1603561596112-0a1323e8e0f6?w=400&h=400&fit=crop'
    ],
    verified: true,
    helpful: 9
  },
  {
    id: '6',
    userName: 'David Kim',
    rating: 5,
    date: '2024-10-28',
    title: 'Worth every penny',
    comment: 'This necklace is a true investment piece. The quality is outstanding and it feels luxurious without being overly heavy. I\'ve worn it daily for a month now and it still looks brand new. The packaging was elegant and made for a great unboxing experience. 5 stars all the way!',
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1603561591415-8f16e4c0c0e3?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1611955167811-4711904bb9f0?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop'
    ],
    verified: true,
    helpful: 11
  }
];

const demoRatingDistribution = {
  5: 89,
  4: 25,
  3: 8,
  2: 4,
  1: 2
};


export default function ProductPage() {
  const {product_id} = useParams();
  const [productDetails, setProductDetails] = useState<any>(null);
  const [reviews, setReviews] = useState<any>([]);
  const supabase = createClient();
  
  useEffect(()=>{
    const getProductdetails = async()=>{
      const {data,error} = await supabase
      .from("products")
      .select(`
        *,
        product_images!product_images_product_id_fkey(*),
        reviews(*),
        categories(*)
        `).eq("product_id",product_id);
      if(error){
        console.log("error",error)
      }
      else{
        console.log("product details",data)
        setProductDetails(data);
      }
    }
    getProductdetails();
    const reviewData = async()=>{
      const {data,error} = await supabase
      .from("reviews")
      .select(`
      *,
      review_images(*),
      users(*)  
      `)
      .eq("product_id",product_id);
      if(error){
        console.log("error",error)
      }
      else{
        console.log("product images",data)
        setReviews(data);
      }
    }
    reviewData();
    
  },[product_id])



  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* <Navbar cartCount={3} isAuthenticated={false} /> */}

      {productDetails && <ProductDisplay productDetails={productDetails} />}

      {reviews && <ProductReview
        reviews={reviews}
      />}
      <Footer />
    </div>
  );
}
