"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

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

export default function ProductDisplay({
  productDetails,
}: {
  productDetails: any;
}) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [shouldTruncate, setShouldTruncate] = useState(false);
  const [truncatedDescription, setTruncatedDescription] = useState("");
  console.log(productDetails);

  const product = productDetails?.[0];
  const productImages = product?.product_images ?? [];
  const selectedImageUrl =
    productImages[selectedImage]?.image_url ??
    productImages[0]?.image_url ??
    "/placeholder.png";
  const reviewStats = product?.reviews?.[0];

  useEffect(() => {
    const description = productDetails?.[0]?.description ?? "";
    if (description.length > 150) {
      setShouldTruncate(true);
      setTruncatedDescription(description.substring(0, 150) + "...");
    } else {
      setShouldTruncate(false);
      setTruncatedDescription(description);
    }
  }, [productDetails]);

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
      y: yPercent,
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
      {/* Mobile Layout (0px - 767px) */}
      <>
        <div className="block md:hidden">
          <div className="flex min-h-screen w-full flex-col gap-4 bg-white p-4">
            {/* Product Images Section */}
            <div className="flex w-full flex-col items-center justify-center gap-3">
              {/* Main Image */}
              <div className="relative aspect-square w-full max-w-[90vw] overflow-hidden rounded-2xl bg-gray-100">
                <Image
                  src={
                    productImages[selectedImage]?.image_url
                  }
                  alt={productImages[selectedImage]?.image_url}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Thumbnail Images */}
              <div className="flex w-full flex-row justify-center gap-2">
                {productDetails[0]?.product_images?.map(
                  (img: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`h-16 w-16 overflow-hidden rounded-lg border-2 transition-all ${
                        selectedImage === index
                          ? "border-[#E94E8B] scale-105"
                          : "border-gray-200"
                      }`}
                    >
                      <Image
                        src={img.image_url}
                        alt={`${img.image_url} ${index + 1}`}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Product Details Section */}
            <div className="flex w-full flex-col gap-3 pt-2">
              {/* Product Name */}
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {productDetails[0]?.product_name}
                </h1>
                <p className="mt-1 text-xs text-gray-500">
                  SKU: {productDetails[0]?.sku}
                </p>
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-4 w-4 ${
                        i <
                        Math.floor(
                          productDetails[0]?.reviews?.[0]?.rating ?? 0
                        )
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-gray-600">
                  {productDetails[0]?.reviews?.[0]?.rating ?? "0"} (
                  {productDetails[0]?.reviews?.[0]?.reviews ?? "0"} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  ₹{productDetails[0]?.final_price}
                </span>
                <span className="text-lg text-gray-400 line-through">
                  ₹{productDetails[0]?.base_price}
                </span>
                {typeof productDetails[0]?.discount_percentage === "number" && (
                  <span className="rounded bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                    {productDetails[0]?.discount_percentage}% OFF
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    (productDetails[0]?.stock_quantity ?? 0) > 0
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                ></div>
                <span
                  className={`text-xs font-medium ${
                    (productDetails[0]?.stock_quantity ?? 0) > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {(productDetails[0]?.stock_quantity ?? 0) > 0
                    ? `In Stock (${productDetails[0]?.stock_quantity} available)`
                    : "Out of Stock"}
                </span>
              </div>

              {/* Product Info Cards */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Material</p>
                  <p className="mt-0.5 text-sm font-semibold text-gray-900">
                    {productDetails[0]?.metal_type ?? "--"}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Category</p>
                  <p className="mt-0.5 text-sm font-semibold text-gray-900">
                    {productDetails[0]?.categories?.category_name ?? "--"}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Weight</p>
                  <p className="mt-0.5 text-sm font-semibold text-gray-900">
                    {productDetails[0]?.weight_grams ?? "--"} grams
                  </p>
                </div>
              </div>

              {/* Size Selection */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  Select Size
                </span>
                <div className="flex flex-wrap gap-2">
                  {productDetails[0]?.size?.map((size: any, index: number) => (
                    <button
                      type="button"
                      key={index}
                      onClick={() => setSelectedSize(index)}
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                        selectedSize === index
                          ? "bg-[#E94E8B] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                className="h-12 w-full rounded-lg bg-[#E94E8B] text-base font-semibold text-white shadow-md transition-colors hover:bg-[#d43e7a] hover:shadow-lg"
              >
                Add to Cart
              </button>

              {/* Description */}
              <div className="mt-2 border-t pt-4">
                <h3 className="mb-2 text-base font-semibold text-gray-900">
                  Description
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {shouldTruncate && !isDescriptionExpanded
                    ? truncatedDescription
                    : productDetails[0]?.description}
                </p>
                {shouldTruncate && (
                  <button
                    onClick={() =>
                      setIsDescriptionExpanded(!isDescriptionExpanded)
                    }
                    className="mt-2 text-sm font-medium text-[#E94E8B] transition-colors hover:text-[#d43e7a]"
                  >
                    {isDescriptionExpanded ? "Read Less" : "Read More"}
                  </button>
                )}
              </div>

              {/* Additional Info */}
              <div className="space-y-2 border-t pt-4">
                <h3 className="text-base font-semibold text-gray-900">
                  Product Details
                </h3>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Category</span>
                    <span className="font-medium text-gray-900">
                      {productDetails[0]?.categories?.category_name ?? "--"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Material</span>
                    <span className="font-medium text-gray-900">
                      {productDetails[0]?.metal_type ?? "--"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Weight</span>
                    <span className="font-medium text-gray-900">
                      {productDetails[0]?.weight_grams ?? "--"} grams
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
      {/* Tablet Layout (768px - 1365px) */}
      <div className="hidden md:block xl:hidden">
        <div className="flex min-h-screen w-full flex-col gap-8 bg-white p-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Product Images Section */}
            <div className="flex w-full flex-col gap-4 lg:w-1/2 lg:flex-row">
              {/* Thumbnail Images */}
              <div className="flex flex-row gap-3 overflow-x-auto pb-1 lg:flex-col lg:overflow-x-visible lg:pb-0">
                {productImages.map((img: any, index: number) => (
                  <button
                    key={img.review_image_id ?? index}
                    onClick={() => setSelectedImage(index)}
                    className={`h-20 w-20 overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImage === index
                        ? "border-[#E94E8B] scale-105"
                        : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={img.image_url}
                      alt={`${img.image_url} ${index + 1}`}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
              {/* Main Image */}
              <div
                className="relative aspect-square flex-1 overflow-hidden rounded-2xl bg-gray-100"
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Image
                  src={productImages[selectedImage]?.image_url}
                  alt={productImages[selectedImage]?.image_url}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            {/* Zoom Layer - Outside container to avoid clipping */}
            {showZoom && (
              <div
                className="fixed h-48 w-48 rounded-xl border-2 border-white shadow-2xl overflow-hidden pointer-events-none"
                style={{
                  left: `${mousePosition.x}px`,
                  top: `${mousePosition.y}px`,
                  transform: "translate(-50%, -50%)",
                  zIndex: 9999,
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${productImages[selectedImage]?.image_url})`,
                    backgroundSize: "250%",
                    backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    backgroundRepeat: "no-repeat",
                  }}
                />
              </div>
            )}

            {/* Product Details Section */}
            <div className="flex w-full flex-col gap-4 lg:w-1/2">
              {/* Product Name */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {product?.product_name}
                </h1>
                <p className="mt-1 text-xs text-gray-500">SKU: {product?.sku}</p>
                {product?.categories?.category_name && (
                  <p className="mt-1 text-xs text-gray-500">
                    {product.categories.category_name}
                  </p>
                )}
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(reviewStats?.rating ?? 0)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-gray-600">
                  {reviewStats?.rating ?? "0"} (
                  {reviewStats?.reviews ?? "0"} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{product?.final_price}
                </span>
                <span className="text-xl text-gray-400 line-through">
                  ₹{product?.base_price}
                </span>
                {typeof product?.discount_percentage === "number" && (
                  <span className="rounded bg-green-50 px-2.5 py-1 text-sm font-semibold text-green-600">
                    {product.discount_percentage}% OFF
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    (product?.stock_quantity ?? 0) > 0
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                ></div>
                <span
                  className={`text-sm font-medium ${
                    (product?.stock_quantity ?? 0) > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {(product?.stock_quantity ?? 0) > 0
                    ? `In Stock (${product?.stock_quantity} available)`
                    : "Out of Stock"}
                </span>
              </div>

              {/* Product Info Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Material</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {product?.metal_type ?? "--"}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Weight</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {product?.weight_grams ?? "--"} grams
                  </p>
                </div>
              </div>

              {/* Size Selection */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  Select Size
                </span>
                <div className="flex flex-wrap gap-2">
                  {product?.size?.map((size: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSize(index)}
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                        selectedSize === index
                          ? "bg-[#E94E8B] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                className="mt-2 h-12 w-full rounded-lg bg-[#E94E8B] text-base font-semibold text-white shadow-md transition-colors hover:bg-[#d43e7a] hover:shadow-lg"
              >
                Add to Cart
              </button>

              {/* Description */}
              <div className="mt-2 border-t pt-4">
                <h3 className="mb-2 text-base font-semibold text-gray-900">
                  Description
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {shouldTruncate && !isDescriptionExpanded
                    ? truncatedDescription
                    : product?.description}
                </p>
                {shouldTruncate && (
                  <button
                    onClick={() =>
                      setIsDescriptionExpanded(!isDescriptionExpanded)
                    }
                    className="mt-2 text-sm font-medium text-[#E94E8B] transition-colors hover:text-[#d43e7a]"
                  >
                    {isDescriptionExpanded ? "Read Less" : "Read More"}
                  </button>
                )}
              </div>

              {/* Additional Info */}
              <div className="space-y-2 border-t pt-4">
                <h3 className="text-base font-semibold text-gray-900">
                  Product Details
                </h3>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category</span>
                    <span className="font-medium text-gray-900">
                      {product?.categories?.category_name ?? "--"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Material</span>
                    <span className="font-medium text-gray-900">
                      {product?.metal_type ?? "--"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight</span>
                    <span className="font-medium text-gray-900">
                      {product?.weight_grams ?? "--"} grams
                    </span>
                  </div>
                </div>
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
                {productDetails[0]?.product_images.map(
                  (img: any, index: any) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? "border-[#E94E8B] scale-105"
                          : "border-gray-200"
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
                  )
                )}
              </div>
              {/* Main Image */}
              <div
                className="flex-1 aspect-square bg-gray-100 rounded-2xl overflow-hidden relative cursor-crosshair"
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Image
                  src={productDetails[0]?.product_images[selectedImage]?.image_url}
                  alt={productDetails[0]?.product_images[selectedImage]?.image_url}
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
                  transform: "translate(-50%, -50%)",
                  zIndex: 9999,
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${productDetails[0]?.product_images[selectedImage]?.image_url})`,
                    backgroundSize: "250%",
                    backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    backgroundRepeat: "no-repeat",
                  }}
                />
              </div>
            )}

            {/* Product Details Section */}
            <div className="w-1/2 flex flex-col gap-4">
              {/* Product Name */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {productDetails[0]?.product_name}
                </h1>
                <p className="text-sm text-gray-500 mt-2">
                  {productDetails[0]?.categories?.category_name}
                </p>
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(productDetails[0]?.reviews[0]?.rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {productDetails[0]?.reviews[0]?.rating} (
                  {productDetails[0]?.reviews[0]?.reviews} reviews)
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
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    productDetails[0]?.stock_quantity > 0
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                ></div>
                <span
                  className={`text-sm font-medium ${
                    productDetails[0]?.stock_quantity > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {productDetails[0]?.stock_quantity > 0
                    ? `In Stock (${productDetails[0]?.stock_quantity} available)`
                    : "Out of Stock"}
                </span>
              </div>

              {/* Product Info Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-200 p-4 rounded-lg">
                  <p className="text-xs text-gray-500">Material</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {productDetails[0]?.metal_type}
                  </p>
                </div>
                <div className="bg-gray-200 p-4 rounded-lg">
                  <p className="text-xs text-gray-500">Weight</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {productDetails[0]?.weight_grams} grams
                  </p>
                </div>
                <div className="bg-gray-200 p-4 rounded-lg">
                  <p className="text-xs text-gray-500">Category</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {productDetails[0]?.categories.category_name}
                  </p>
                </div>
              </div>

              {/* Size Selection */}
              <div className="flex flex-col gap-3">
                <span className="text-lg font-semibold text-gray-900">
                  Select Size
                </span>
                <div className="flex flex-wrap gap-2">
                  {productDetails[0]?.size && productDetails[0]?.size.length > 0 && productDetails[0]?.size.map((size: any, index: any) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSize(index)}
                      className={`px-5 py-2.5 rounded-lg font-medium text-base transition-all ${
                        selectedSize === index
                          ? "bg-[#E94E8B] text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Description
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {shouldTruncate && !isDescriptionExpanded
                    ? truncatedDescription
                    : productDetails[0]?.description}
                </p>
                {shouldTruncate && (
                  <button
                    onClick={() =>
                      setIsDescriptionExpanded(!isDescriptionExpanded)
                    }
                    className="text-sm font-medium text-[#E94E8B] hover:text-[#d43e7a] mt-2 transition-colors"
                  >
                    {isDescriptionExpanded ? "Read Less" : "Read More"}
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
