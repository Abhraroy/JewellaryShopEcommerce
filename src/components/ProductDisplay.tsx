'use client';

import { useState } from 'react';
import Image from 'next/image';

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

interface ProductDisplayProps {
  product: ProductData;
}

export default function ProductDisplay({ product }: ProductDisplayProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleQuantityChange = (type: 'increment' | 'decrement') => {
    if (type === 'increment' && quantity < product.stockCount) {
      setQuantity(quantity + 1);
    } else if (type === 'decrement' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    console.log('Added to cart:', {
      product: product.name,
      size: product.sizes[selectedSize],
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

  const descriptionLength = product.description.length;
  const shouldTruncate = descriptionLength > 150;
  const truncatedDescription = shouldTruncate
    ? product.description.substring(0, 150) + '...'
    : product.description;

  return (
    <>
      {/* Mobile Layout (0px - 767px) */}
      <div className="block md:hidden">
        <div className="w-full min-h-screen bg-white p-4 flex flex-col gap-4">
          {/* Product Images Section */}
          <div className="w-full flex flex-col items-center justify-center gap-3">
            {/* Main Image */}
            <div className="w-full aspect-square max-w-[90vw] bg-gray-100 rounded-2xl overflow-hidden relative">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Thumbnail Images */}
            <div className="w-full flex flex-row justify-center gap-2">
              {product.images.map((img, index) => (
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
                    alt={`${product.name} ${index + 1}`}
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
              <h1 className="text-xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-xs text-gray-500 mt-1">SKU: {product.sku}</p>
            </div>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
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
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">
                ₹{product.price}
              </span>
              <span className="text-lg text-gray-400 line-through">
                ₹{product.originalPrice}
              </span>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                {product.discount}% OFF
              </span>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`text-xs font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                {product.inStock ? `In Stock (${product.stockCount} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Product Info Cards */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Material</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">{product.material}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Weight</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">{product.weight}</p>
              </div>
            </div>

            {/* Size Selection */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-900">Select Size</span>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size, index) => (
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
                  : product.description}
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
                  <span className="font-medium text-gray-900">{product.category}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Material</span>
                  <span className="font-medium text-gray-900">{product.material}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Weight</span>
                  <span className="font-medium text-gray-900">{product.weight}</span>
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
                {product.images.map((img, index) => (
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
                      alt={`${product.name} ${index + 1}`}
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
                  src={product.images[selectedImage]}
                  alt={product.name}
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
                    backgroundImage: `url(${product.images[selectedImage]})`,
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
                <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                <p className="text-xs text-gray-500 mt-1">SKU: {product.sku}</p>
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
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
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{product.price}
                </span>
                <span className="text-xl text-gray-400 line-through">
                  ₹{product.originalPrice}
                </span>
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded">
                  {product.discount}% OFF
                </span>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {product.inStock ? `In Stock (${product.stockCount} available)` : 'Out of Stock'}
                </span>
              </div>

              {/* Product Info Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Material</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{product.material}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Weight</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{product.weight}</p>
                </div>
              </div>

              {/* Size Selection */}
              <div className="flex flex-col gap-2">
                <span className="text-base font-semibold text-gray-900">Select Size</span>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size, index) => (
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
                    : product.description}
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
                {product.images.map((img, index) => (
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
                      alt={`${product.name} ${index + 1}`}
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
                  src={product.images[selectedImage]}
                  alt={product.name}
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
                    backgroundImage: `url(${product.images[selectedImage]})`,
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
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <p className="text-sm text-gray-500 mt-2">SKU: {product.sku}</p>
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
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
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-gray-900">
                  ₹{product.price}
                </span>
                <span className="text-2xl text-gray-400 line-through">
                  ₹{product.originalPrice}
                </span>
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded">
                  {product.discount}% OFF
                </span>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {product.inStock ? `In Stock (${product.stockCount} available)` : 'Out of Stock'}
                </span>
              </div>

              {/* Product Info Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500">Material</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{product.material}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500">Weight</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{product.weight}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500">Category</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{product.category}</p>
                </div>
              </div>

              {/* Size Selection */}
              <div className="flex flex-col gap-3">
                <span className="text-lg font-semibold text-gray-900">Select Size</span>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size, index) => (
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
                    : product.description}
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
