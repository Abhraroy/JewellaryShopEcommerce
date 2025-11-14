'use client';

import React, { useState } from 'react';

interface ProductsProps {
  isDarkTheme: boolean;
}

// Icon Components
const PlusIcon = ({ className = 'w-5 h-5' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const ImageIcon = ({ className = 'w-5 h-5' }) => (
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



export default function Products({ isDarkTheme }: ProductsProps) {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    price: '',
    originalPrice: '',
    description: '',
    category: '',
    subCategory: '',
    images: [] as string[],
    inStock: true,
    stockQuantity: '',
    sku: '',
    weight: '',
    material: '',
    plating: '',
    stoneType: '',
    warranty: '',
    waterproof: false,
    tarnishFree: false,
    tags: '',
    size:[] as string[],
  });

  // Categories and their subcategories
  const categories = [
    { value: 'ring', label: 'Ring' },
    { value: 'necklace', label: 'Necklace' },
    { value: 'earring', label: 'Earring' },
    { value: 'bracelet', label: 'Bracelet' },
    { value: 'chain', label: 'Chain' },
    { value: 'pendant', label: 'Pendant' },
    { value: 'bangle', label: 'Bangle' },
  ];

  const subCategories: { [key: string]: { value: string; label: string }[] } = {
    ring: [
      { value: 'hallmark', label: 'Hallmark Ring' },
      { value: 'american', label: 'American Diamond Ring' },
      { value: 'gold-plated', label: 'Gold Plated Ring' },
      { value: 'silver', label: 'Silver Ring' },
      { value: 'oxidized', label: 'Oxidized Ring' },
    ],
    necklace: [
      { value: 'hallmark', label: 'Hallmark Necklace' },
      { value: 'american', label: 'American Diamond Necklace' },
      { value: 'gold-plated', label: 'Gold Plated Necklace' },
      { value: 'silver', label: 'Silver Necklace' },
      { value: 'oxidized', label: 'Oxidized Necklace' },
      { value: 'choker', label: 'Choker Necklace' },
    ],
    earring: [
      { value: 'hallmark', label: 'Hallmark Earring' },
      { value: 'american', label: 'American Diamond Earring' },
      { value: 'gold-plated', label: 'Gold Plated Earring' },
      { value: 'silver', label: 'Silver Earring' },
      { value: 'jhumka', label: 'Jhumka' },
      { value: 'stud', label: 'Stud Earring' },
    ],
    bracelet: [
      { value: 'hallmark', label: 'Hallmark Bracelet' },
      { value: 'american', label: 'American Diamond Bracelet' },
      { value: 'gold-plated', label: 'Gold Plated Bracelet' },
      { value: 'silver', label: 'Silver Bracelet' },
    ],
    chain: [
      { value: 'gold-plated', label: 'Gold Plated Chain' },
      { value: 'silver', label: 'Silver Chain' },
      { value: 'stainless-steel', label: 'Stainless Steel Chain' },
    ],
    pendant: [
      { value: 'hallmark', label: 'Hallmark Pendant' },
      { value: 'american', label: 'American Diamond Pendant' },
      { value: 'gold-plated', label: 'Gold Plated Pendant' },
    ],
    bangle: [
      { value: 'hallmark', label: 'Hallmark Bangle' },
      { value: 'gold-plated', label: 'Gold Plated Bangle' },
      { value: 'silver', label: 'Silver Bangle' },
    ],
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Product Data:', formData);
    // Handle form submission here
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
            Products Management
          </h1>
          <p className={`text-sm mt-1 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage your jewelry products, categories, and inventory
          </p>
        </div>
        <button
          onClick={() => setShowAddProduct(!showAddProduct)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            isDarkTheme
              ? 'bg-[#E94E8B] text-white hover:bg-[#d43d75]'
              : 'bg-[#E94E8B] text-white hover:bg-[#d43d75]'
          }`}
        >
          <PlusIcon className="w-5 h-5" />
          {showAddProduct ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {/* Add/Edit Product Form */}
      {showAddProduct && (
        <div
          className={`${
            isDarkTheme ? 'bg-black border border-gray-700' : 'bg-white'
          } rounded-lg shadow-lg p-6 mb-6`}
        >
          <h2 className={`text-2xl font-bold mb-6 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
            Add New Product
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="mb-8">
              <h3
                className={`text-lg font-semibold mb-4 ${
                  isDarkTheme ? 'text-white' : 'text-gray-900'
                }`}
              >
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product Title */}
                <div className="md:col-span-2">
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkTheme ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Product Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Riva Bold Pearl 22K Gold Platted Necklace"
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      isDarkTheme
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-[#E94E8B]`}
                    required
                  />
                </div>

                {/* Slug */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkTheme ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="riva-bold-pearl-necklace"
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      isDarkTheme
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-[#E94E8B]`}
                    required
                  />
                </div>

                {/* SKU */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkTheme ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    SKU
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    placeholder="NECK-001"
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      isDarkTheme
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-[#E94E8B]`}
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkTheme ? 'text-gray-300' : 'text-gray-700'
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
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-[#E94E8B]`}
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="mb-8">
              <h3
                className={`text-lg font-semibold mb-4 ${
                  isDarkTheme ? 'text-white' : 'text-gray-900'
                }`}
              >
                Pricing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkTheme ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="549"
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      isDarkTheme
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-[#E94E8B]`}
                    required
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkTheme ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    placeholder="899"
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      isDarkTheme
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-[#E94E8B]`}
                  />
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="mb-8">
              <h3
                className={`text-lg font-semibold mb-4 ${
                  isDarkTheme ? 'text-white' : 'text-gray-900'
                }`}
              >
                Categories
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Main Category */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkTheme ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Main Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      isDarkTheme
                        ? 'bg-gray-800 border-gray-700 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-[#E94E8B]`}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sub Category */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkTheme ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Sub Category *
                  </label>
                  <select
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleInputChange}
                    disabled={!formData.category}
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      isDarkTheme
                        ? 'bg-gray-800 border-gray-700 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-[#E94E8B] disabled:opacity-50`}
                    required
                  >
                    <option value="">Select Sub Category</option>
                    {formData.category &&
                      subCategories[formData.category]?.map((subCat) => (
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
                  isDarkTheme ? 'text-white' : 'text-gray-900'
                }`}
              >
                Product Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkTheme ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Material
                  </label>
                  <input
                    type="text"
                    name="material"
                    value={formData.material}
                    onChange={handleInputChange}
                    placeholder="Stainless Steel"
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      isDarkTheme
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-[#E94E8B]`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkTheme ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Plating
                  </label>
                  <input
                    type="text"
                    name="plating"
                    value={formData.plating}
                    onChange={handleInputChange}
                    placeholder="22K Gold Plated"
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      isDarkTheme
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-[#E94E8B]`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkTheme ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Stone Type
                  </label>
                  <input
                    type="text"
                    name="stoneType"
                    value={formData.stoneType}
                    onChange={handleInputChange}
                    placeholder="American Diamond, Pearl"
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      isDarkTheme
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-[#E94E8B]`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkTheme ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Weight (grams)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="15"
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      isDarkTheme
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-[#E94E8B]`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkTheme ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Warranty
                  </label>
                  <input
                    type="text"
                    name="warranty"
                    value={formData.warranty}
                    onChange={handleInputChange}
                    placeholder="6 Months"
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      isDarkTheme
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-[#E94E8B]`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkTheme ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="jewelry, necklace, gold"
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      isDarkTheme
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-[#E94E8B]`}
                  />
                </div>
              </div>

              {/* Features Checkboxes */}
              <div className="mt-4 flex flex-wrap gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="waterproof"
                    checked={formData.waterproof}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[#E94E8B] border-gray-300 rounded focus:ring-[#E94E8B]"
                  />
                  <span className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                    Waterproof
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="tarnishFree"
                    checked={formData.tarnishFree}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[#E94E8B] border-gray-300 rounded focus:ring-[#E94E8B]"
                  />
                  <span className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                    Tarnish Free
                  </span>
                </label>
              </div>
            </div>

            {/* Inventory */}
            <div className="mb-8">
              <h3
                className={`text-lg font-semibold mb-4 ${
                  isDarkTheme ? 'text-white' : 'text-gray-900'
                }`}
              >
                Inventory
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkTheme ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    name="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={handleInputChange}
                    placeholder="100"
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      isDarkTheme
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-[#E94E8B]`}
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="inStock"
                      checked={formData.inStock}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-[#E94E8B] border-gray-300 rounded focus:ring-[#E94E8B]"
                    />
                    <span className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                      In Stock
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Product Images */}
            <div className="mb-8">
              <h3
                className={`text-lg font-semibold mb-4 ${
                  isDarkTheme ? 'text-white' : 'text-gray-900'
                }`}
              >
                Product Images
              </h3>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  isDarkTheme ? 'border-gray-700' : 'border-gray-300'
                }`}
              >
                <ImageIcon
                  className={`w-12 h-12 mx-auto mb-4 ${
                    isDarkTheme ? 'text-gray-400' : 'text-gray-400'
                  }`}
                />
                <p className={`mb-2 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                  PNG, JPG, WEBP up to 5MB
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="mt-4 inline-block px-4 py-2 bg-[#E94E8B] text-white rounded-lg cursor-pointer hover:bg-[#d43d75] transition-colors"
                >
                  Select Images
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowAddProduct(false)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  isDarkTheme
                    ? 'bg-gray-800 text-white hover:bg-gray-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
          isDarkTheme ? 'bg-black border border-gray-700' : 'bg-white'
        } rounded-lg shadow p-6`}
      >
        <h2 className={`text-xl font-semibold mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
          All Products
        </h2>
        <div className={`text-center py-12 ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
          No products added yet. Click "Add Product" to create your first product.
        </div>
      </div>
    </div>
  );
}

