'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { SearchResult } from '@/utilityFunctions/TypeInterface';

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'name'>('price-low');

  useEffect(() => {
    if (query.trim()) {
      performSearch(query);
    } else {
      setResults([]);
    }
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&full=true`);
      const data = await response.json();

      if (response.ok) {
        setResults(data.results || []);
      } else {
        setError(data.error || 'Failed to search products');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const products = results
    .filter(result => result.type === 'product')
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {query ? `Search Results for "${query}"` : 'Search Products'}
          </h1>
          {query && !isLoading && !error && (
            <p className="text-gray-600">
              {products.length} product{products.length !== 1 ? 's' : ''} found
            </p>
          )}

          {/* Breadcrumb */}
          {query && (
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mt-2">
              <Link href="/" className="hover:text-[#E94E8B] transition-colors">
                Home
              </Link>
              <span>/</span>
              <span>Search</span>
              <span>/</span>
              <span className="text-gray-900 font-medium">"{query}"</span>
            </nav>
          )}

          {/* Sort Controls */}
          {query && products.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4">
                <label htmlFor="sort-select" className="text-sm font-medium text-gray-700">
                  Sort by:
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'price-low' | 'price-high' | 'name')}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E94E8B] focus:border-transparent"
                >
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-[#E94E8B] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600">Searching for products...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-16">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Search Error</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => performSearch(query)}
              className="bg-[#E94E8B] text-white px-6 py-2 rounded-lg hover:bg-[#d13d7a] transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Results */}
        {!isLoading && !error && query && products.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any products matching "{query}". Try different keywords or browse our categories.
            </p>
            <Link
              href="/"
              className="bg-[#E94E8B] text-white px-6 py-2 rounded-lg hover:bg-[#d13d7a] transition-colors inline-block"
            >
              Browse All Products
            </Link>
          </div>
        )}

        {/* Search Results */}
        {!isLoading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  product_id: product.id,
                  product_name: product.name,
                  description: product.description || '',
                  base_price: product.originalPrice || product.price || 0,
                  discount_percentage: product.discountPercentage || 0,
                  final_price: product.price || 0,
                  stock_quantity: 0, // We'll assume it's in stock since it's in search results
                  weight_grams: 0,
                  created_at: '',
                  updated_at: '',
                  subcategory_id: '',
                  thumbnail_image: product.image || '',
                  sub_images_id: '',
                  size: '',
                  category_id: ''
                }}
                size="default"
              />
            ))}
          </div>
        )}

        {/* Empty State - No Query */}
        {!query && !isLoading && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start Searching</h3>
            <p className="text-gray-600 mb-6">
              Use the search bar above to find your favorite jewelry pieces.
            </p>
            <Link
              href="/"
              className="bg-[#E94E8B] text-white px-6 py-2 rounded-lg hover:bg-[#d13d7a] transition-colors inline-block"
            >
              Browse Categories
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
