"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { getProducts } from "../actions/Product";
import { Category, getCategories } from "../actions/categories";

interface ProductsProps {
  isDarkTheme: boolean;
}

// Icon Components
const PlusIcon = ({ className = "w-5 h-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>
);

const ImageIcon = ({ className = "w-5 h-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
    />
  </svg>
);

const EditIcon = ({ className = "w-4 h-4" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586Z"
    />
  </svg>
);

const DeleteIcon = ({ className = "w-4 h-4" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
    />
  </svg>
);

const LeftArrowIcon = ({ className = "w-4 h-4" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 19.5L8.25 12l7.5-7.5"
    />
  </svg>
);

const RightArrowIcon = ({ className = "w-4 h-4" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.25 4.5l7.5 7.5-7.5 7.5"
    />
  </svg>
);

export default function Products({ isDarkTheme }: ProductsProps) {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    product_name: "",
    description: "",
    category_id: "",
    subcategory_id: "",
    base_price: "",
    discount_percentage: "0",
    final_price: "",
    stock_quantity: "0",
    weight_grams: "",
    thumbnail_image: null as File | string | null,
    size: [] as string[],
  });
  const [products, setProducts] = useState<any[]>([]);
  const [thumbnailImagePreview, setThumbnailImagePreview] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [viewerImages, setViewerImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Categories and their subcategories
  const categories = [
    { value: "ring", label: "Ring" },
    { value: "necklace", label: "Necklace" },
    { value: "earring", label: "Earring" },
    { value: "bracelet", label: "Bracelet" },
    { value: "chain", label: "Chain" },
    { value: "pendant", label: "Pendant" },
    { value: "bangle", label: "Bangle" },
  ];

  const subCategories: { [key: string]: { value: string; label: string }[] } = {
    ring: [
      { value: "hallmark", label: "Hallmark Ring" },
      { value: "american", label: "American Diamond Ring" },
      { value: "gold-plated", label: "Gold Plated Ring" },
      { value: "silver", label: "Silver Ring" },
      { value: "oxidized", label: "Oxidized Ring" },
    ],
    necklace: [
      { value: "hallmark", label: "Hallmark Necklace" },
      { value: "american", label: "American Diamond Necklace" },
      { value: "gold-plated", label: "Gold Plated Necklace" },
      { value: "silver", label: "Silver Necklace" },
      { value: "oxidized", label: "Oxidized Necklace" },
      { value: "choker", label: "Choker Necklace" },
    ],
    earring: [
      { value: "hallmark", label: "Hallmark Earring" },
      { value: "american", label: "American Diamond Earring" },
      { value: "gold-plated", label: "Gold Plated Earring" },
      { value: "silver", label: "Silver Earring" },
      { value: "jhumka", label: "Jhumka" },
      { value: "stud", label: "Stud Earring" },
    ],
    bracelet: [
      { value: "hallmark", label: "Hallmark Bracelet" },
      { value: "american", label: "American Diamond Bracelet" },
      { value: "gold-plated", label: "Gold Plated Bracelet" },
      { value: "silver", label: "Silver Bracelet" },
    ],
    chain: [
      { value: "gold-plated", label: "Gold Plated Chain" },
      { value: "silver", label: "Silver Chain" },
      { value: "stainless-steel", label: "Stainless Steel Chain" },
    ],
    pendant: [
      { value: "hallmark", label: "Hallmark Pendant" },
      { value: "american", label: "American Diamond Pendant" },
      { value: "gold-plated", label: "Gold Plated Pendant" },
    ],
    bangle: [
      { value: "hallmark", label: "Hallmark Bangle" },
      { value: "gold-plated", label: "Gold Plated Bangle" },
      { value: "silver", label: "Silver Bangle" },
    ],
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const result = await getProducts();
      if (!result.success) {
        console.log("error", result.message);
        return;
      } else {
        console.log("products", result.data);
        setProducts(result.data as any[]);
        setCurrentPage(1); // Reset to first page when products are fetched
      }
    };
    fetchProducts();
    const fetchCategories = async () => {
      const result = await getCategories();
      if (result.success && result.data) {
        setCategoriesList(result.data as Category[]);
      }
      else{
        console.error('Failed to fetch categories:', result.error);
        alert(`Failed to load categories: ${result.error}`);
      }
    };
    fetchCategories();
  }, []);



  // Keyboard navigation for image viewer
  useEffect(() => {
    if (!showImageViewer) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setCurrentImageIndex(
          currentImageIndex === 0
            ? viewerImages.length - 1
            : currentImageIndex - 1
        );
      } else if (e.key === "ArrowRight") {
        setCurrentImageIndex(
          currentImageIndex === viewerImages.length - 1
            ? 0
            : currentImageIndex + 1
        );
      } else if (e.key === "Escape") {
        setShowImageViewer(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showImageViewer, currentImageIndex, viewerImages.length]);

  // Pagination calculations
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, last page, current page, and ellipsis
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUploadImages = async (productId: string, files: File[]) => {
    try {
      console.log("Uploading images for product:", productId);
      console.log("Files:", files);
      
      // TODO: Implement image upload functionality
      // This should:
      // 1. Upload images to Cloudflare R2
      // 2. Save image URLs to product_images table in database
      // 3. Refresh the products list
      
      // Placeholder for now
      alert(`Uploading ${files.length} image(s) for product ${productId}. This functionality needs to be implemented.`);
      
      // After successful upload, refresh products
      // const result = await getProducts();
      // if (result.success) {
      //   setProducts(result.data as any[]);
      // }
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images. Please try again.");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        thumbnail_image: file,
      }));
      setThumbnailImagePreview(previewUrl);
    }
  };

  const removeImage = () => {
    if (formData.thumbnail_image) {
      if (formData.thumbnail_image instanceof File) {
        URL.revokeObjectURL(URL.createObjectURL(formData.thumbnail_image));
      }
    }
    setFormData((prev) => ({
      ...prev,
      thumbnail_image: null,
    }));
    setThumbnailImagePreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Product Data:", formData);
    // Handle form submission here
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className={`text-3xl font-bold ${
              isDarkTheme ? "text-white" : "text-gray-900"
            }`}
          >
            Products Management
          </h1>
          <p
            className={`text-sm mt-1 ${
              isDarkTheme ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Manage your jewelry products, categories, and inventory
          </p>
        </div>
        <button
          onClick={() => setShowAddProduct(!showAddProduct)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            isDarkTheme
              ? "bg-[#E94E8B] text-white hover:bg-[#d43d75]"
              : "bg-[#E94E8B] text-white hover:bg-[#d43d75]"
          }`}
        >
          <PlusIcon className="w-5 h-5" />
          {showAddProduct ? "Cancel" : "Add Product"}
        </button>
      </div>

      {/* Add/Edit Product Form */}
      {showAddProduct && (
        <div
          className={`${
            isDarkTheme ? "bg-black border border-gray-700" : "bg-white"
          } rounded-lg shadow-lg p-6 mb-6`}
        >
          <h2
            className={`text-2xl font-bold mb-6 ${
              isDarkTheme ? "text-white" : "text-gray-900"
            }`}
          >
            Add New Product
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="mb-8">
              <h3
                className={`text-lg font-semibold mb-4 ${
                  isDarkTheme ? "text-white" : "text-gray-900"
                }`}
              >
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product Name */}
                <div className="md:col-span-2">
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkTheme ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleInputChange}
                    placeholder="e.g., Riva Bold Pearl 22K Gold Platted Necklace"
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      isDarkTheme
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                    } focus:outline-none focus:ring-2 focus:ring-[#E94E8B]`}
                    required
                    maxLength={255}
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkTheme ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Enter product description..."
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      isDarkTheme
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                    } focus:outline-none focus:ring-2 focus:ring-[#E94E8B]`}
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="mb-8">
              <h3
                className={`text-lg font-semibold mb-4 ${
                  isDarkTheme ? "text-white" : "text-gray-900"
                }`}
              >
                Pricing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkTheme ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Base Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="base_price"
                    value={formData.base_price}
                    onChange={handleInputChange}
                    placeholder="899.00"
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      isDarkTheme
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                    } focus:outline-none focus:ring-2 focus:ring-[#E94E8B]`}
                    required
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkTheme ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Discount Percentage (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="discount_percentage"
                    value={formData.discount_percentage}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      isDarkTheme
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                    } focus:outline-none focus:ring-2 focus:ring-[#E94E8B]`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkTheme ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Final Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="final_price"
                    value={formData.final_price}
                    onChange={handleInputChange}
                    placeholder="549.00"
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      isDarkTheme
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                    } focus:outline-none focus:ring-2 focus:ring-[#E94E8B]`}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="mb-8">
              <h3
                className={`text-lg font-semibold mb-4 ${
                  isDarkTheme ? "text-white" : "text-gray-900"
                }`}
              >
                Categories
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Main Category */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkTheme ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Main Category *
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      isDarkTheme
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:outline-none focus:ring-2 focus:ring-[#E94E8B]`}
                  >
                    <option value="">Select Category</option>
                    {categoriesList.map((cat) => (
                      <option key={cat.category_id} value={cat.category_id}>
                        {cat.category_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sub Category */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkTheme ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Sub Category *
                  </label>
                  <select
                    name="subcategory_id"
                    value={formData.subcategory_id}
                    onChange={handleInputChange}
                    disabled={!formData.category_id}
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      isDarkTheme
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:outline-none focus:ring-2 focus:ring-[#E94E8B] disabled:opacity-50`}
                  >
                    <option value="">Select Sub Category</option>
                    {formData.category_id &&
                      subCategories[formData.category_id]?.map((subCat) => (
                        <option key={subCat.value} value={subCat.value}>
                          {subCat.label}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Product Specifications */}
            <div className="mb-8">
              <h3
                className={`text-lg font-semibold mb-4 ${
                  isDarkTheme ? "text-white" : "text-gray-900"
                }`}
              >
                Product Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkTheme ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Weight (grams)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="weight_grams"
                    value={formData.weight_grams}
                    onChange={handleInputChange}
                    placeholder="15.00"
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      isDarkTheme
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                    } focus:outline-none focus:ring-2 focus:ring-[#E94E8B]`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkTheme ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Size (comma separated)
                  </label>
                  <input
                    type="text"
                    name="size"
                    value={formData.size.join(", ")}
                    onChange={(e) => {
                      const sizes = e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter((s) => s.length > 0);
                      setFormData((prev) => ({ ...prev, size: sizes }));
                    }}
                    placeholder="Small, Medium, Large"
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      isDarkTheme
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                    } focus:outline-none focus:ring-2 focus:ring-[#E94E8B]`}
                  />
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="mb-8">
              <h3
                className={`text-lg font-semibold mb-4 ${
                  isDarkTheme ? "text-white" : "text-gray-900"
                }`}
              >
                Inventory
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkTheme ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    name="stock_quantity"
                    value={formData.stock_quantity}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      isDarkTheme
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                    } focus:outline-none focus:ring-2 focus:ring-[#E94E8B]`}
                  />
                </div>
              </div>
            </div>

            {/* Product Thumbnail Image */}
            <div className="mb-8">
              <h3
                className={`text-lg font-semibold mb-4 ${
                  isDarkTheme ? "text-white" : "text-gray-900"
                }`}
              >
                Thumbnail Image
              </h3>
              {!thumbnailImagePreview ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center ${
                    isDarkTheme ? "border-gray-700" : "border-gray-300"
                  }`}
                >
                  <ImageIcon
                    className={`w-12 h-12 mx-auto mb-4 ${
                      isDarkTheme ? "text-gray-400" : "text-gray-400"
                    }`}
                  />
                  <p
                    className={`mb-2 ${
                      isDarkTheme ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <span className="font-semibold">Click to upload</span> or drag
                    and drop
                  </p>
                  <p
                    className={`text-sm ${
                      isDarkTheme ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    PNG, JPG, WEBP up to 5MB
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="thumbnail-image-upload"
                  />
                  <label
                    htmlFor="thumbnail-image-upload"
                    className="mt-4 inline-block px-4 py-2 bg-[#E94E8B] text-white rounded-lg cursor-pointer hover:bg-[#d43d75] transition-colors"
                  >
                    Select Image
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={thumbnailImagePreview}
                    alt="Thumbnail preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <div
                    className={`mt-2 text-sm ${
                      isDarkTheme ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Image uploaded successfully
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowAddProduct(false)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  isDarkTheme
                    ? "bg-gray-800 text-white hover:bg-gray-700"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#E94E8B] text-white rounded-lg font-medium hover:bg-[#d43d75] transition-colors"
              >
                Add Product
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      <div
        className={`${
          isDarkTheme ? "bg-black border border-gray-700" : "bg-white"
        } rounded-lg shadow p-6`}
      >
        <h2
          className={`text-xl font-semibold mb-4 ${
            isDarkTheme ? "text-white" : "text-gray-900"
          }`}
        >
          All Products
        </h2>
        {products.length <= 0 ? (
          <div
            className={`text-center py-12 ${
              isDarkTheme ? "text-gray-400" : "text-gray-500"
            }`}
          >
            No products added yet. Click "Add Product" to create your first
            product.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-full">
              <thead>
                <tr>
                  <th
                    className={`text-center py-3 px-4 font-semibold text-sm border whitespace-nowrap ${
                      isDarkTheme
                        ? "border-gray-700 text-gray-300 bg-gray-800"
                        : "border-gray-300 text-gray-700 bg-gray-50"
                    }`}
                  >
                    Product Name
                  </th>
                  <th
                    className={`text-center py-3 px-4 font-semibold text-sm border whitespace-nowrap ${
                      isDarkTheme
                        ? "border-gray-700 text-gray-300 bg-gray-800"
                        : "border-gray-300 text-gray-700 bg-gray-50"
                    }`}
                  >
                    Category
                  </th>
                  <th
                    className={`text-center py-3 px-4 font-semibold text-sm border whitespace-nowrap ${
                      isDarkTheme
                        ? "border-gray-700 text-gray-300 bg-gray-800"
                        : "border-gray-300 text-gray-700 bg-gray-50"
                    }`}
                  >
                    Sub Category
                  </th>
                  <th
                    className={`text-center py-3 px-4 font-semibold text-sm border whitespace-nowrap ${
                      isDarkTheme
                        ? "border-gray-700 text-gray-300 bg-gray-800"
                        : "border-gray-300 text-gray-700 bg-gray-50"
                    }`}
                  >
                    Base Price
                  </th>
                  <th
                    className={`text-center py-3 px-4 font-semibold text-sm border whitespace-nowrap ${
                      isDarkTheme
                        ? "border-gray-700 text-gray-300 bg-gray-800"
                        : "border-gray-300 text-gray-700 bg-gray-50"
                    }`}
                  >
                    Final Price
                  </th>
                  <th
                    className={`text-center py-3 px-4 font-semibold text-sm border whitespace-nowrap ${
                      isDarkTheme
                        ? "border-gray-700 text-gray-300 bg-gray-800"
                        : "border-gray-300 text-gray-700 bg-gray-50"
                    }`}
                  >
                    Stock Quantity
                  </th>
                  <th
                    className={`text-center py-3 px-4 font-semibold text-sm border whitespace-nowrap ${
                      isDarkTheme
                        ? "border-gray-700 text-gray-300 bg-gray-800"
                        : "border-gray-300 text-gray-700 bg-gray-50"
                    }`}
                  >
                    Description
                  </th>
                  <th
                    className={`text-center py-3 px-4 font-semibold text-sm border whitespace-nowrap ${
                      isDarkTheme
                        ? "border-gray-700 text-gray-300 bg-gray-800"
                        : "border-gray-300 text-gray-700 bg-gray-50"
                    }`}
                  >
                    Weight (grams)
                  </th>
                  <th
                    className={`text-center py-3 px-4 font-semibold text-sm border whitespace-nowrap ${
                      isDarkTheme
                        ? "border-gray-700 text-gray-300 bg-gray-800"
                        : "border-gray-300 text-gray-700 bg-gray-50"
                    }`}
                  >
                    Size
                  </th>
                  <th
                    className={`text-center py-3 px-4 font-semibold text-sm border whitespace-nowrap ${
                      isDarkTheme
                        ? "border-gray-700 text-gray-300 bg-gray-800"
                        : "border-gray-300 text-gray-700 bg-gray-50"
                    }`}
                  >
                    Thumbnail Image
                  </th>
                  <th
                    className={`text-center py-3 px-4 font-semibold text-sm border whitespace-nowrap ${
                      isDarkTheme
                        ? "border-gray-700 text-gray-300 bg-gray-800"
                        : "border-gray-300 text-gray-700 bg-gray-50"
                    }`}
                  >
                    More Images
                  </th>
                  <th
                    className={`text-center py-3 px-4 font-semibold text-sm border whitespace-nowrap ${
                      isDarkTheme
                        ? "border-gray-700 text-gray-300 bg-gray-800"
                        : "border-gray-300 text-gray-700 bg-gray-50"
                    }`}
                  >
                    Upload Images
                  </th>
                  <th
                    className={`text-center py-3 px-4 font-semibold text-sm border whitespace-nowrap ${
                      isDarkTheme
                        ? "border-gray-700 text-gray-300 bg-gray-800"
                        : "border-gray-300 text-gray-700 bg-gray-50"
                    }`}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product) => (
                  <tr
                    key={product.product_id}
                    className={`border-b ${
                      isDarkTheme
                        ? "border-gray-700 hover:bg-gray-800"
                        : "border-gray-200 hover:bg-gray-50"
                    } transition-colors`}
                  >
                    <td
                      className={`text-center py-3 px-4 border whitespace-nowrap ${
                        isDarkTheme
                          ? "border-gray-700 text-gray-300"
                          : "border-gray-300 text-gray-900"
                      }`}
                    >
                      {product.product_name}
                    </td>
                    <td
                      className={`text-center py-3 px-4 border whitespace-nowrap ${
                        isDarkTheme
                          ? "border-gray-700 text-gray-300"
                          : "border-gray-300 text-gray-900"
                      }`}
                    >
                      {product.categories?.category_name || "—"}
                    </td>
                    <td
                      className={`text-center py-3 px-4 border whitespace-nowrap ${
                        isDarkTheme
                          ? "border-gray-700 text-gray-300"
                          : "border-gray-300 text-gray-900"
                      }`}
                    >
                      {product.sub_categories?.subcategory_name || "—"}
                    </td>
                    <td
                      className={`text-center py-3 px-4 border whitespace-nowrap ${
                        isDarkTheme
                          ? "border-gray-700 text-gray-300"
                          : "border-gray-300 text-gray-900"
                      }`}
                    >
                      ₹{product.base_price}
                    </td>
                    <td
                      className={`text-center py-3 px-4 border whitespace-nowrap ${
                        isDarkTheme
                          ? "border-gray-700 text-gray-300"
                          : "border-gray-300 text-gray-900"
                      }`}
                    >
                      ₹{product.final_price}
                    </td>
                    <td
                      className={`text-center py-3 px-4 border whitespace-nowrap ${
                        isDarkTheme
                          ? "border-gray-700 text-gray-300"
                          : "border-gray-300 text-gray-900"
                      }`}
                    >
                      {product.stock_quantity}
                    </td>
                    <td
                      className={`text-center py-3 px-4 border ${
                        isDarkTheme
                          ? "border-gray-700 text-gray-300"
                          : "border-gray-300 text-gray-900"
                      }`}
                    >
                      <div
                        className="max-w-xs mx-auto truncate"
                        title={product.description || ""}
                      >
                        {product.description || "—"}
                      </div>
                    </td>
                    <td
                      className={`text-center py-3 px-4 border whitespace-nowrap ${
                        isDarkTheme
                          ? "border-gray-700 text-gray-300"
                          : "border-gray-300 text-gray-900"
                      }`}
                    >
                      {product.weight_grams ? `${product.weight_grams}g` : "—"}
                    </td>
                    <td
                      className={`text-center py-3 px-4 border whitespace-nowrap ${
                        isDarkTheme
                          ? "border-gray-700 text-gray-300"
                          : "border-gray-300 text-gray-900"
                      }`}
                    >
                      {product.size && product.size.length > 0 ? (
                        <div className="flex flex-wrap gap-1 justify-center">
                          {product.size.map((size: string, index: number) => (
                            <span
                              key={index}
                              className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                isDarkTheme
                                  ? "bg-gray-700 text-gray-200"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {size}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span
                          className={`text-sm ${
                            isDarkTheme ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          —
                        </span>
                      )}
                    </td>
                    <td
                      className={`text-center py-3 px-4 border whitespace-nowrap ${
                        isDarkTheme
                          ? "border-gray-700 text-gray-300"
                          : "border-gray-300 text-gray-900"
                      }`}
                    >
                      {product.thumbnail_image ? (
                        <a
                          href={product.thumbnail_image}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-blue-500 hover:text-blue-700 underline ${
                            isDarkTheme ? "text-blue-400 hover:text-blue-300" : ""
                          }`}
                        >
                          View Image
                        </a>
                      ) : (
                        <span
                          className={`text-sm ${
                            isDarkTheme ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          No image
                        </span>
                      )}
                    </td>
                    <td
                      className={`text-center py-3 px-4 border whitespace-nowrap ${
                        isDarkTheme
                          ? "border-gray-700 text-gray-300"
                          : "border-gray-300 text-gray-900"
                      }`}
                    >
                      {product.product_images && product.product_images.length > 0 ? (
                        <button
                          onClick={() => {
                            // Extract image URLs from product_images array
                            const imageUrls = product.product_images.map(
                              (img: any) => img.image_url || img
                            );
                            setViewerImages(imageUrls);
                            setCurrentImageIndex(0);
                            setShowImageViewer(true);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            isDarkTheme
                              ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                          title={`View ${product.product_images.length} more image(s)`}
                        >
                          View ({product.product_images.length})
                        </button>
                      ) : (
                        <span
                          className={`text-sm ${
                            isDarkTheme ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          No images
                        </span>
                      )}
                    </td>
                    <td
                      className={`text-center py-3 px-4 border whitespace-nowrap ${
                        isDarkTheme
                          ? "border-gray-700 text-gray-300"
                          : "border-gray-300 text-gray-900"
                      }`}
                    >
                      <label
                        htmlFor={`upload-images-${product.product_id}`}
                        className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                          isDarkTheme
                            ? "bg-[#E94E8B] hover:bg-[#d43d75] text-white"
                            : "bg-[#E94E8B] hover:bg-[#d43d75] text-white"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-4 h-4 mr-1.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5m0 0l-4.5-4.5m4.5 4.5l4.5-4.5"
                          />
                        </svg>
                        Upload
                      </label>
                      <input
                        type="file"
                        id={`upload-images-${product.product_id}`}
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files && files.length > 0) {
                            handleUploadImages(product.product_id, Array.from(files));
                          }
                        }}
                      />
                    </td>
                    <td
                      className={`text-center py-3 px-4 border whitespace-nowrap ${
                        isDarkTheme
                          ? "border-gray-700 text-gray-300"
                          : "border-gray-300 text-gray-900"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            // TODO: Implement edit functionality
                            console.log("Edit product:", product.product_id);
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            isDarkTheme
                              ? "hover:bg-gray-700 text-gray-300 hover:text-white"
                              : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                          }`}
                          title="Edit"
                        >
                          <EditIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            // TODO: Implement delete functionality
                            console.log("Delete product:", product.product_id);
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            isDarkTheme
                              ? "hover:bg-red-900 text-red-400 hover:text-red-300"
                              : "hover:bg-red-50 text-red-600 hover:text-red-700"
                          }`}
                          title="Delete"
                        >
                          <DeleteIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-end items-center gap-2 mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === 1
                  ? isDarkTheme
                    ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : isDarkTheme
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700 hover:text-gray-900"
              }`}
              title="Previous page"
            >
              <LeftArrowIcon className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, index) => {
                if (page === "...") {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className={`px-2 py-1 ${
                        isDarkTheme ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      ...
                    </span>
                  );
                }
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page as number)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? isDarkTheme
                          ? "bg-[#E94E8B] text-white"
                          : "bg-[#E94E8B] text-white"
                        : isDarkTheme
                        ? "bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700 hover:text-gray-900"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === totalPages
                  ? isDarkTheme
                    ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : isDarkTheme
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700 hover:text-gray-900"
              }`}
              title="Next page"
            >
              <RightArrowIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Image Viewer Modal */}
      {showImageViewer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setShowImageViewer(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Modal Content */}
          <div
            className={`relative z-10 max-w-7xl w-full mx-4 ${
              isDarkTheme ? "bg-gray-900" : "bg-white"
            } rounded-lg shadow-2xl overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className={`flex items-center justify-between p-4 border-b ${
                isDarkTheme ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <h3
                className={`text-lg font-semibold ${
                  isDarkTheme ? "text-white" : "text-gray-900"
                }`}
              >
                Product Images ({currentImageIndex + 1} / {viewerImages.length})
              </h3>
              <button
                onClick={() => setShowImageViewer(false)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkTheme
                    ? "hover:bg-gray-700 text-gray-300 hover:text-white"
                    : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                }`}
                title="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Image Container */}
            <div className="relative flex items-center justify-center p-8 min-h-[60vh]">
              {/* Previous Button */}
              {viewerImages.length > 1 && (
                <button
                  onClick={() =>
                    setCurrentImageIndex(
                      currentImageIndex === 0
                        ? viewerImages.length - 1
                        : currentImageIndex - 1
                    )
                  }
                  className={`absolute left-4 p-3 rounded-full transition-colors ${
                    isDarkTheme
                      ? "bg-gray-800 hover:bg-gray-700 text-white"
                      : "bg-white hover:bg-gray-100 text-gray-900 shadow-lg"
                  }`}
                  title="Previous image"
                >
                  <LeftArrowIcon className="w-6 h-6" />
                </button>
              )}

              {/* Main Image */}
              <img
                src={viewerImages[currentImageIndex]}
                alt={`Product image ${currentImageIndex + 1}`}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />

              {/* Next Button */}
              {viewerImages.length > 1 && (
                <button
                  onClick={() =>
                    setCurrentImageIndex(
                      currentImageIndex === viewerImages.length - 1
                        ? 0
                        : currentImageIndex + 1
                    )
                  }
                  className={`absolute right-4 p-3 rounded-full transition-colors ${
                    isDarkTheme
                      ? "bg-gray-800 hover:bg-gray-700 text-white"
                      : "bg-white hover:bg-gray-100 text-gray-900 shadow-lg"
                  }`}
                  title="Next image"
                >
                  <RightArrowIcon className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {viewerImages.length > 1 && (
              <div
                className={`p-4 border-t ${
                  isDarkTheme ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-center gap-2 overflow-x-auto">
                  {viewerImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 transition-all ${
                        currentImageIndex === index
                          ? "ring-2 ring-[#E94E8B]"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-lg border-2 border-transparent"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Keyboard Navigation Info */}
            {viewerImages.length > 1 && (
              <div
                className={`px-4 py-2 text-center text-xs ${
                  isDarkTheme ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Use arrow keys to navigate • Click outside to close
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
