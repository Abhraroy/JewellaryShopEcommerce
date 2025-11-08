import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductDisplay from '@/components/ProductDisplay';

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

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar cartCount={3} isAuthenticated={false} />

      <ProductDisplay product={demoProduct} />

      <Footer />
    </div>
  );
}
