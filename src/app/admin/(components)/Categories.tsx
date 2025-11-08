'use client';

import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory, type Category, type CreateCategoryData, type UpdateCategoryData } from '../actions';

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

export default function Categories({ isDarkTheme }: CategoriesProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    category_name: '',
    slug: '',
    description: '',
    image: null as File | null,
    imagePreview: '',
    is_active: true,
    display_order: 0,
    subCategories: [] as Array<{
      name: string;
      image: File | null;
      imagePreview: string;
    }>,
  });

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const result = await getCategories();
      if (result.success && result.data) {
        setCategories(result.data);
      } else {
        console.error('Failed to fetch categories:', result.error);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Auto-generate slug from category name
      if (name === 'category_name') {
        updated.slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      }

      return updated;
    });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const categoryData: CreateCategoryData = {
        category_name: formData.category_name,
        slug: formData.slug,
        description: formData.description || undefined,
        image: formData.image || undefined,
        is_active: formData.is_active,
        display_order: formData.display_order,
      };

      if (editingCategory) {
        // Update existing category
        const updateData: UpdateCategoryData = {
          ...categoryData,
          category_id: editingCategory,
        };

        const result = await updateCategory(updateData);
        if (result.success && result.data) {
          setCategories((prev) =>
            prev.map((cat) =>
              cat.category_id === editingCategory ? result.data! : cat
            )
          );
          setEditingCategory(null);
        } else {
          alert(`Failed to update category: ${result.error}`);
          return;
        }
      } else {
        // Add new category
        const result = await createCategory(categoryData);
        if (result.success && result.data) {
          setCategories((prev) => [...prev, result.data!]);
        } else {
          alert(`Failed to create category: ${result.error}`);
          return;
        }
      }

      // Reset form and cleanup
      handleCancel();
    } catch (error) {
      console.error('Submit error:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (categoryId: string) => {
    const category = categories.find(cat => cat.category_id === categoryId);
    if (category) {
      setFormData({
        category_name: category.category_name,
        slug: category.slug,
        description: category.description || '',
        image: null, // We don't have the actual file, just the URL
        imagePreview: category.image_url || '', // Use existing image as preview
        is_active: category.is_active,
        display_order: category.display_order,
        subCategories: [] // Keep empty for now as per requirements
      });
      setEditingCategory(categoryId);
      setShowAddCategory(true);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      try {
        const result = await deleteCategory(categoryId);
        if (result.success) {
          setCategories((prev) => prev.filter(cat => cat.category_id !== categoryId));
        } else {
          alert(`Failed to delete category: ${result.error}`);
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('An unexpected error occurred while deleting the category.');
      }
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
    setFormData({
      category_name: '',
      slug: '',
      description: '',
      image: null,
      imagePreview: '',
      is_active: true,
      display_order: 0,
      subCategories: []
    });
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
                    name="category_name"
                    value={formData.category_name}
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

                {/* Slug */}
                <div className="md:col-span-2">
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkTheme ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Slug *
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="e.g., ring, necklace, earring"
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      isDarkTheme
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-[#E94E8B]`}
                    required
                  />
                  <p className={`text-xs mt-1 ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                    Auto-generated from category name. Used in URLs.
                  </p>
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
                    placeholder="Brief description of the category..."
                    rows={3}
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      isDarkTheme
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-[#E94E8B]`}
                  />
                </div>

                {/* Is Active */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="w-4 h-4 text-[#E94E8B] bg-gray-100 border-gray-300 rounded focus:ring-[#E94E8B] focus:ring-2"
                  />
                  <label
                    htmlFor="is_active"
                    className={`ml-2 text-sm font-medium ${
                      isDarkTheme ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Active
                  </label>
                </div>

                {/* Display Order */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkTheme ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Display Order
                  </label>
                  <input
                    type="number"
                    name="display_order"
                    value={formData.display_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                    min="0"
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      isDarkTheme
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-[#E94E8B]`}
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
                disabled={submitting}
                className="px-6 py-2 bg-[#E94E8B] text-white rounded-lg font-medium hover:bg-[#d43d75] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Saving...' : (editingCategory ? 'Update Category' : 'Add Category')}
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

        {loading ? (
          <div className={`text-center py-12 ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className={`text-center py-12 ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
            No categories added yet. Click "Add Category" to create your first category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category.category_id}
                className={`${
                  isDarkTheme ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                } rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow`}
              >
                {/* Category Image */}
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={category.image_url || 'https://www.onlinepng.com/cdn/shop/files/CH-928725-1.jpg?v=1719396928'}
                    alt={category.category_name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(category.category_id)}
                      className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                    >
                      <EditIcon className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.category_id)}
                      className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                    >
                      <DeleteIcon className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                  {/* Status Badge */}
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      category.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {category.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* Category Info */}
                <div className="p-4">
                  <h3 className={`font-semibold text-lg mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                    {category.category_name}
                  </h3>

                  {category.description && (
                    <p className={`text-sm mb-2 ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                      {category.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs">
                    <span className={isDarkTheme ? 'text-gray-400' : 'text-gray-500'}>
                      Slug: {category.slug}
                    </span>
                    <span className={isDarkTheme ? 'text-gray-400' : 'text-gray-500'}>
                      Order: {category.display_order}
                    </span>
                  </div>

                  <div className={`text-xs mt-2 ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                    Used in: Landing Page (Category)
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

