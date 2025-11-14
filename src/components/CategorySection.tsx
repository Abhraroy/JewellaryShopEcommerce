'use client';

import Image from 'next/image';
import Link from 'next/link';

// interface Category {
//   id: string;
//   name: string;
//   imageUrl: string;
//   slug: string;
// }

// interface CategorySectionProps {
//   categories?: Category[];
//   className?: string;
// }

// const defaultCategories: Category[] = [
//   { id: '1', name: 'AD Necklace', imageUrl: 'https://cdn-media.glamira.com/media/product/newgeneration/view/1/sku/Queen-3crt/diamond/diamond-Brillant_AA/stone2/diamond-Brillant_AAA/alloycolour/yellow.jpg', slug: 'ad-necklace' },
//   { id: '2', name: 'Earrings', imageUrl: 'https://cdn-media.glamira.com/media/product/newgeneration/view/1/sku/Queen-3crt/diamond/diamond-Brillant_AA/stone2/diamond-Brillant_AAA/alloycolour/yellow.jpg', slug: 'earrings' },
//   { id: '3', name: 'Pendant', imageUrl: 'https://cdn-media.glamira.com/media/product/newgeneration/view/1/sku/Queen-3crt/diamond/diamond-Brillant_AA/stone2/diamond-Brillant_AAA/alloycolour/yellow.jpg', slug: 'pendant' },
//   { id: '4', name: 'Gold Plated Pendants', imageUrl: 'https://cdn-media.glamira.com/media/product/newgeneration/view/1/sku/Queen-3crt/diamond/diamond-Brillant_AA/stone2/diamond-Brillant_AAA/alloycolour/yellow.jpg', slug: 'gold-plated-pendants' },
//   { id: '5', name: 'Gold Plated Earrings', imageUrl: 'https://cdn-media.glamira.com/media/product/newgeneration/view/1/sku/Queen-3crt/diamond/diamond-Brillant_AA/stone2/diamond-Brillant_AAA/alloycolour/yellow.jpg', slug: 'gold-plated-earrings' },
// ];

export default function CategorySection({ 
  categories,
  // className = '' 
}: { categories: any }) {
  return (
    <section className={`w-full bg-white py-8 md:py-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8 text-center">
          Shop by Category
        </h2>
        
        {/* Horizontal Scrollable Container */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 md:gap-6 pb-4 min-w-max md:min-w-0 md:justify-center md:flex-wrap pt-[1rem]  ">
            {categories.map((category: any) => (
              <Link
                key={category.category_id}
                href={`/collection/${category.slug}`}
                className="flex flex-col items-center group flex-shrink-0 w-20 md:w-24 lg:w-28"
              >
                {/* Circular Image Container */}
                <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden bg-gray-100 ring-2 ring-gray-200 group-hover:ring-gray-400 transition-all duration-300 mb-2 md:mb-3 shadow-sm group-hover:shadow-md">
                  <Image
                    src={category.category_image_url}
                    alt={category.category_name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 768px) 80px, (max-width: 1024px) 96px, 112px"
                  />
                </div>
                
                {/* Category Name */}
                <span className="text-xs md:text-sm font-medium text-gray-700 group-hover:text-gray-900 text-center transition-colors duration-200 leading-tight">
                  {category.category_name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

