"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function ModelCaraousel() {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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
      src: "https://media.istockphoto.com/id/1276740597/photo/indian-traditional-gold-necklace.jpg?s=612x612&w=0&k=20&c=OYp1k0OVJObYq9hqVK_r6NwYa_W54km4nya1R-ovIUY=",
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

  return (
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
                        transition: "box-shadow 1s ease-in-out",
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
                          transition: "opacity 0.3s ease-in-out",
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
  );
}

