export interface Product {
  product_id: string;
  category_id: string;
  product_name: string;
  description: string;
  base_price: number;
  discount_percentage: number;
  final_price: number;
  stock_quantity: number;
  weight_grams: number;
  created_at: string;
  updated_at: string;
  subcategory_id: string;
  thumbnail_image: string;
  sub_images_id: string;
  size: string;
}

export interface SearchResult {
  type: 'product' | 'category';
  id: string;
  name: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  discountPercentage?: number;
  image?: string;
  category?: string;
  categorySlug?: string;
  slug?: string;
}

export interface SearchResponse {
  results: SearchResult[];
  error?: string;
}