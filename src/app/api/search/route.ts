import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const isFullPage = searchParams.get('full') === 'true';

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ results: [] }, { status: 200 });
    }

    const searchTerm = query.trim();
    const limit = isFullPage ? 50 : 10; // More results for full page search

    // Search products by name, description, and join with categories
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        product_id,
        product_name,
        description,
        base_price,
        discount_percentage,
        final_price,
        thumbnail_image,
        categories (
          category_name,
          slug
        )
      `)
      .or(`product_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .gt('stock_quantity', 0) // Only show products with stock > 0
      .order('final_price', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Search error:', error);
      return NextResponse.json({ error: 'Failed to search products' }, { status: 500 });
    }

    // Also search categories that match the query
    const { data: categories, error: categoryError } = await supabase
      .from('categories')
      .select('category_id, category_name, slug, category_image_url')
      .ilike('category_name', `%${searchTerm}%`)
      .eq('is_active', true)
      .limit(5);

    if (categoryError) {
      console.error('Category search error:', categoryError);
    }

    // Format the response
    const formattedProducts = products?.map(product => ({
      type: 'product',
      id: product.product_id,
      name: product.product_name,
      description: product.description,
      price: product.final_price,
      originalPrice: product.base_price,
      discountPercentage: product.discount_percentage,
      image: product.thumbnail_image,
          category: product.categories?.[0]?.category_name || '',
          categorySlug: product.categories?.[0]?.slug || ''
    })) || [];

    const formattedCategories = categories?.map(category => ({
      type: 'category',
      id: category.category_id,
      name: category.category_name,
      slug: category.slug,
      image: category.category_image_url
    })) || [];

    return NextResponse.json({
      results: [...formattedCategories, ...formattedProducts]
    }, { status: 200 });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
