'use client';

import React, { useState } from 'react';

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

const EditIcon = ({ className = 'w-4 h-4' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586Z" />
  </svg>
);

const DeleteIcon = ({ className = 'w-4 h-4' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
);

interface CategoriesProps {
  isDarkTheme: boolean;
}

// Default categories based on your current setup
const defaultCategories = [
  {
    id: 'ring',
    name: 'Ring',
    image: 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928',
    subCategories: [
      { id: 'hallmark', name: 'Hallmark Ring', image: 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928' },
      { id: 'american', name: 'American Diamond Ring', image: 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928' },
      { id: 'gold-plated', name: 'Gold Plated Ring', image: 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928' },
      { id: 'silver', name: 'Silver Ring', image: 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928' },
      { id: 'oxidized', name: 'Oxidized Ring', image: 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928' },
    ]
  },
  {
    id: 'necklace',
    name: 'Necklace',
    image: 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928',
    subCategories: [
      { id: 'hallmark', name: 'Hallmark Necklace', image: 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928' },
      { id: 'american', name: 'American Diamond Necklace', image: 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928' },
      { id: 'gold-plated', name: 'Gold Plated Necklace', image: 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928' },
      { id: 'silver', name: 'Silver Necklace', image: 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928' },
      { id: 'oxidized', name: 'Oxidized Necklace', image: 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928' },
      { id: 'choker', name: 'Choker Necklace', image: 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928' },
    ]
  },
  {
    id: 'earring',
    name: 'Earring',
    image: 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928',
    subCategories: [
      { id: 'hallmark', name: 'Hallmark Earring', image: 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928' },
      { id: 'american', name: 'American Diamond Earring', image: 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928' },
      { id: 'gold-plated', name: 'Gold Plated Earring', image: 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928' },
      { id: 'silver', name: 'Silver Earring', image: 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928' },
      { id: 'jhumka', name: 'Jhumka', image: 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928' },
      { id: 'stud', name: 'Stud Earring', image: 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928' },
    ]
  },
  {
    id: 'bracelet',
    name: 'Bracelet',
    image: 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928',
    subCategories: [
      { id: 'hallmark', name: 'Hallmark Bracelet', image: 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928' },
      { id: 'american', name: 'American Diamond Bracelet', image: 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928' },
      { id: 'gold-plated', name: 'Gold Plated Bracelet', image: 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928' },
      { id: 'silver', name: 'Silver Bracelet', image: 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928' },
    ]
  },
  {
    id: 'chain',
    name: 'Chain',
    image: 'https://gurupujan.com/cdn/shop/files/Artificial_Gold_Chain_1_Gram_Gold_Plated_20_Inch_for_boys_and_men_offering_a_stylish_affordable_accessory_for_any_occasion.1.png?v=1756272428',
    subCategories: [
      { id: 'gold-plated', name: 'Gold Plated Chain', image: 'https://gurupujan.com/cdn/shop/files/Artificial_Gold_Chain_1_Gram_Gold_Plated_20_Inch_for_boys_and_men_offering_a_stylish_affordable_accessory_for_any_occasion.1.png?v=1756272428' },
      { id: 'silver', name: 'Silver Chain', image: 'https://gurupujan.com/cdn/shop/files/Artificial_Gold_Chain_1_Gram_Gold_Plated_20_Inch_for_boys_and_men_offering_a_stylish_affordable_accessory_for_any_occasion.1.png?v=1756272428' },
      { id: 'stainless-steel', name: 'Stainless Steel Chain', image: 'https://gurupujan.com/cdn/shop/files/Artificial_Gold_Chain_1_Gram_Gold_Plated_20_Inch_for_boys_and_men_offering_a_stylish_affordable_accessory_for_any_occasion.1.png?v=1756272428' },
    ]
  },
  {
    id: 'pendant',
    name: 'Pendant',
    image: 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928',
    subCategories: [
      { id: 'hallmark', name: 'Hallmark Pendant', image: 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928' },
      { id: 'american', name: 'American Diamond Pendant', image: 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928' },
      { id: 'gold-plated', name: 'Gold Plated Pendant', image: 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928' },
    ]
  },
  {
    id: 'bangle',
    name: 'Bangle',
    image: 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928',
    subCategories: [
      { id: 'hallmark', name: 'Hallmark Bangle', image: 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928' },
      { id: 'gold-plated', name: 'Gold Plated Bangle', image: 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928' },
      { id: 'silver', name: 'Silver Bangle', image: 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928' },
    ]
  },
];

export default function Categories({ isDarkTheme }: CategoriesProps) {
  const [categories, setCategories] = useState(defaultCategories);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    image: null as File | null,
    imagePreview: '',
    subCategories: [] as Array<{
      name: string;
      image: File | null;
      imagePreview: string;
    }>,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: previewUrl,
      }));
    }
  };

  const removeImage = () => {
    if (formData.imagePreview) {
      URL.revokeObjectURL(formData.imagePreview);
    }
    setFormData((prev) => ({
      ...prev,
      image: null,
      imagePreview: '',
    }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const previewUrl = URL.createObjectURL(file);
        setFormData((prev) => ({
          ...prev,
          image: file,
          imagePreview: previewUrl,
        }));
      }
    }
  };

  const handleSubCategoryChange = (index: number, value: string) => {
    setFormData((prev) => {
      const newSubCategories = [...prev.subCategories];
      newSubCategories[index] = {
        ...newSubCategories[index],
        name: value
      };
      return { ...prev, subCategories: newSubCategories };
    });
  };

  const handleSubCategoryImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => {
        const newSubCategories = [...prev.subCategories];
        newSubCategories[index] = {
          ...newSubCategories[index],
          image: file,
          imagePreview: previewUrl
        };
        return { ...prev, subCategories: newSubCategories };
      });
    }
  };

  const removeSubCategoryImage = (index: number) => {
    setFormData((prev) => {
      const newSubCategories = [...prev.subCategories];
      if (newSubCategories[index].imagePreview) {
        URL.revokeObjectURL(newSubCategories[index].imagePreview);
      }
      newSubCategories[index] = {
        ...newSubCategories[index],
        image: null,
        imagePreview: ''
      };
      return { ...prev, subCategories: newSubCategories };
    });
  };

  const handleSubCategoryDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSubCategoryDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const previewUrl = URL.createObjectURL(file);
        setFormData((prev) => {
          const newSubCategories = [...prev.subCategories];
          newSubCategories[index] = {
            ...newSubCategories[index],
            image: file,
            imagePreview: previewUrl
          };
          return { ...prev, subCategories: newSubCategories };
        });
      }
    }
  };

  const addSubCategory = () => {
    setFormData((prev) => ({
      ...prev,
      subCategories: [...prev.subCategories, { name: '', image: null, imagePreview: '' }]
    }));
  };

  const removeSubCategory = (index: number) => {
    setFormData((prev) => {
      // Clean up object URL if it exists
      if (prev.subCategories[index]?.imagePreview) {
        URL.revokeObjectURL(prev.subCategories[index].imagePreview);
      }
      return {
        ...prev,
        subCategories: prev.subCategories.filter((_, i) => i !== index)
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCategory) {
      // Update existing category
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editingCategory
            ? {
                ...cat,
                name: formData.name,
                image: formData.imagePreview || cat.image, // Use preview URL for now
                subCategories: formData.subCategories
                  .filter(sub => sub.name.trim() !== '')
                  .map((sub) => ({
                    id: sub.name.toLowerCase().replace(/\s+/g, '-'),
                    name: sub.name.trim(),
                    image: sub.imagePreview || 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928'
                  }))
              }
            : cat
        )
      );
      setEditingCategory(null);
    } else {
      // Add new category
      const newCategory = {
        id: formData.name.toLowerCase().replace(/\s+/g, '-'),
        name: formData.name,
        image: formData.imagePreview || 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928', // Default image if none uploaded
        subCategories: formData.subCategories
          .filter(sub => sub.name.trim() !== '')
          .map((sub) => ({
            id: sub.name.toLowerCase().replace(/\s+/g, '-'),
            name: sub.name.trim(),
            image: sub.imagePreview || 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928'
          }))
      };
      setCategories((prev) => [...prev, newCategory]);
    }

    // Reset form and cleanup
    if (formData.imagePreview) {
      URL.revokeObjectURL(formData.imagePreview);
    }
    formData.subCategories.forEach(sub => {
      if (sub.imagePreview) {
        URL.revokeObjectURL(sub.imagePreview);
      }
    });
    setFormData({ name: '', image: null, imagePreview: '', subCategories: [] });
    setShowAddCategory(false);
  };

  const handleEdit = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      setFormData({
        name: category.name,
        image: null, // We don't have the actual file, just the URL
        imagePreview: category.image, // Use existing image as preview
        subCategories: category.subCategories.map(sub => ({
          name: sub.name,
          image: null, // We don't have the actual file, just the URL
          imagePreview: sub.image || '' // Use existing image as preview
        }))
      });
      setEditingCategory(categoryId);
      setShowAddCategory(true);
    }
  };

  const handleDelete = (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories((prev) => prev.filter(cat => cat.id !== categoryId));
    }
  };

  const handleCancel = () => {
    // Clean up object URL if it exists
    if (formData.imagePreview && formData.image) {
      URL.revokeObjectURL(formData.imagePreview);
    }
    // Clean up all sub-category image previews
    formData.subCategories.forEach(sub => {
      if (sub.imagePreview && sub.image) {
        URL.revokeObjectURL(sub.imagePreview);
      }
    });
    setFormData({ name: '', image: null, imagePreview: '', subCategories: [] });
    setEditingCategory(null);
    setShowAddCategory(false);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
            Categories Management
          </h1>
          <p className={`text-sm mt-1 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage main categories and their subcategories for your jewelry collection
          </p>
        </div>
        <button
          onClick={() => setShowAddCategory(!showAddCategory)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            isDarkTheme
              ? 'bg-[#E94E8B] text-white hover:bg-[#d43d75]'
              : 'bg-[#E94E8B] text-white hover:bg-[#d43d75]'
          }`}
        >
          <PlusIcon className="w-5 h-5" />
          {showAddCategory ? 'Cancel' : 'Add Category'}
        </button>
      </div>

      {/* Add/Edit Category Form */}
      {showAddCategory && (
        <div
          className={`${
            isDarkTheme ? 'bg-black border border-gray-700' : 'bg-white'
          } rounded-lg shadow-lg p-6 mb-6`}
        >
          <h2 className={`text-2xl font-bold mb-6 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
            {editingCategory ? 'Edit Category' : 'Add New Category'}
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
                {/* Category Name */}
                <div className="md:col-span-2">
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkTheme ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Category Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Ring, Necklace, Earring"
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      isDarkTheme
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-[#E94E8B]`}
                    required
                  />
                </div>

              </div>
            </div>

            {/* Category Image */}
            <div className="mb-8">
              <h3
                className={`text-lg font-semibold mb-4 ${
                  isDarkTheme ? 'text-white' : 'text-gray-900'
                }`}
              >
                Category Image *
              </h3>

              {!formData.imagePreview ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDarkTheme ? 'border-gray-700 hover:border-gray-600' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
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
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="category-image-upload"
                    required={!editingCategory}
                  />
                  <label
                    htmlFor="category-image-upload"
                    className="mt-4 inline-block px-4 py-2 bg-[#E94E8B] text-white rounded-lg cursor-pointer hover:bg-[#d43d75] transition-colors"
                  >
                    Select Image
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={formData.imagePreview}
                    alt="Category preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <DeleteIcon className="w-4 h-4" />
                  </button>
                  <div className={`mt-2 text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                    Image uploaded successfully
                  </div>
                </div>
              )}
            </div>

            {/* Sub Categories */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3
                  className={`text-lg font-semibold ${
                    isDarkTheme ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Sub Categories
                </h3>
                <button
                  type="button"
                  onClick={addSubCategory}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-[#E94E8B] text-white rounded hover:bg-[#d43d75] transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add Sub Category
                </button>
              </div>

              <div className="space-y-4">
                {formData.subCategories.map((subCategory, index) => (
                  <div
                    key={index}
                    className={`${
                      isDarkTheme ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
                    } rounded-lg p-4`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            isDarkTheme ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          Sub Category Name
                        </label>
                        <input
                          type="text"
                          value={subCategory.name}
                          onChange={(e) => handleSubCategoryChange(index, e.target.value)}
                          placeholder={`Sub category ${index + 1}`}
                          className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                            isDarkTheme
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                          } focus:outline-none focus:ring-2 focus:ring-[#E94E8B]`}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSubCategory(index)}
                        className={`p-2 rounded-lg transition-colors mt-7 ${
                          isDarkTheme
                            ? 'text-red-400 hover:bg-red-900'
                            : 'text-red-500 hover:bg-red-50'
                        }`}
                      >
                        <DeleteIcon className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Sub Category Image Upload */}
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDarkTheme ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        Sub Category Image
                      </label>
                      {!subCategory.imagePreview ? (
                        <div
                          className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                            isDarkTheme ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
                          }`}
                          onDragOver={(e) => handleSubCategoryDragOver(e, index)}
                          onDrop={(e) => handleSubCategoryDrop(e, index)}
                        >
                          <ImageIcon
                            className={`w-8 h-8 mx-auto mb-2 ${
                              isDarkTheme ? 'text-gray-400' : 'text-gray-400'
                            }`}
                          />
                          <p className={`text-xs mb-1 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                            Click to upload or drag and drop
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleSubCategoryImageUpload(index, e)}
                            className="hidden"
                            id={`sub-category-image-${index}`}
                          />
                          <label
                            htmlFor={`sub-category-image-${index}`}
                            className="mt-2 inline-block px-3 py-1 text-xs bg-[#E94E8B] text-white rounded cursor-pointer hover:bg-[#d43d75] transition-colors"
                          >
                            Select Image
                          </label>
                        </div>
                      ) : (
                        <div className="relative">
                          <img
                            src={subCategory.imagePreview}
                            alt={`Sub category ${index + 1} preview`}
                            className="w-full h-32 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => removeSubCategoryImage(index)}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          >
                            <DeleteIcon className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {formData.subCategories.length === 0 && (
                  <div className={`text-center py-8 ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                    No sub categories added yet. Click "Add Sub Category" to add one.
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={handleCancel}
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
                {editingCategory ? 'Update Category' : 'Add Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      <div
        className={`${
          isDarkTheme ? 'bg-black border border-gray-700' : 'bg-white'
        } rounded-lg shadow p-6`}
      >
        <h2 className={`text-xl font-semibold mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
          All Categories ({categories.length})
        </h2>

        {categories.length === 0 ? (
          <div className={`text-center py-12 ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
            No categories added yet. Click "Add Category" to create your first category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`${
                  isDarkTheme ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                } rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow`}
              >
                {/* Category Image */}
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(category.id)}
                      className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                    >
                      <EditIcon className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                    >
                      <DeleteIcon className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>

                {/* Category Info */}
                <div className="p-4">
                  <h3 className={`font-semibold text-lg mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                    {category.name}
                  </h3>

                  <div className="mb-3">
                    <p className={`text-sm font-medium mb-2 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                      Sub Categories ({category.subCategories.length}):
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {category.subCategories.map((sub) => (
                        <div
                          key={sub.id}
                          className={`flex items-center gap-2 p-2 rounded-lg ${
                            isDarkTheme
                              ? 'bg-gray-700'
                              : 'bg-gray-100'
                          }`}
                        >
                          <img
                            src={sub.image}
                            alt={sub.name}
                            className="w-8 h-8 rounded object-cover"
                          />
                          <span
                            className={`text-xs truncate ${
                              isDarkTheme
                                ? 'text-gray-300'
                                : 'text-gray-600'
                            }`}
                          >
                            {sub.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                    Used in: Landing Page (Category) & Collection Page (Sub-categories)
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

