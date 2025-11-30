
import { Metadata } from 'next';
import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchResults from './SearchResults';

interface SearchPageProps {
  searchParams: { q?: string };
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const query = searchParams.q || '';

  return {
    title: query ? `Search Results for "${query}" - JWEL` : 'Search Products - JWEL',
    description: query
      ? `Find jewelry products matching "${query}". Browse our collection of rings, necklaces, bracelets, and more.`
      : 'Search for your favorite jewelry pieces. Find rings, necklaces, bracelets, earrings, and more.',
    keywords: ['jewelry', 'search', 'rings', 'necklaces', 'bracelets', 'earrings', query].filter(Boolean),
    openGraph: {
      title: query ? `Search Results for "${query}" - JWEL` : 'Search Products - JWEL',
      description: query
        ? `Find jewelry products matching "${query}". Browse our collection of rings, necklaces, bracelets, and more.`
        : 'Search for your favorite jewelry pieces.',
      type: 'website',
    },
  };
}

export default function SearchPage(props: SearchPageProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-[#E94E8B] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600">Loading search...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
