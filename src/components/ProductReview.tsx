"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
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

export default function ProductReview({ reviews }: { reviews: any }) {
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<
    number | null
  >(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [modalImage, setModalImage] = useState<string>("");
  // Collect all review images
  const allReviewImages = reviews
    .filter(
      (review: any) => review.review_images && review.review_images.length > 0
    )
    .flatMap((review: any) => review.review_images!);

  const previewImages = allReviewImages.slice(0, 12); // Show first 12 images in preview

  const handleImageClick = (images: string, index: number) => {
    setModalImage(images);
    setModalImageIndex(index);
    setShowImageModal(true);
  };

  const handleViewMoreImages = () => {
    if (allReviewImages.length === 0) return;
    setModalImage(allReviewImages[0].review_image_url);
    setModalImageIndex(0);
    setShowImageModal(true);
  };

  const handleModalClose = () => {
    setShowImageModal(false);
    setModalImage("");
  };

  const handleModalNavigate = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setModalImageIndex((prev) =>
        prev === 0 ? allReviewImages.length - 1 : prev - 1
      );
    } else {
      setModalImageIndex((prev) =>
        prev === allReviewImages.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleRatingFilter = (rating: number) => {
    setSelectedRatingFilter((prev) => (prev === rating ? null : rating));
  };

  const handleClearFilter = () => {
    setSelectedRatingFilter(null);
  };

  const filteredReviews = selectedRatingFilter
    ? reviews.filter(
        (review: any) => Math.round(review.rating) === selectedRatingFilter
      )
    : reviews;

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "sm") => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`${sizeClasses[size]} ${
          i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce(
          (sum: number, review: any) => sum + (review.rating || 0),
          0
        ) / reviews.length
      : 0;

  const reviewDistribution = new Array(6).fill(0);
  reviews.forEach((review: any) => {
    const roundedRating = Math.round(review.rating);
    if (roundedRating >= 1 && roundedRating <= 5) {
      reviewDistribution[roundedRating]++;
    }
  });

  const distributionData = [5, 4, 3, 2, 1].map((star) => {
    const count = reviewDistribution[star] || 0;
    const percent =
      reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
    return { star, count, percent };
  });

  const reviewsToRender = filteredReviews;
  const formattedAverageRating = averageRating.toFixed(1);

  const renderReviewCard = (review: any) => {
    const user = review?.users ?? {};
    const initial =
      (user.email && user.email.charAt(0).toUpperCase()) ||
      (user.first_name && user.first_name.charAt(0).toUpperCase()) ||
      "U";
    const reviewDate = review?.created_at
      ? review.created_at.split("T")[0]
      : "";
    const firstReviewImage = review?.review_images?.[0];

    return (
      <div
        key={review.review_id}
        className="group flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-200 hover:border-pink-200"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-500 shadow-md">
              <span className="text-xl font-bold text-white">{initial}</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900">
                  {user.first_name} {user.last_name}
                </span>
                {review.verified && (
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                    ✓ Verified
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1">
                  {renderStars(review.rating, "sm")}
                </div>
                {reviewDate && (
                  <span className="text-sm text-gray-500 font-medium">
                    {new Date(reviewDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                )}
              </div>
            </div>
          </div>
          {firstReviewImage?.review_image_url && (
            <div className="flex shrink-0 flex-row items-center gap-2 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-2 border border-gray-200 hover:border-pink-300 transition-colors">
              <Image
                src={firstReviewImage.review_image_url}
                alt={firstReviewImage.review_image_url}
                width={80}
                height={80}
                className="h-20 w-20 rounded-lg object-cover shadow-sm"
              />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3">
          {review.title && (
            <h4 className="text-lg font-bold text-gray-900">
              {review.title}
            </h4>
          )}
          {review.review_text && (
            <p className="text-sm leading-relaxed text-gray-700">
              {review.review_text}
            </p>
          )}
        </div>
        {review.review_images && review.review_images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {review.review_images.slice(1, 4).map((img: any, idx: number) => (
              <button
                key={idx}
                onClick={() => handleImageClick(img.review_image_url, idx + 1)}
                className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 border-gray-200 hover:border-pink-400 transition-colors"
              >
                <Image
                  src={img.review_image_url}
                  alt={img.review_image_url}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderResponsiveSection = ({
    wrapperClass,
    containerClass,
    infoWrapperClass,
    summaryCardClass,
    photoCardClass,
    imageGridClass,
    reviewListClass,
  }: {
    wrapperClass: string;
    containerClass: string;
    infoWrapperClass: string;
    summaryCardClass: string;
    photoCardClass: string;
    imageGridClass: string;
    reviewListClass: string;
  }) => (
    <div className={wrapperClass}>
      <div className={containerClass}>
        <div className="w-full mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Customer Reviews</h2>
          <p className="text-gray-600">See what our customers are saying</p>
        </div>
        <div className={infoWrapperClass}>
          <div className={`${summaryCardClass} bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200`}>
            <div className="flex flex-col gap-3 p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-gray-900">
                  {reviews.length > 0 ? formattedAverageRating : "0.0"}
                </span>
                <span className="text-2xl text-gray-400">/ 5.0</span>
              </div>
              <div className="flex items-center gap-3">
                {renderStars(averageRating, "md")}
                <span className="text-base font-semibold text-gray-700">
                  {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-4">
              {distributionData.map(({ star, percent, count }) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingFilter(star)}
                  className={`group flex items-center gap-4 rounded-xl border-2 px-4 py-3 text-left transition-all duration-200 hover:scale-[1.02] ${
                    selectedRatingFilter === star
                      ? "border-pink-500 bg-gradient-to-r from-pink-50 to-rose-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-pink-300 hover:bg-pink-50"
                  }`}
                >
                  <span className={`w-14 shrink-0 text-base font-bold ${
                    selectedRatingFilter === star ? "text-pink-700" : "text-gray-700"
                  }`}>
                    {star} ★
                  </span>
                  <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full transition-all duration-300 ${
                        selectedRatingFilter === star
                          ? "bg-gradient-to-r from-pink-500 to-rose-500"
                          : "bg-gradient-to-r from-yellow-400 to-amber-400"
                      }`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                  <span className={`w-16 text-right text-sm font-bold ${
                    selectedRatingFilter === star ? "text-pink-700" : "text-gray-700"
                  }`}>
                    {percent}%
                  </span>
                  <span className={`w-12 text-right text-sm font-medium ${
                    selectedRatingFilter === star ? "text-pink-600" : "text-gray-600"
                  }`}>
                    ({count})
                  </span>
                </button>
              ))}
            </div>
            {selectedRatingFilter && (
              <button
                type="button"
                onClick={handleClearFilter}
                className="mt-4 w-full rounded-xl border-2 border-pink-300 bg-gradient-to-r from-pink-50 to-rose-50 px-4 py-2.5 text-sm font-semibold text-pink-700 transition-all hover:border-pink-500 hover:bg-gradient-to-r hover:from-pink-100 hover:to-rose-100 hover:shadow-md"
              >
                Clear Filter
              </button>
            )}
          </div>
          <div className={`${photoCardClass} bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Customer Photos
              </h3>
              {allReviewImages.length > 12 && (
                <button
                  onClick={handleViewMoreImages}
                  className="text-sm font-semibold text-pink-600 hover:text-pink-700 transition-colors"
                >
                  View All ({allReviewImages.length})
                </button>
              )}
            </div>
            {previewImages.length > 0 ? (
              <div className={imageGridClass}>
                {previewImages.map((image: any, index: number) => (
                  <button
                    key={image.review_image_id}
                    type="button"
                    className="group relative aspect-square overflow-hidden rounded-xl bg-gray-200 border-2 border-gray-200 hover:border-pink-400 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                    onClick={() =>
                      handleImageClick(image.review_image_url, index)
                    }
                  >
                    <Image
                      src={image.review_image_url}
                      alt={image.review_image_url}
                      fill
                      className="object-cover transition-transform duration-200 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <span className="text-sm text-gray-500 font-medium">
                  No customer photos uploaded yet.
                </span>
              </div>
            )}
            {allReviewImages.length > 12 && (
              <button
                type="button"
                className="text-sm font-semibold text-blue-500 transition hover:text-blue-600"
                onClick={handleViewMoreImages}
              >
                View all photoes({allReviewImages.length})
              </button>
            )}
          </div>
        </div>
        <div className={reviewListClass}>
          {reviewsToRender.length > 0 ? (
            reviewsToRender.map((review: any) => renderReviewCard(review))
          ) : (
            <span className="text-sm font-semibold text-black">
              No reviews found for this product
            </span>
          )}
        </div>
      </div>
    </div>
  );
  useEffect(() => {
    console.log("reviews", reviews);
    console.log("previewImages", previewImages);
  }, [reviews]);

  return (
    <>
      {renderResponsiveSection({
        wrapperClass: "block sm:hidden py-4 px-3 box-border bg-white",
        containerClass: "flex flex-col gap-4",
        infoWrapperClass: "flex flex-col gap-4",
        summaryCardClass:
          "flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm",
        photoCardClass:
          "flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm",
        imageGridClass: "grid grid-cols-3 gap-1.5",
        reviewListClass: "flex flex-col gap-3",
      })}

      {renderResponsiveSection({
        wrapperClass: "hidden sm:block md:hidden py-8 px-6 box-border bg-white",
        containerClass: "flex flex-col gap-6",
        infoWrapperClass:
          "flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-6",
        summaryCardClass:
          "flex flex-1 flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm",
        photoCardClass:
          "flex flex-1 flex-col gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm",
        imageGridClass: "grid grid-cols-4 gap-3",
        reviewListClass: "flex flex-col gap-5",
      })}

      {renderResponsiveSection({
        wrapperClass: "hidden md:block lg:hidden py-8 px-8 box-border bg-white",
        containerClass: "flex flex-col gap-8",
        infoWrapperClass:
          "flex flex-col gap-6 md:flex-row md:items-start md:gap-6",
        summaryCardClass:
          "flex flex-1 flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm",
        photoCardClass:
          "flex flex-1 flex-col gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm",
        imageGridClass: "grid grid-cols-4 gap-3",
        reviewListClass: "flex flex-col gap-6",
      })}

      {renderResponsiveSection({
        wrapperClass:
          "hidden lg:block xl:hidden py-10 px-10 box-border bg-white",
        containerClass: "flex flex-col gap-8",
        infoWrapperClass:
          "flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-8",
        summaryCardClass:
          "flex flex-1 flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-md",
        photoCardClass:
          "flex flex-1 flex-col gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-md",
        imageGridClass: "grid grid-cols-4 gap-4",
        reviewListClass: "flex flex-col gap-6",
      })}

      {renderResponsiveSection({
        wrapperClass:
          "hidden xl:block 2xl:hidden py-12 px-12 box-border bg-white",
        containerClass: "flex flex-col gap-8",
        infoWrapperClass:
          "flex flex-col gap-8 xl:flex-row xl:items-start xl:gap-8",
        summaryCardClass:
          "flex flex-1 flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-7 shadow-md",
        photoCardClass:
          "flex flex-1 flex-col gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-7 shadow-md",
        imageGridClass: "grid grid-cols-4 gap-4",
        reviewListClass: "flex flex-col gap-6",
      })}

      {/* Extra Large Desktop Parent Container (1536px+) */}
      <div className="hidden 2xl:flex py-12 box-border  items-center justify-center ">
        <div className="w-[90vw] gap-10 flex flex-col items-center justify-center ">
          <span className=" w-full text-start text-2xl text-black font-bold ">
            CUSTOMER REVIEW
          </span>
          <div className="w-full flex-row flex">
            <div className="flex flex-col items-center w-1/2 gap-[0.7rem] ">
              {averageRating && (
                <span className="text-2xl text-black font-bold ">
                  {averageRating}
                </span>
              )}
              <div className="flex items-center justify-center mb-1">
                {renderStars(averageRating, "md")}
              </div>
              <span className="text-xs sm:text-sm text-gray-600">
                {reviews.length} reviews
              </span>
              <div className="w-full ">
                {reviewDistribution
                  .slice()
                  .reverse()
                  .map((value, index) => {
                    if (5 - index === 0) return null;
                    return (
                      <div
                        key={index}
                        className="flex flex-row items-center justify-center gap-[1rem]"
                      >
                        <span className="text-xl text-black font-bold">
                          {5 - index}⭐
                        </span>
                        <div className="w-[60%] h-[5px] bg-gray-200 shrink-0 relative">
                          <div
                            className="h-full bg-gray-800 absolute top-0 left-0 z-10"
                            style={{
                              width: `${
                                reviews.length > 0
                                  ? (value / reviews.length) * 100
                                  : 0
                              }%`,
                            }}
                          ></div>
                          {reviews && reviews.length > 0 ? <span className="text-xs text-black font-bold">
                            {Math.round((value / reviews.length) * 100)}%
                          </span>:
                          <span className="text-xs text-black font-bold">
                              
                            </span>
                          }
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className="w-1/2 p-[1rem] bg-gray-100 rounded-lg flex flex-col gap-[1rem] ">
              <span className="text-lg text-black font-bold ">
                Customer Photoes
              </span>
              <div className="flex w-full flex-wrap ">
                { previewImages.length > 0 ? previewImages.map((image: any) => (
                  <div
                    key={image.review_image_id}
                    className="w-[100px] h-[100px] bg-gray-500 rounded-lg "
                  >
                    <Image
                      className="object-cover w-full h-full rounded-lg  "
                      src={image.review_image_url}
                      alt={image.review_image_url}
                      width={100}
                      height={100}
                      onClick={() =>
                        handleImageClick(image.review_image_url, 0)
                      }
                    />
                  </div>
                )) : (
                  <span className="text-sm font-semibold text-black">
                    No customer photos uploaded yet.
                  </span>
                )}
              </div>
              {allReviewImages.length > 12 && (
                <button className="text-blue-500 text-sm font-bold ">
                  View all photoes({allReviewImages.length})
                </button>
              )}
            </div>
          </div>
          <div className="w-[90%] p-[1rem] rounded-lg flex flex-col ">
            {reviews.length > 0 ? (
              reviews.map((review: any) => (
                
                  <div
                    key={review.review_id}
                    className="flex flex-col gap-[1rem]  "
                  >
                    <div className="flex flex-row items-center justify-between">
                      <div className="flex flex-row items-center gap-[1rem] ">
                        <div className="w-10 h-10  bg-gray-500 rounded-full flex items-center justify-center ">
                          <p className="text-white text-xl font-bold ">
                            {review.users.email.charAt(0).toUpperCase()}
                          </p>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-black text-[1.2rem] font-bold ">
                            {review.users.first_name} {review.users.last_name}
                          </span>
                          <div className="flex flex-row items-center gap-[0.5rem] ">
                            <div className="flex flex-row items-center gap-[0.5rem] ">
                              {renderStars(review.rating, "sm")}
                            </div>
                            <span className="text-gray-600 text-sm ">
                              {review.created_at.split("T")[0]}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row items-center gap-[0.5rem] p-[0.5rem] bg-gray-200 rounded-lg">
                        {review.review_images.length > 0 && (
                          <div className="flex flex-row items-center gap-[0.5rem] ">
                            <Image
                              src={review.review_images[0].review_image_url}
                              alt={review.review_images[0].review_image_url}
                              width={100}
                              height={100}
                              className=" rounded-lg object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-[0.5rem] ">
                      <span className="text-black text-[1.2rem] font-bold ">
                        {review.title}
                      </span>
                      <span className="text-gray-600 text-sm ">
                        {review.review_text}
                      </span>
                    </div>
                  </div>
                
              ))
            ) : (
              <span className="text-black text-sm font-bold ">
                No reviews found for this product
              </span>
            )}
          </div>
        </div>
      </div>
      {showImageModal && (
        <div className="fixed z-50 backdrop-blur-2xl bg-black/50 inset-0 w-[100vw] h-[100vh] flex flex-col items-center justify-center " >
          <div className="w-[58%] flex items-end justify-end" >
            <IoIosClose className="text-white text-6xl"
            onClick={handleModalClose}
            />
          </div>
          <div className="w-[55%] flex items-center justify-center " >
            <Image src={modalImage} alt={modalImage} width={1000} height={1000}  className="object-contain rounded-lg"  />
          </div>
        </div>
      )}
    </>
  );
}
