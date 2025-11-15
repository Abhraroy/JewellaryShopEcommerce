'use server'

import { createClient } from '@/app/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { uploadImageToCloudflare, deleteImageFromCloudflare } from '@/app/utils/cloudflare'
import { extractR2KeyFromUrl } from './utils'

/**
 * Category Types and Interfaces
 */
export interface Category {
  [x: string]: any
  category_id: string
  category_name: string
  slug: string
  description: string | null
  category_image_url: string | null
  is_active: boolean
  display_order: number
}

export interface CreateCategoryData {
  category_id: string
  category_name: string
  slug: string
  description?: string
  category_image_url?: File
  sub_categories?: Array<{
    sub_category_id: string
    sub_category_name: string
    slug: string
    description?: string
    sub_category_image?: File
    is_active?: boolean
  }>
  is_active?: boolean
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {
  category_id: string
}

/**
 * Get all main categories (categories without a parent)
 * @returns Promise with array of categories sorted by display_order
 */
export async function getCategories(): Promise<{ success: boolean; data?: Category[]; error?: string }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('categories')
      .select('*, sub_categories(*)')

    if (error) {
      console.error('Error fetching categories:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data: data as Category[] }
  } catch (error) {
    console.error('Get categories error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch categories'
    }
  }
}

/**
 * Get a single category by ID
 * @param categoryId - The UUID of the category
 * @returns Promise with category data
 */
export async function getCategory(categoryId: string): Promise<{ success: boolean; data?: Category; error?: string }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('category_id', categoryId)
      .single()

    if (error) {
      console.error('Error fetching category:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data: data as Category }
  } catch (error) {
    console.error('Get category error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch category'
    }
  }
}

/**
 * Create a new category
 * @param formData - Category data including optional image file
 * @returns Promise with created category data
 */
//working fine
export async function createCategory(formData: CreateCategoryData): Promise<{ success: boolean; data?: Category; error?: string }> {
  try {
    const supabase = await createClient()

    let imageUrl: string | null = null
    let uploadedImageKey: string | null = null

    // Upload image to Cloudflare R2 if provided
    if (formData.category_image_url) {
      const uploadResult = await uploadImageToCloudflare(formData.category_image_url, {
        folder: 'categories'
      })

      if (!uploadResult.success) {
        return { success: false, error: uploadResult.error || 'Failed to upload image' }
      }

      imageUrl = uploadResult.url || null
      uploadedImageKey = uploadResult.key || null
    }

    // Create category in database
    const categoryData = {
      category_name: formData.category_name,
      slug: formData.slug,
      description: formData.description || null,
      category_image_url: imageUrl,
      is_active: formData.is_active ?? true,
    }

    const { data, error } = await supabase
      .from('categories')
      .insert(categoryData)
      .select()
      .single()

    if (error) {
      console.error('Error creating category:', error)
      // If database insert failed but image was uploaded, we should clean up the image
      if (uploadedImageKey) {
        await deleteImageFromCloudflare(uploadedImageKey)
      }
      return { success: false, error: error.message }
    }

    revalidatePath('/admin')
    return { success: true, data: data as Category }
  } catch (error) {
    console.error('Create category error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create category'
    }
  }
}

/**
 * Update an existing category
 * @param formData - Category data to update, including category_id
 * @returns Promise with updated category data
 */
//working fine
export async function updateCategory(formData: UpdateCategoryData): Promise<{ success: boolean; data?: Category; error?: string }> {
  try {
    const supabase = await createClient()

    const categoryId = formData.category_id

    // Get current category data to handle image cleanup if needed
    const { data: currentCategory, error: fetchError } = await supabase
      .from('categories')
      .select('category_image_url')
      .eq('category_id', categoryId)
      .single()

    if (fetchError) {
      console.error('Error fetching current category:', fetchError)
      return { success: false, error: fetchError.message }
    }

    let imageUrl = currentCategory.category_image_url

    // Upload new image to Cloudflare if provided
    if (formData.category_image_url) {
      // Delete old image if it exists
      if (currentCategory.category_image_url) {
        // Extract R2 key from URL
        const r2Key = extractR2KeyFromUrl(currentCategory.category_image_url)
        if (r2Key) {
          await deleteImageFromCloudflare(r2Key)
        }
      }

      const uploadResult = await uploadImageToCloudflare(formData.category_image_url, {
        folder: 'categories'
      })

      if (!uploadResult.success) {
        return { success: false, error: uploadResult.error || 'Failed to upload image' }
      }

      imageUrl = uploadResult.url || null
    }

    // Update category in database
    const updateData: Partial<Category> = {}

    if (formData.category_name !== undefined) updateData.category_name = formData.category_name
    if (formData.slug !== undefined) updateData.slug = formData.slug
    if (formData.description !== undefined) updateData.description = formData.description
    if (imageUrl !== undefined) updateData.category_image_url = imageUrl
    if (formData.is_active !== undefined) updateData.is_active = formData.is_active

    const { data, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('category_id', categoryId)
      .select()
      .single()

    if (error) {
      console.error('Error updating category:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/admin')
    return { success: true, data: data as Category }
  } catch (error) {
    console.error('Update category error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update category'
    }
  }
}

/**
 * Delete a category and its associated image from R2
 * @param categoryId - The UUID of the category to delete
 * @returns Promise with deletion result
 */
//working fine
export async function deleteCategory(categoryId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // Get category data to clean up image
    const { data: category, error: fetchError } = await supabase
      .from('categories')
      .select('category_image_url')
      .eq('category_id', categoryId)
      .single()

    if (fetchError) {
      console.error('Error fetching category for deletion:', fetchError)
      return { success: false, error: fetchError.message }
    }

    // Delete from database first
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('category_id', categoryId)

    if (error) {
      console.error('Error deleting category:', error)
      return { success: false, error: error.message }
    }

    // Delete image from Cloudflare R2 if it exists
    if (category.category_image_url) {
      const r2Key = extractR2KeyFromUrl(category.category_image_url)
      if (r2Key) {
        await deleteImageFromCloudflare(r2Key)
      }
    }

    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Delete category error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete category'
    }
  }
}


export async function createSubCategory(formData:any){
  try{

    const supabase = await createClient()
    let imageUrl: string | null = null
    let uploadedImageKey: string | null = null
    if (formData.subcategory_image_url) {
      const uploadResult = await uploadImageToCloudflare(formData.subcategory_image_url, {
        folder: 'sub_categories'
      })
    
    if (!uploadResult.success) {
      return {
        success: false,
        error: uploadResult.error || 'Failed to upload image'
      }
    }
    imageUrl = uploadResult.url || null
      uploadedImageKey = uploadResult.key || null
    }

    const subCategoryData = {
      subcategory_name: formData.subcategory_name,
      subcategory_image_url: imageUrl,
      is_active: formData.is_active ?? true,
      category_id: formData.category_id,
    }


    const {data,error} = await supabase.from("sub_categories")
    .insert(subCategoryData)
    .select()
    .single()

    console.log("data of sub category",data)
    console.log("error of sub category",error)

    if(error){
      console.error('Error creating sub category:', error)
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true,
      data: data
    }
  }catch(error){
    console.error('Create sub category error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create sub category'
    }
  }
}