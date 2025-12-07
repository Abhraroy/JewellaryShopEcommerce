"use server";

import { createClient } from "@/app/utils/supabase/server";
import {
  deleteImageFromCloudflare,
  uploadImageToCloudflare,
} from "@/app/utils/cloudflare";
import { extractR2KeyFromUrl } from ".";

export async function uploadProductImages(productId: string, files: File[]) {
  try {
    const supabase = await createClient();

    if (files.length === 0) {
      return { success: false, error: "No files provided" };
    }
    const uploadResult = await uploadImageToCloudflare(files[0]);
    if (!uploadResult.success) {
      return { success: false, error: uploadResult.error };
    }
    const imageUrl = uploadResult.url;
    const imageKey = uploadResult.key;
    const { data, error } = await supabase
      .from("product_images")
      .insert({ product_id: productId, image_url: imageUrl });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data: data };
  } catch (error) {
    console.error("Error uploading product images:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload images",
    };
  }
}

export async function getProducts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*,categories(*),product_images(*),sub_categories(*)");
  if (error) {
    console.log("error", error);
    return { success: false, data: null, message: error.message };
  } else {
    console.log("products", data);
    return {
      success: true,
      data: data,
      message: "Products fetched successfully",
    };
  }
}

export async function createProduct(productData: any) {
  try {
    console.log("productData", productData);

    const supabase = await createClient();

    let imageUrl: string | null = null;
    let uploadedImageKey: string | null = null;

    if (productData.thumbnail_image) {
      const uploadResult = await uploadImageToCloudflare(
        productData.thumbnail_image,
        {
          folder: "products",
        }
      );

      if (!uploadResult.success) {
        return {
          success: false,
          error: uploadResult.error || "Failed to upload image",
        };
      }

      imageUrl = uploadResult.url || null;
      uploadedImageKey = uploadResult.key || null;
    }

    const payload = {
      product_name: productData.product_name,
      category_id: productData.category_id,
      subcategory_id: productData.subcategory_id,
      description: productData.description,
      base_price: productData.base_price,
      discount_percentage: productData.discount_percentage,
      final_price: productData.final_price,
      stock_quantity: productData.stock_quantity,
      weight_grams: productData.weight_grams,
      metal_type: productData.metal_type,
      thumbnail_image: imageUrl,
    };
    const { data, error } = await supabase
      .from("products")
      .insert(payload)
      .select()
      .single();
    if (error) {
      console.error("Error creating product:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to create product",
      };
    }
    return { success: true, data: data };
  } catch (error) {
    console.error("Error creating product:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create product",
    };
  }
}

export async function updateProduct(productId: string, productData: any) {
  try {
    console.log("productData", productData);
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*,categories(*),sub_categories(*)")
      .eq("product_id", productId)
      .single();
    if (error) {
      console.error("Error fetching product:", error);
    }
    if (data) {
      console.log("product data fetched to see difference", data);
    }
    if (productData.thumbnail_image instanceof File) {
      console.log("thumbnail image is a file");
      const existingThumnailimage = data?.thumbnail_image;
      if (existingThumnailimage) {
        const r2Key = extractR2KeyFromUrl(existingThumnailimage);
        if (r2Key) {
          await deleteImageFromCloudflare(r2Key);
        }
      }
      const uploadResult = await uploadImageToCloudflare(
        productData.thumbnail_image
      );
      if (!uploadResult.success) {
        return { success: false, error: uploadResult.error };
      }
      productData.thumbnail_image = uploadResult.url;
    }
    const payload = {
      product_name: productData.product_name,
      category_id: productData.category_id,
      subcategory_id: productData.subcategory_id,
      description: productData.description,
      base_price: productData.base_price,
      discount_percentage: productData.discount_percentage,
      final_price: productData.final_price,
      stock_quantity: productData.stock_quantity,
      weight_grams: productData.weight_grams,
      metal_type: productData.metal_type,
      thumbnail_image: productData.thumbnail_image,
      size: productData.size,
    };
    const { data: updatedData, error: updateError } = await supabase
      .from("products")
      .update(payload)
      .eq("product_id", productId)
      .select()
      .single();
    if (updateError) {
      console.error("Error updating product:", updateError);
      return { success: false, error: updateError.message };
    }
    return { success: true, data: updatedData };
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update product",
    };
  }
}

export async function deleteProduct(productId: string) {
  try {
    const supabase = await createClient();
    const {data:productData,error:productError} = await supabase
      .from("products")
      .select("*")
      .eq("product_id", productId)
      .single();
    if (productError) {
      console.error("Error fetching product:", productError);
    }
    if (productData) {
      const existingThumnailimage = productData.thumbnail_image;
      if (existingThumnailimage) {
        const r2Key = extractR2KeyFromUrl(existingThumnailimage);
        if (r2Key) {
          await deleteImageFromCloudflare(r2Key);
        }
      }
    }
    const { data, error } = await supabase
      .from("products")
      .delete()
      .eq("product_id", productId);
    if (error) {
      console.error("Error deleting product:", error);
      return { success: false, error: error.message };
    }
    return { success: true, data: data };
  } catch (error) {
    console.error("Error deleting product:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete product",
    };
  }
}
