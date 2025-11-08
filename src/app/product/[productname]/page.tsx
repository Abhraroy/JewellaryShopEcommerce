'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

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
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleQuantityChange = (type: 'increment' | 'decrement') => {
    if (type === 'increment' && quantity < demoProduct.stockCount) {
      setQuantity(quantity + 1);
    } else if (type === 'decrement' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    console.log('Added to cart:', {
      product: demoProduct.name,
      size: demoProduct.sizes[selectedSize],
      quantity,
    });
    // Add cart functionality here
  };

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

  const descriptionLength = demoProduct.description.length;
  const shouldTruncate = descriptionLength > 150;
  const truncatedDescription = shouldTruncate 
    ? demoProduct.description.substring(0, 150) + '...'
    : demoProduct.description;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar cartCount={3} isAuthenticated={false} />

       {/* Mobile Layout (0px - 767px) */}
       <div className="block md:hidden">
        <div className="w-full min-h-screen bg-white p-4 flex flex-col gap-4">
           {/* Product Images Section */}
          <div className="w-full flex flex-col items-center justify-center gap-3">
            {/* Main Image */}
            <div className="w-full aspect-square max-w-[90vw] bg-gray-100 rounded-2xl overflow-hidden relative">
              <Image
                src={demoProduct.images[selectedImage]}
                alt={demoProduct.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Thumbnail Images */}
            <div className="w-full flex flex-row justify-center gap-2">
              {demoProduct.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-[#E94E8B] scale-105'
                      : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${demoProduct.name} ${index + 1}`}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </button>
               ))}
             </div>
           </div>

          {/* Product Details Section */}
          <div className="w-full pt-2 flex flex-col gap-3">
            {/* Product Name */}
            <div>
              <h1 className="text-xl font-bold text-gray-900">{demoProduct.name}</h1>
              <p className="text-xs text-gray-500 mt-1">SKU: {demoProduct.sku}</p>
            </div>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(demoProduct.rating)
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
              <span className="text-xs text-gray-600">
                {demoProduct.rating} ({demoProduct.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">
                ₹{demoProduct.price}
              </span>
              <span className="text-lg text-gray-400 line-through">
                ₹{demoProduct.originalPrice}
              </span>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                {demoProduct.discount}% OFF
              </span>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${demoProduct.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`text-xs font-medium ${demoProduct.inStock ? 'text-green-600' : 'text-red-600'}`}>
                {demoProduct.inStock ? `In Stock (${demoProduct.stockCount} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Product Info Cards */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Material</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">{demoProduct.material}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Weight</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">{demoProduct.weight}</p>
              </div>
            </div>

            {/* Size Selection */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-900">Select Size</span>
              <div className="flex flex-wrap gap-2">
                {demoProduct.sizes.map((size, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSize(index)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedSize === index
                        ? 'bg-[#E94E8B] text-white'
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
              onClick={handleAddToCart}
              className="w-full h-12 text-base font-semibold bg-[#E94E8B] text-white rounded-lg hover:bg-[#d43e7a] transition-colors shadow-md hover:shadow-lg"
            >
              Add to Cart
            </button>

            {/* Description */}
            <div className="border-t pt-4 mt-2">
              <h3 className="text-base font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {shouldTruncate && !isDescriptionExpanded 
                  ? truncatedDescription 
                  : demoProduct.description}
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

            {/* Additional Info */}
            <div className="border-t pt-4 space-y-2">
              <h3 className="text-base font-semibold text-gray-900">Product Details</h3>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium text-gray-900">{demoProduct.category}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Material</span>
                  <span className="font-medium text-gray-900">{demoProduct.material}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Weight</span>
                  <span className="font-medium text-gray-900">{demoProduct.weight}</span>
                </div>
              </div>
            </div>
          </div>
         </div>
       </div>

       {/* Tablet Layout (768px - 1365px) */}
       <div className="hidden md:block xl:hidden">
        <div className="w-full min-h-screen bg-white p-8 flex flex-col gap-8">
          <div className="flex flex-row gap-8">
           {/* Product Images Section */}
            <div className="w-1/2 flex flex-row gap-4">
              {/* Thumbnail Images */}
              <div className="flex flex-col gap-3">
                {demoProduct.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-[#E94E8B] scale-105'
                        : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${demoProduct.name} ${index + 1}`}
                      width={80}
                      height={80}
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
                  src={demoProduct.images[selectedImage]}
                  alt={demoProduct.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            {/* Zoom Layer - Outside container to avoid clipping */}
            {showZoom && (
              <div 
                className="fixed pointer-events-none w-48 h-48 border-2 border-white shadow-2xl rounded-xl overflow-hidden"
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
                    backgroundImage: `url(${demoProduct.images[selectedImage]})`,
                    backgroundSize: '250%',
                    backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    backgroundRepeat: 'no-repeat',
                  }}
                />
              </div>
            )}

            {/* Product Details Section */}
            <div className="w-1/2 flex flex-col gap-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {/* Product Name */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{demoProduct.name}</h1>
                <p className="text-xs text-gray-500 mt-1">SKU: {demoProduct.sku}</p>
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(demoProduct.rating)
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
                <span className="text-xs text-gray-600">
                  {demoProduct.rating} ({demoProduct.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{demoProduct.price}
                </span>
                <span className="text-xl text-gray-400 line-through">
                  ₹{demoProduct.originalPrice}
                </span>
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded">
                  {demoProduct.discount}% OFF
                </span>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${demoProduct.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`text-sm font-medium ${demoProduct.inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {demoProduct.inStock ? `In Stock (${demoProduct.stockCount} available)` : 'Out of Stock'}
                </span>
              </div>

              {/* Product Info Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Material</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{demoProduct.material}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Weight</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{demoProduct.weight}</p>
                </div>
              </div>

              {/* Size Selection */}
              <div className="flex flex-col gap-2">
                <span className="text-base font-semibold text-gray-900">Select Size</span>
                <div className="flex flex-wrap gap-2">
                  {demoProduct.sizes.map((size, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSize(index)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedSize === index
                          ? 'bg-[#E94E8B] text-white'
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
                onClick={handleAddToCart}
                className="w-full h-12 text-base font-semibold bg-[#E94E8B] text-white rounded-lg hover:bg-[#d43e7a] transition-colors shadow-md hover:shadow-lg mt-2"
              >
                Add to Cart
              </button>

              {/* Description */}
              <div className="border-t pt-4 mt-2">
                <h3 className="text-base font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {shouldTruncate && !isDescriptionExpanded 
                    ? truncatedDescription 
                    : demoProduct.description}
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

       {/* Desktop Layout (1366px+) */}
      <div className="hidden xl:block">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex flex-row gap-12">
            {/* Product Images Section */}
            <div className="w-1/2 flex flex-row gap-6 sticky top-24 h-fit">
              {/* Thumbnail Images */}
              <div className="flex flex-col gap-4">
                {demoProduct.images.map((img, index) => (
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
                      src={img}
                      alt={`${demoProduct.name} ${index + 1}`}
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
                  src={demoProduct.images[selectedImage]}
                  alt={demoProduct.name}
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
                    backgroundImage: `url(${demoProduct.images[selectedImage]})`,
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
                <h1 className="text-3xl font-bold text-gray-900">{demoProduct.name}</h1>
                <p className="text-sm text-gray-500 mt-2">SKU: {demoProduct.sku}</p>
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(demoProduct.rating)
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
                  {demoProduct.rating} ({demoProduct.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-gray-900">
                  ₹{demoProduct.price}
                </span>
                <span className="text-2xl text-gray-400 line-through">
                  ₹{demoProduct.originalPrice}
                </span>
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded">
                  {demoProduct.discount}% OFF
                </span>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${demoProduct.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`text-sm font-medium ${demoProduct.inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {demoProduct.inStock ? `In Stock (${demoProduct.stockCount} available)` : 'Out of Stock'}
                </span>
              </div>

              {/* Product Info Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500">Material</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{demoProduct.material}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500">Weight</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{demoProduct.weight}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500">Category</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{demoProduct.category}</p>
                </div>
              </div>

              {/* Size Selection */}
              <div className="flex flex-col gap-3">
                <span className="text-lg font-semibold text-gray-900">Select Size</span>
                <div className="flex flex-wrap gap-2">
                  {demoProduct.sizes.map((size, index) => (
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
                onClick={handleAddToCart}
                className="w-full h-14 text-lg font-semibold bg-[#E94E8B] text-white rounded-lg hover:bg-[#d43e7a] transition-colors shadow-lg hover:shadow-xl mt-2"
              >
                Add to Cart
              </button>

              {/* Description */}
              <div className="border-t pt-5 mt-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {shouldTruncate && !isDescriptionExpanded 
                    ? truncatedDescription 
                    : demoProduct.description}
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

      <Footer />
    </div>
  );
}
