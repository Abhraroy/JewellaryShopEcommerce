'use client';

import { useRef, useState, useEffect } from 'react';
import ProductCard, { Product } from './ProductCard';

export type { Product };

interface ProductCarouselProps {
  sectionHeading: string;
  products: Product[];
  onAddToCart?: (productId: string) => void;
  onWishlistToggle?: (productId: string) => void;
  className?: string;
  showNavigation?: boolean;
  cardsToShow?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
}

export default function ProductCarousel({
  sectionHeading,
  products,
  onAddToCart,
  onWishlistToggle,
  className = '',
  showNavigation = true,
  cardsToShow = { mobile: 1.5, tablet: 2.5, desktop: 4 },
}: ProductCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);

  const checkScrollability = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    checkScrollability();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollability);
      window.addEventListener('resize', checkScrollability);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScrollability);
      }
      window.removeEventListener('resize', checkScrollability);
    };
  }, [products]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current || isScrolling) return;

    setIsScrolling(true);
    const container = scrollContainerRef.current;
    const cardWidth = container.querySelector('.product-card')?.clientWidth || 350;
    const gap = 24; // gap-6 = 24px
    const scrollAmount = cardWidth + gap;

    const targetScroll = direction === 'left'
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });

    setTimeout(() => {
      setIsScrolling(false);
      checkScrollability();
    }, 300);
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <section className={`w-full bg-white py-8 md:py-12 lg:py-16 ${className}`}>
      {/* Section Heading */}
      <div className="flex items-center justify-center mb-6 md:mb-8 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 relative inline-block">
          {sectionHeading}
          <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gray-900"></span>
        </h2>
      </div>

      {/* Carousel Container - Full Width */}
      <div className="relative w-full">
        {/* Scrollable Product Grid */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide scroll-smooth w-full"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <div className="flex gap-6 pb-12 pl-4 sm:pl-6 lg:pl-8 pr-4 sm:pr-6 lg:pr-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="product-card flex-shrink-0 w-[calc(100vw/1.3-3rem)] sm:w-[calc(100vw/2-4rem)] md:w-[calc(100vw/2.5-5rem)] lg:w-[calc(100vw/3-6rem)] xl:w-[380px]"
              >
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                  onWishlistToggle={onWishlistToggle}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        {showNavigation && products.length > (cardsToShow.desktop || 4) && (
          <>
            {/* Left Button */}
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`absolute left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 bg-white border border-gray-200 hover:border-gray-400 text-gray-800 rounded-full p-2 md:p-3 shadow-lg transition-all duration-200 z-10 ${
                canScrollLeft
                  ? 'opacity-100 hover:bg-gray-50'
                  : 'opacity-50 cursor-not-allowed'
              } hidden md:flex items-center justify-center`}
              aria-label="Scroll left"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-5 h-5 md:w-6 md:h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>

            {/* Right Button */}
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`absolute right-4 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 bg-white border border-gray-200 hover:border-gray-400 text-gray-800 rounded-full p-2 md:p-3 shadow-lg transition-all duration-200 z-10 ${
                canScrollRight
                  ? 'opacity-100 hover:bg-gray-50'
                  : 'opacity-50 cursor-not-allowed'
              } hidden md:flex items-center justify-center`}
              aria-label="Scroll right"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-5 h-5 md:w-6 md:h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Hide Scrollbar Styles */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
