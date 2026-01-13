"use client";

import Link from "next/link";

export default function OccasionSection() {
  return (
    <section className="w-full py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-4xl md:text-6xl text-gray-900 mb-3
          font-josefin-sans 
          tracking-wider font-bold
          ">
          What's The Occasion?
          </h2>
          <p className="text-gray-600 text-lg">
          Every moment hits different. So should your jewelry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Everyday Wear Card */}
          <Link
            href="/occasion/everydaywear"
            className="group relative overflow-hidden rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            style={{
              backgroundImage:
                "linear-gradient(135deg, rgba(0,0,0,0.35), rgba(0,0,0,0.2)), url(/collectionImages/American%20Diamond.JPG)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="p-8 md:p-10 h-full flex flex-col items-center text-center">
              <span className="mb-4 inline-flex items-center px-3 py-1 rounded-full bg-white/80 text-rose-600 text-xs font-semibold tracking-wide">
                Daily Shine
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Everyday Wear
              </h3>
              <p className="text-white/90 mb-6">
                Elegant pieces for your daily style
              </p>
              <span className="inline-flex items-center text-rose-600 font-semibold group-hover:text-rose-700 transition-colors">
                Explore →
              </span>
            </div>
          </Link>

          {/* Party Wear Card */}
          <Link
            href="/occasion/partywear"
            className="group relative overflow-hidden rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            style={{
              backgroundImage:
                "linear-gradient(135deg, rgba(0,0,0,0.35), rgba(0,0,0,0.2)), url(/collectionImages/TempleJewellary.JPG)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="p-8 md:p-10 h-full flex flex-col items-center text-center">
              <span className="mb-4 inline-flex items-center px-3 py-1 rounded-full bg-white/80 text-purple-600 text-xs font-semibold tracking-wide">
                Night Out
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Party Wear
              </h3>
              <p className="text-white/90 mb-6">
                Stunning pieces to make you shine
              </p>
              <span className="inline-flex items-center text-purple-600 font-semibold group-hover:text-purple-700 transition-colors">
                Explore →
              </span>
            </div>
          </Link>

          {/* Wedding Card */}
          <Link
            href="/occasion/wedding"
            className="group relative overflow-hidden rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            style={{
              backgroundImage:
                "linear-gradient(135deg, rgba(0,0,0,0.35), rgba(0,0,0,0.2)), url(/collectionImages/American%20Diamond.JPG)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="p-8 md:p-10 h-full flex flex-col items-center text-center">
              <span className="mb-4 inline-flex items-center px-3 py-1 rounded-full bg-white/80 text-amber-600 text-xs font-semibold tracking-wide">
                Wedding Finest
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Wedding
              </h3>
              <p className="text-white/90 mb-6">
                Timeless elegance for your special day
              </p>
              <span className="inline-flex items-center text-amber-600 font-semibold group-hover:text-amber-700 transition-colors">
                Explore →
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

