"use server";

import { createClient } from "@/app/utils/supabase/server";

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
