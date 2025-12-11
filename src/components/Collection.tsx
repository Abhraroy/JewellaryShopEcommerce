"use client";

import React from 'react';
import Link from 'next/link';

interface CollectionItem {
  heading: string;
  subHeading: string;
  href?: string;
}

function Collection() {
  // Sample collection data - you can expand this later
  const collections: CollectionItem[] = [
    {
      heading: "Premium Collection",
      subHeading: "Discover our exquisite premium jewelry pieces",
      href: "/collection/premium"
    },
    {
      heading: "Classic Collection",
      subHeading: "Timeless designs for every occasion",
      href: "/collection/classic"
    }
  ];

  return (
    <section className="w-full bg-white py-8 md:py-12 lg:py-16">
      <div className="w-[95%] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {collections.map((collection, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-8 md:p-12 lg:p-16 min-h-[400px] md:min-h-[500px] lg:min-h-[600px] bg-theme-sage/20 hover:bg-theme-sage/30 border border-theme-olive/30 hover:border-theme-olive transition-all duration-300"
            >
              {/* Heading */}
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-theme-olive mb-3 md:mb-4 text-center">
                {collection.heading}
              </h2>
              
              {/* Sub Heading */}
              <p className="text-sm md:text-base lg:text-lg text-theme-sage mb-6 md:mb-8 text-center max-w-md">
                {collection.subHeading}
              </p>
              
              {/* Explore Collection Button */}
              <Link
                href={collection.href || "#"}
                className="px-6 md:px-8 py-3 md:py-3.5 bg-theme-sage text-white font-semibold rounded-lg hover:bg-theme-olive transition-colors duration-200 text-sm md:text-base shadow-sm hover:shadow-md"
              >
                Explore Collection
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Collection