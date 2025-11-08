'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ReviewData {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  images?: string[];
  verified: boolean;
  helpful: number;
}

interface ProductReviewProps {
  reviews: ReviewData[];
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { [key: number]: number };
}

export default function ProductReview({
  reviews,
  totalReviews,
  averageRating,
  ratingDistribution
}: ProductReviewProps) {
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  // Collect all review images
  const allReviewImages = reviews
    .filter(review => review.images && review.images.length > 0)
    .flatMap(review => review.images!);

  const previewImages = allReviewImages.slice(0, 12); // Show first 12 images in preview

  const handleImageClick = (images: string[], index: number) => {
    setModalImageIndex(index);
    setShowImageModal(true);
  };

  const handleViewMoreImages = () => {
    setModalImageIndex(0);
    setShowImageModal(true);
  };

  const handleModalClose = () => {
    setShowImageModal(false);
  };

  const handleModalNavigate = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setModalImageIndex((prev) => (prev === 0 ? allReviewImages.length - 1 : prev - 1));
    } else {
      setModalImageIndex((prev) => (prev === allReviewImages.length - 1 ? 0 : prev + 1));
    }
  };

  const filteredReviews = selectedRatingFilter
    ? reviews.filter(review => Math.floor(review.rating) === selectedRatingFilter)
    : reviews;

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'sm') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`${sizeClasses[size]} ${
          i < Math.floor(rating)
            ? 'text-yellow-400'
            : 'text-gray-300'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12">
        <div className="border-t border-black/10 pt-8 sm:pt-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Customer Reviews</h2>

          {/* Rating Overview and Review Images */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 sm:gap-8 mb-6 sm:mb-8">
            {/* Overall Rating - Shortened */}
            <div className="md:col-span-2">
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                    {averageRating.toFixed(1)}
                  </div>
                  <div className="flex items-center justify-center mb-1">
                    {renderStars(averageRating, 'md')}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    {totalReviews} reviews
                  </div>
                </div>
              </div>

              {/* Rating Distribution - Compact */}
              <div className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-1">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => setSelectedRatingFilter(
                      selectedRatingFilter === stars ? null : stars
                    )}
                    className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm w-full transition-colors p-1 sm:p-0 rounded sm:rounded-none ${
                      selectedRatingFilter === stars
                        ? 'text-[#E94E8B] font-medium bg-[#E94E8B]/10 sm:bg-transparent'
                        : 'text-gray-600 hover:text-[#E94E8B]'
                    }`}
                  >
                    <span className="w-3 sm:w-auto">{stars}★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5 sm:h-1 mx-1">
                      <div
                        className="bg-[#E94E8B] h-1.5 sm:h-1 rounded-full transition-all duration-300"
                        style={{
                          width: `${totalReviews > 0 ? (ratingDistribution[stars] / totalReviews) * 100 : 0}%`
                        }}
                      />
                    </div>
                    <span className="text-xs min-w-[12px] text-right">{ratingDistribution[stars] || 0}</span>
                  </button>
                ))}
                {selectedRatingFilter && (
                  <button
                    onClick={() => setSelectedRatingFilter(null)}
                    className="text-xs sm:text-sm text-[#E94E8B] hover:text-[#d43e7a] font-medium mt-2 block w-full text-left sm:text-center"
                  >
                    Clear filter
                  </button>
                )}
              </div>
            </div>

            {/* Review Images Gallery */}
            <div className="md:col-span-3">
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Customer Photos</h3>
                {previewImages.length > 0 ? (
                  <>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
                      {previewImages.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => handleImageClick(allReviewImages, index)}
                          className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-[#E94E8B] transition-colors shrink-0"
                        >
                          <Image
                            src={image}
                            alt={`Customer photo ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                    {allReviewImages.length > 12 && (
                      <button
                        onClick={handleViewMoreImages}
                        className="w-full bg-white text-gray-900 font-semibold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl transition-all duration-300 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:shadow-[0_1px_3px_0_rgba(0,0,0,0.08)] transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group/btn text-sm sm:text-base"
                      >
                        <span>View All Photos ({allReviewImages.length})</span>
                      </button>
                    )}
                  </>
                ) : (
                  <div className="text-center py-6 sm:py-8 text-gray-500">
                    <svg className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs sm:text-sm">No customer photos yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4 sm:space-y-6">
            {filteredReviews.map((review) => (
              <div key={review.id} className="border border-black/5 rounded-lg p-3 sm:p-6">
                {/* Review Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 sm:mb-4 gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded-full flex items-center justify-center shrink-0">
                      {review.userAvatar ? (
                        <Image
                          src={review.userAvatar}
                          alt={review.userName}
                          width={40}
                          height={40}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-xs sm:text-sm font-medium text-gray-700">
                          {review.userName.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <span className="font-medium text-gray-900 text-sm sm:text-base truncate">{review.userName}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
                        <div className="flex items-center">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-xs sm:text-sm text-gray-500 shrink-0">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Review Images on the right */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-1.5 sm:gap-2 shrink-0">
                      {review.images.slice(0, 3).map((image, imgIndex) => (
                        <button
                          key={imgIndex}
                          onClick={() => {
                            const startIndex = allReviewImages.findIndex(img => img === image);
                            if (startIndex !== -1) {
                              handleImageClick(allReviewImages, startIndex);
                            }
                          }}
                          className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-[#E94E8B] transition-colors shrink-0"
                        >
                          <Image
                            src={image}
                            alt={`Review photo ${imgIndex + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                      {review.images.length > 3 && (
                        <button
                          onClick={() => {
                            const startIndex = allReviewImages.findIndex(img => img === review.images![0]);
                            if (startIndex !== -1) {
                              handleImageClick(allReviewImages, startIndex);
                            }
                          }}
                          className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-[#E94E8B] transition-colors shrink-0 bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600"
                        >
                          +{review.images.length - 3}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Review Content */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">{review.title}</h4>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{review.comment}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {filteredReviews.length > 3 && (
            <div className="text-center mt-6 sm:mt-8">
              <button className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#E94E8B] text-white rounded-lg hover:bg-[#d43e7a] transition-colors font-medium text-sm sm:text-base">
                Load More Reviews
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
          <div className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center overflow-visible">
            {/* Close Button */}
            <button
              onClick={handleModalClose}
              className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-gray-900 hover:text-gray-700 transition-all shadow-lg"
              aria-label="Close"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation Buttons */}
            {allReviewImages.length > 1 && (
              <>
                <button
                  onClick={() => handleModalNavigate('prev')}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-gray-900 hover:text-gray-700 transition-all shadow-lg"
                  aria-label="Previous image"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <button
                  onClick={() => handleModalNavigate('next')}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-gray-900 hover:text-gray-700 transition-all shadow-lg"
                  aria-label="Next image"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </>
            )}

            {/* Main Image */}
            <div className="relative w-full aspect-square max-h-[80vh] bg-gray-100 rounded-lg overflow-hidden mx-auto">
              <Image
                src={allReviewImages[modalImageIndex]}
                alt={`Customer photo ${modalImageIndex + 1}`}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Image Counter */}
            <div className="text-center mt-2 sm:mt-4 text-white text-sm sm:text-base">
              {modalImageIndex + 1} of {allReviewImages.length}
            </div>

            {/* Thumbnail Navigation */}
            {allReviewImages.length > 1 && (
              <div className="flex justify-center mt-3 sm:mt-4 gap-1.5 sm:gap-2 overflow-x-auto overflow-y-visible pb-4 sm:pb-6 max-w-full px-1 sm:px-2 py-2">
                {allReviewImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setModalImageIndex(index)}
                    className={`shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden border-2 transition-all ${
                      modalImageIndex === index
                        ? 'border-white scale-110 z-10'
                        : 'border-white border-opacity-50 hover:border-opacity-100'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
