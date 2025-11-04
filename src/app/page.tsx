import Navbar from '@/components/Navbar';
import Carousel from '@/components/Carousel';
import CategorySection from '@/components/CategorySection';
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to the Landing Page</h1>
        </div>
      </main>
    </div>
  );
}