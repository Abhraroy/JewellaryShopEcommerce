"use client"

import React, { useState, useEffect } from 'react';
import { Category } from '../actions/categories';

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

  


export default function CategoriesList({ category, isDarkTheme, handleEdit, handleDelete, fetchCategories, setCategories }: { category: Category, isDarkTheme: boolean, handleEdit: (categoryId: string) => void, handleDelete: (categoryId: string) => void, fetchCategories: () => void, setCategories: (categories: Category[]) => void }) {
  const [showSubCategories, setShowSubCategories] = useState(false);
  const [subCategories, setSubCategories] = useState<[]>([]);
  return (
    <>
        <React.Fragment key={category.category_id}>
              <tr
                
                className={`border-b hover:bg-opacity-50 transition-colors ${
                  isDarkTheme ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                {/* Image */}
                <td className="py-3 px-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    {category.category_image_url ? (
                      <img
                        src={category.category_image_url}
                        alt={category.category_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className={`w-6 h-6 ${isDarkTheme ? 'text-gray-600' : 'text-gray-400'}`} />
                    )}
                  </div>
                </td>
    
                {/* Category Name */}
                <td className={`py-3 px-4 font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                  {category.category_name}
                </td>
    
                {/* Slug */}
                <td className={`py-3 px-4 text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                  {category.slug}
                </td>
    
                {/* Description */}
                <td className={`py-3 px-4 text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className="max-w-xs truncate" title={category.description || ''}>
                    {category.description || '—'}
                  </div>
                </td>
    
                {/* Status */}
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    category.is_active
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {category.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
    
                {/* Actions */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(category.category_id)}
                      className={`p-2 rounded-lg transition-colors ${
                        isDarkTheme
                          ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                          : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                      }`}
                      title="Edit"
                    >
                      <EditIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.category_id)}
                      className={`p-2 rounded-lg transition-colors ${
                        isDarkTheme
                          ? 'hover:bg-red-900 text-red-400 hover:text-red-300'
                          : 'hover:bg-red-50 text-red-600 hover:text-red-700'
                      }`}
                      title="Delete"
                    >
                      <DeleteIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <button
                      className={`p-2 bg-gray-300 text-black rounded-lg transition-colors ${
                        isDarkTheme
                          ? 'hover:bg-gray-100  hover:text-black'
                          : 'hover:bg-gray-700  hover:text-white'
                      }`}
                      title="Edit Sub Category"
                      onClick={() => setShowSubCategories(!showSubCategories)}
                    >
                      {showSubCategories ? 'Hide' : 'Show'} 
                    </button>
                  </div>
                </td>
              </tr>
              {showSubCategories && <>
                  <tr className={`${isDarkTheme ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <td className="py-4 px-4">
                      <span className={`text-[1rem] font-bold ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                        Sub Categories
                      </span>
                    </td>
                  </tr>
                    <tr>
                    <td colSpan={7} className="py-4 px-4 pl-8 text-center">
                      <div className="flex flex-col gap-2 items-center">
                        {category?.sub_categories?.length > 0 ? (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {/* Render subcategories here when available */}
                            <span className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                              {category.sub_categories.length} sub categor{category.sub_categories.length === 1 ? 'y' : 'ies'}
                            </span>
                          </div>
                        ) : (
                          <span className={`text-sm ${isDarkTheme ? 'text-gray-500' : 'text-gray-500'}`}>
                            No sub categories added yet.
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={7} className="py-4 px-4 text-center">
                      <div className="flex flex-col gap-2 items-center">
                        <button
                          className={`p-2 bg-gray-300 text-black rounded-lg transition-colors ${
                            isDarkTheme
                              ? 'hover:bg-gray-100  hover:text-black'
                              : 'hover:bg-gray-700  hover:text-white'
                          }`}
                          title="Add Sub Category"
                        >
                          Add Sub Category
                        </button>
                      </div>
                    </td>
                  </tr>
              </>}
        </React.Fragment>
    </>
  )
}
