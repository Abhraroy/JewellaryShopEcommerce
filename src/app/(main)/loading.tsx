import ProductCarouselSkeleton from "@/components/ProductUI/ProductCaraouselSkeleton";

// app/loading.tsx
export default function Loading() {
    return (
      <div className="min-h-screen bg-theme-cream">
        <main className="w-full">
  
          {/* Hero / Carousel Skeleton */}
          <div className="w-full h-[250px] md:h-[500px] lg:h-[600px] bg-gray-200 animate-pulse" />
  
          {/* Categories Skeleton */}
          <section className="w-full py-8 md:py-12">
            <div className="max-w-7xl mx-auto px-4">
              <div className="h-7 w-48 mx-auto bg-gray-200 animate-pulse rounded mb-6" />
              <div className="flex gap-4 justify-center flex-wrap">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse" />
                    <div className="h-3 w-16 bg-gray-200 animate-pulse rounded" />
                  </div>
                ))}
              </div>
            </div>
          </section>
  
          {/* Best Sellers Skeleton */}
          <ProductCarouselSkeleton title="Best Sellers" />
  
          {/* Collection Skeleton */}
          <section className="py-8 md:py-12 lg:py-16">
            <div className="w-[95%] mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[400px] md:h-[500px] lg:h-[600px] bg-gray-200 animate-pulse rounded-xl"
                  />
                ))}
              </div>
            </div>
          </section>
  
          {/* New Arrivals Skeleton */}
          <ProductCarouselSkeleton title="New Arrivals" />
  
          {/* Occasion Section Skeleton */}
          <section className="w-full py-12 md:py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8 md:mb-12">
                <div className="h-10 md:h-14 w-64 md:w-80 mx-auto bg-gray-200 animate-pulse rounded mb-3" />
                <div className="h-5 w-96 mx-auto bg-gray-200 animate-pulse rounded" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-64 md:h-80 bg-gray-200 animate-pulse rounded-2xl"
                  />
                ))}
              </div>
            </div>
          </section>
  
          {/* Image Gallery Carousel Skeleton */}
          <section className="w-full py-12 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10 md:mb-14">
                <div className="h-8 md:h-12 w-48 md:w-64 mx-auto bg-gray-200 animate-pulse rounded mb-3" />
                <div className="h-4 w-96 mx-auto bg-gray-200 animate-pulse rounded" />
              </div>
              <div className="relative">
                <div className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[550px] bg-gray-200 animate-pulse rounded-2xl" />
                {/* Navigation dots skeleton */}
                <div className="flex items-center justify-center gap-2 mt-6 md:mt-8">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-gray-300 animate-pulse rounded-full"
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
  
          {/* Social Media Bento Skeleton */}
          <section className="w-full py-12 md:py-16 px-0">
            <div className="w-full">
              {/* Heading skeleton */}
              <div className="flex flex-col items-center justify-center gap-3 md:gap-4 mb-8 px-4 sm:px-6 lg:px-10">
                <div className="h-7 md:h-9 w-48 md:w-56 bg-gray-200 animate-pulse rounded" />
                <div className="h-6 md:h-7 w-64 md:w-80 bg-gray-200 animate-pulse rounded" />
                <div className="h-10 w-40 bg-gray-200 animate-pulse rounded-full" />
              </div>
  
              {/* Bento grid skeleton */}
              <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4 px-2 sm:px-4 lg:px-6">
                {/* Left column */}
                <div className="col-span-4 md:col-span-3 space-y-3 md:space-y-4">
                  <div className="grid grid-cols-4 gap-3 md:gap-4">
                    <div className="col-span-2 h-32 md:h-40 bg-gray-200 animate-pulse rounded-2xl" />
                    <div className="col-span-2 h-32 md:h-40 bg-gray-200 animate-pulse rounded-2xl" />
                  </div>
                  <div className="grid grid-cols-4 gap-3 md:gap-4">
                    <div className="col-span-3 h-32 md:h-40 bg-gray-200 animate-pulse rounded-2xl" />
                    <div className="col-span-1 h-32 md:h-40 bg-gray-200 animate-pulse rounded-2xl" />
                  </div>
                </div>
                {/* Center column */}
                <div className="col-span-4 md:col-span-3 space-y-3 md:space-y-4">
                  <div className="h-32 md:h-40 bg-gray-200 animate-pulse rounded-2xl" />
                  <div className="grid grid-cols-4 gap-3 md:gap-4 h-40 md:h-48">
                    <div className="col-span-2 bg-gray-200 animate-pulse rounded-2xl" />
                    <div className="col-span-2 bg-gray-200 animate-pulse rounded-2xl" />
                  </div>
                </div>
                {/* Right column */}
                <div className="hidden md:flex md:flex-col md:col-span-2 space-y-4">
                  <div className="h-32 bg-gray-200 animate-pulse rounded-2xl" />
                  <div className="h-40 bg-gray-200 animate-pulse rounded-2xl" />
                </div>
              </div>
  
              {/* Second bento row skeleton */}
              <div className="mt-6 grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4 px-2 sm:px-4 lg:px-6">
                <div className="col-span-4 md:col-span-4 grid grid-cols-4 gap-3 md:gap-4">
                  <div className="col-span-2 h-40 md:h-48 bg-gray-200 animate-pulse rounded-2xl" />
                  <div className="col-span-2 h-40 md:h-48 bg-gray-200 animate-pulse rounded-2xl" />
                </div>
                <div className="col-span-4 md:col-span-4 grid grid-cols-4 gap-3 md:gap-4">
                  <div className="col-span-2 h-40 md:h-48 bg-gray-200 animate-pulse rounded-2xl" />
                  <div className="col-span-2 h-40 md:h-48 bg-gray-200 animate-pulse rounded-2xl" />
                </div>
              </div>
            </div>
          </section>
  
        </main>
      </div>
    );
  }
  


  