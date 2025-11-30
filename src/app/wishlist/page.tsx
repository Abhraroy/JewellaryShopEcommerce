"use client";

import ProductCard from "@/components/ProductCard";
import { useStore } from "@/zustandStore/zustandStore";
import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { Product } from "@/utilityFunctions/TypeInterface";
import Cart from "@/components/Cart";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import OtpInput from "@/components/OtpInput";
import { getWishlistItems } from "@/utilityFunctions/WishListFunctions";

export default function WishlistPage() {
  const {
    MobnoInputState,
    OtpInputState,
    setMobnoInputState,
    AuthenticatedState,
    AuthUserId,
    setWishListItems,
  } = useStore();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const supabase = createClient();

  // Handler to open the cart
  const handleOpenCart = () => {
    setIsCartOpen(true);
  };

  // Handler to close the cart
  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  // Fetch wishlist products
  useEffect(() => {
    const fetchWishlistProducts = async () => {
      try {
        setLoading(true);

        if (AuthenticatedState && AuthUserId) {
          // Fetch from database for authenticated users
          const result = await getWishlistItems(AuthUserId, supabase);

          if (result.success) {
            const products = result.data || [];
            setWishlistProducts(products);
            setWishListItems(products); // Update global store
          } else {
            console.error("Error fetching wishlist items:", result.error);
            setWishlistProducts([]);
            setWishListItems([]); // Clear global store
          }
        } else {
          // Load from localStorage for non-authenticated users
          const localWishListItems = localStorage.getItem('wishListItems');
          if (localWishListItems) {
            const parsedItems = JSON.parse(localWishListItems);
            const products = parsedItems.map((item: any) => item.products);
            setWishlistProducts(products);
            setWishListItems(products); // Update global store
          } else {
            setWishlistProducts([]);
            setWishListItems([]); // Clear global store
          }
        }
      } catch (error) {
        console.error("Error in fetchWishlistProducts:", error);
        setWishlistProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [AuthenticatedState, AuthUserId, supabase, setWishListItems]);

  const handleAddToCart = (productId: string) => {
    console.log("Add to cart:", productId);
    // Implement your add to cart logic here
  };

  const handleWishlistToggle = async (productId: string) => {
    console.log("Wishlist toggle:", productId);

    // Add to removing items for animation
    setRemovingItems(prev => new Set(prev).add(productId));

    // Small delay for animation
    setTimeout(async () => {
      try {
        if (AuthenticatedState && AuthUserId) {
          // Remove from database for authenticated users
          const { removeFromWishlist } = await import('@/utilityFunctions/WishListFunctions');
          const result = await removeFromWishlist(AuthUserId, productId, supabase);

          if (result.success) {
            // Update local state and global store
            const updatedProducts = wishlistProducts.filter(product => product.product_id !== productId);
            setWishlistProducts(updatedProducts);
            setWishListItems(updatedProducts);
          } else {
            // Revert on failure
            setRemovingItems(prev => {
              const newSet = new Set(prev);
              newSet.delete(productId);
              return newSet;
            });
            console.error('Failed to remove from wishlist:', result.error);
            // Could add toast notification here
          }
        } else {
          // Remove from localStorage for non-authenticated users
          const { removeFromLocalWishList } = await import('@/utilityFunctions/WishListFunctions');
          const updatedWishList = removeFromLocalWishList({ product_id: productId });
          const updatedProducts = wishlistProducts.filter(product => product.product_id !== productId);
          setWishlistProducts(updatedProducts);
          setWishListItems(updatedWishList);
        }
      } catch (error) {
        // Revert on error
        setRemovingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
        console.error('Error removing from wishlist:', error);
      }
    }, 300); // Animation duration
  };

  return (
    <div className={`${wishlistProducts.length === 0 ? '' : 'min-h-screen'} bg-white`}>
      {/* Phone Number Input Modal */}
      {MobnoInputState && !OtpInputState && <PhoneNumberInput />}

      {/* OTP Input Modal */}
      {OtpInputState && !MobnoInputState && <OtpInput />}

      {/* Cart Component */}
      {isCartOpen && <Cart isOpen={isCartOpen} onClose={handleCloseCart} />}

      <main className="w-full">
        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {!AuthenticatedState && wishlistProducts.length === 0 ? (
            // Not authenticated and no local wishlist
            <div className="text-center py-16 md:py-24">
              <div className="max-w-md mx-auto">
                <div className="space-y-4">
                  <a
                    href="/"
                    className="inline-block bg-[#E94E8B] text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Explore Collection
                  </a>
                  <p className="text-sm text-gray-500">
                    Discover rings, necklaces, earrings, and more
                  </p>
                </div>
              </div>
            </div>
          ) : loading ? (
            // Loading State
            <div className="text-center py-16">
              <div className="animate-spin w-12 h-12 border-4 border-[#E94E8B] border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your wishlist...</p>
            </div>
          ) : wishlistProducts.length > 0 ? (
            <>
              {/* Wishlist Stats */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Your Saved Items
                  </h2>
                  <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full transition-all duration-300">
                    {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'}
                  </div>
                </div>
                <p className="text-gray-600 mt-2">
                  Keep track of the jewelry pieces you love
                </p>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {wishlistProducts.map((product) => (
                  <div
                    key={product.product_id}
                    className={`transform transition-all duration-300 ${
                      removingItems.has(product.product_id)
                        ? 'opacity-0 scale-95 pointer-events-none'
                        : 'hover:scale-105 opacity-100'
                    }`}
                  >
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                      onWishlistToggle={handleWishlistToggle}
                      isWishlisted={true}
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="text-center py-16 md:py-24">
              <div className="max-w-md mx-auto">
                <div className="space-y-4">
                  <a
                    href="/"
                    className="inline-block bg-[#E94E8B] text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Explore Collection
                  </a>
                  <p className="text-sm text-gray-500">
                    Discover rings, necklaces, earrings, and more
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
