'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useStore } from '@/zustandStore/zustandStore';

interface ProductData {
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  stockCount: number;
  description: string;
  images: string[];
  sizes: string[];
  category: string;
  material: string;
  weight: string;
  sku: string;
}



export default function ProductDisplay({productDetails}: {productDetails: any}) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [shouldTruncate, setShouldTruncate] = useState(false);
  const [truncatedDescription, setTruncatedDescription] = useState('');
  console.log(productDetails);


  // const handleQuantityChange = (type: 'increment' | 'decrement') => {
  //   if (type === 'increment' && quantity < product.stockCount) {
  //     setQuantity(quantity + 1);
  //   } else if (type === 'decrement' && quantity > 1) {
  //     setQuantity(quantity - 1);
  //   }
  // };

  // const handleAddToCart = () => {
  //   console.log('Added to cart:', {
  //     product: product.name,
  //     size: product.sizes[selectedSize],
  //     quantity,
  //   });
  //   // Add cart functionality here
  // };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    // Calculate position relative to viewport for fixed positioning
    setMousePosition({ x: e.clientX, y: e.clientY });
    // Calculate background position for 2.5x zoom
    // The background needs to be positioned so the hovered area is centered in the zoom window
    setZoomPosition({
      x: xPercent,
      y: yPercent
    });
  };

  const handleMouseEnter = () => {
    setShowZoom(true);
  };

  const handleMouseLeave = () => {
    setShowZoom(false);
  };

  // const descriptionLength = product.description.length;
  // const shouldTruncate = descriptionLength > 150;
  // const truncatedDescription = shouldTruncate
  //   ? product.description.substring(0, 150) + '...'
  //   : product.description;

  return (
    <>
      

      

       {/* Desktop Layout (1366px+) */}
      <div className="hidden xl:block">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex flex-row gap-12">
            {/* Product Images Section */}
            <div className="w-1/2 flex flex-row gap-6 sticky top-24 h-fit">
              {/* Thumbnail Images */}
              <div className="flex flex-col gap-4">
                {productDetails[0]?.product_images.map((img: any, index: any) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-[#E94E8B] scale-105'
                        : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={img.image_url}
                      alt={`${img.image_url} ${index + 1}`}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
              {/* Main Image */}
              <div
                className="flex-1 aspect-square bg-gray-100 rounded-2xl overflow-hidden relative cursor-crosshair"
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Image
                  src={productDetails[0]?.product_images[0]?.image_url}
                  alt={productDetails[0]?.product_images[0]?.image_url}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            {/* Zoom Layer - Outside container to avoid clipping */}
            {showZoom && (
              <div
                className="fixed pointer-events-none w-64 h-64 border-2 border-white shadow-2xl rounded-xl overflow-hidden"
                style={{
                  left: `${mousePosition.x}px`,
                  top: `${mousePosition.y}px`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 9999,
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${productDetails[0]?.product_images[0]?.image_url})`,
                    backgroundSize: '250%',
                    backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    backgroundRepeat: 'no-repeat',
                  }}
                />
              </div>
            )}

            {/* Product Details Section */}
            <div className="w-1/2 flex flex-col gap-4">
              {/* Product Name */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{productDetails[0]?.product_name}</h1>
                <p className="text-sm text-gray-500 mt-2">{productDetails[0]?.categories.category_name}</p>
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(productDetails[0]?.reviews[0]?.rating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {productDetails[0]?.reviews[0]?.rating} ({productDetails[0]?.reviews[0]?.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-gray-900">
                  ₹{productDetails[0]?.final_price}
                </span>
                <span className="text-2xl text-gray-400 line-through">
                  ₹{productDetails[0]?.base_price}
                </span>
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded">
                  {productDetails[0]?.discount_percentage}% OFF
                </span>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${productDetails[0]?.stock_quantity > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`text-sm font-medium ${productDetails[0]?.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {productDetails[0]?.stock_quantity > 0 ? `In Stock (${productDetails[0]?.stock_quantity} available)` : 'Out of Stock'}
                </span>
              </div>

              {/* Product Info Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-200 p-4 rounded-lg">
                  <p className="text-xs text-gray-500">Material</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{productDetails[0]?.metal_type}</p>
                </div>
                <div className="bg-gray-200 p-4 rounded-lg">
                  <p className="text-xs text-gray-500">Weight</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{productDetails[0]?.weight_grams} grams</p>
                </div>
                <div className="bg-gray-200 p-4 rounded-lg">
                  <p className="text-xs text-gray-500">Category</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{productDetails[0]?.categories.category_name}</p>
                </div>
              </div>

              {/* Size Selection */}
              <div className="flex flex-col gap-3">
                <span className="text-lg font-semibold text-gray-900">Select Size</span>
                <div className="flex flex-wrap gap-2">
                  {productDetails[0]?.size.map((size: any, index: any) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSize(index)}
                      className={`px-5 py-2.5 rounded-lg font-medium text-base transition-all ${
                        selectedSize === index
                          ? 'bg-[#E94E8B] text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                // onClick={handleAddToCart}
                className="w-full h-14 text-lg font-semibold bg-[#E94E8B] text-white rounded-lg hover:bg-[#d43e7a] transition-colors shadow-lg hover:shadow-xl mt-2"
              >
                Add to Cart
              </button>

              {/* Description */}
              <div className="border-t border-black/10 pt-5 mt-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {shouldTruncate && !isDescriptionExpanded
                    ? truncatedDescription
                    : productDetails[0]?.description}
                </p>
                {shouldTruncate && (
                  <button
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="text-sm font-medium text-[#E94E8B] hover:text-[#d43e7a] mt-2 transition-colors"
                  >
                    {isDescriptionExpanded ? 'Read Less' : 'Read More'}
                  </button>
                )}
              </div>
            </div>
        </div>
        </div>
      </div>
    </>
    
   
  );
}
