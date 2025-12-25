"use client";

import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard, {
  // Product as ProductCardProduct,
} from "@/components/ProductCard";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { createClient } from "@/app/utils/supabase/client";


export default function CategoryPage() {
  const supabase = createClient();
  const params = useParams();
  const categoryslug = params?.categoryslug as string;
  const decodedCategorySlug = decodeURIComponent(categoryslug || "");

  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<string>("featured");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [products, setProducts] = useState<any>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [categoryInfo, setCategoryInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Sort options
  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "newest", label: "Newest First" },
  ];

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        // Fetch category info
        const { data: categoryData, error: categoryError } = await supabase
          .from("categories")
          .select("*")
          .eq("slug", decodedCategorySlug)
          .single();

        if (categoryError) {
          console.log("category error", categoryError);
        } else if (categoryData) {
          setCategoryInfo(categoryData);

          // Fetch subcategories for this category
          const { data: subcategoriesData, error: subcategoriesError } = await supabase
            .from("sub_categories")
            .select("*")
            .eq("category_id", categoryData.category_id)
            .eq("is_active", true)

          if (subcategoriesError) {
            console.log("subcategories error", subcategoriesError);
          } else {
            setSubcategories(subcategoriesData || []);
          }
        }

        // Fetch products
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select(`
            *,
            categories!inner(*),
            sub_categories(*),
            product_images(*)
          `)
          .eq("categories.slug", decodedCategorySlug)
          .eq("listed_status", true)
          .order("updated_at", { ascending: false });

        if (productsError) {
          console.log("products error", productsError);
        } else {
          setProducts(productsData || []);
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (decodedCategorySlug) {
      fetchCategoryData();
      // Reset subcategory filter when category changes
      setSelectedSubcategory("all");
    }
  }, [decodedCategorySlug]);

  const sortedProducts = useMemo(() => {
    // Filter by subcategory
    let filtered = [...products];
    
    if (selectedSubcategory !== "all") {
      filtered = filtered.filter((product) => 
        product.sub_categories?.subcategory_id === selectedSubcategory
      );
    }

    // SORT
    switch (selectedSort) {
      case "price-low":
        filtered.sort((a, b) => a.final_price - b.final_price);
        break;
  
      case "price-high":
        filtered.sort((a, b) => b.final_price - a.final_price);
        break;
  
      case "newest":
        filtered.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        break;
      case "featured":
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      default:
        break;
    }
  
    return filtered;
  }, [selectedSort, products, selectedSubcategory]);

  return (
    <div className="min-h-screen bg-theme-cream">
      {/* <Navbar cartCount={0} /> */}

      <main className="w-full">
        {/* Header with Title and Dropdown */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-8 pb-4">
            <div className="flex items-center justify-between gap-4">
              {/* Heading */}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                  {categoryInfo?.category_name || 
                    (decodedCategorySlug.charAt(0).toUpperCase() + decodedCategorySlug.slice(1))}
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  {loading ? "Loading..." : `${sortedProducts.length} product${sortedProducts.length !== 1 ? 's' : ''} available`}
                </p>
              </div>

              {/* Dropdown - Right Corner */}
              <div className="shrink-0 relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-3 md:px-4 py-2 text-sm font-medium text-theme-olive bg-white border border-theme-sage/30 rounded-lg hover:border-theme-olive hover:text-theme-sage transition-all"
                >
                  <span className="hidden md:inline">
                    {sortOptions.find((opt) => opt.value === selectedSort)
                      ?.label || "Sort"}
                  </span>
                  <span className="md:hidden">Sort</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                      <div className="py-1">
                        {sortOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              
                              setSelectedSort(option.value);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                              selectedSort === option.value
                                ? "bg-theme-sage text-white"
                                : "text-theme-olive hover:bg-theme-cream"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Subcategory Filter Section - Below Heading */}
        {subcategories.length > 0 && (
          <div className="bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-4 md:gap-6 pb-4 min-w-max md:min-w-0 md:justify-center md:flex-wrap pt-[1rem]">
                  {/* All Products Option */}
                  <button
                    onClick={() => setSelectedSubcategory("all")}
                    className="flex flex-col items-center group flex-shrink-0 w-20 md:w-24 lg:w-28 transition-all"
                  >
                    <div
                      className={`relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden bg-white transition-all duration-300 mb-2 md:mb-3 shadow-sm group-hover:shadow-md flex items-center justify-center ${
                        selectedSubcategory === "all"
                          ? "ring-2 ring-theme-olive"
                          : "ring-2 ring-theme-sage/30 group-hover:ring-theme-olive"
                      }`}
                    >
                      <span className="text-sm md:text-base font-bold text-gray-700">All</span>
                    </div>
                    <span className="text-xs md:text-sm font-medium text-theme-olive group-hover:text-theme-sage text-center transition-colors duration-200 leading-tight">
                      All Products
                    </span>
                  </button>

                  {/* Subcategory Options */}
                  {subcategories.map((subcategory) => (
                    <button
                      key={subcategory.subcategory_id}
                      onClick={() => setSelectedSubcategory(subcategory.subcategory_id)}
                      className="flex flex-col items-center group flex-shrink-0 w-20 md:w-24 lg:w-28 transition-all"
                    >
                      {/* Circular Image Container */}
                      <div
                        className={`relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden bg-white transition-all duration-300 mb-2 md:mb-3 shadow-sm group-hover:shadow-md ${
                          selectedSubcategory === subcategory.subcategory_id
                            ? "ring-2 ring-theme-olive"
                            : "ring-2 ring-theme-sage/30 group-hover:ring-theme-olive"
                        }`}
                      >
                        {subcategory.subcategory_image_url ? (
                          <Image
                            src={subcategory.subcategory_image_url}
                            alt={subcategory.subcategory_name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            sizes="(max-width: 768px) 80px, (max-width: 1024px) 96px, 112px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <span className="text-base md:text-lg font-semibold text-gray-600">
                              {subcategory.subcategory_name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Subcategory Name */}
                      <span className="text-xs md:text-sm font-medium text-theme-olive group-hover:text-theme-sage text-center transition-colors duration-200 leading-tight">
                        {subcategory.subcategory_name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Product Count */}
          <div className="mb-6">
            <p className="text-gray-600 text-sm">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {sortedProducts.length}
              </span>{" "}
              products
            </p>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">Loading products...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {sortedProducts.map((product: any) => (
                  <ProductCard
                    key={product.product_id || product.id}
                    product={product}
                  />
                ))}
              </div>

              {/* No Products Message */}
              {sortedProducts.length === 0 && !loading && (
                <div className="text-center py-16">
                  <p className="text-gray-500 text-lg">
                    No products found{selectedSubcategory !== "all" ? " in this subcategory" : " in this category"}.
                  </p>
                </div>
              )}
            </>
          )}

          {/* Load More Button */}
          {sortedProducts.length > 0 && (
            <div className="mt-12 text-center">
              <button className="px-8 py-3 bg-white text-theme-olive font-semibold rounded-lg border-2 border-theme-sage/30 hover:border-theme-olive hover:text-theme-sage transition-all"
              >
                Load More Products
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
