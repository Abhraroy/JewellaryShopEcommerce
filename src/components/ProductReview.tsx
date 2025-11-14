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
        className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-500">
              <span className="text-lg font-bold text-white">{initial}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-base font-semibold text-black">
                {user.first_name} {user.last_name}
              </span>
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  {renderStars(review.rating, "sm")}
                </div>
                {reviewDate && <span>{reviewDate}</span>}
              </div>
            </div>
          </div>
          {firstReviewImage?.review_image_url && (
            <div className="flex shrink-0 flex-row items-center gap-2 rounded-lg bg-gray-100 p-2">
              <Image
                src={firstReviewImage.review_image_url}
                alt={firstReviewImage.review_image_url}
                width={80}
                height={80}
                className="h-20 w-20 rounded-lg object-cover"
              />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {review.title && (
            <span className="text-base font-semibold text-black">
              {review.title}
            </span>
          )}
          {review.review_text && (
            <span className="text-sm text-gray-600">{review.review_text}</span>
          )}
        </div>
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
        <span className="w-full text-start text-2xl font-bold text-black">
          CUSTOMER REVIEW
        </span>
        <div className={infoWrapperClass}>
          <div className={summaryCardClass}>
            <div className="flex flex-col gap-2">
              <span className="text-3xl font-semibold text-black">
                {reviews.length > 0 ? formattedAverageRating : "0.0"}
              </span>
              <div className="flex items-center gap-2">
                {renderStars(averageRating, "md")}
                <span className="text-sm text-gray-600">
                  {reviews.length} reviews
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {distributionData.map(({ star, percent, count }) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingFilter(star)}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${
                    selectedRatingFilter === star
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 bg-white text-gray-800"
                  }`}
                >
                  <span className="w-12 shrink-0 text-sm font-semibold">
                    {star}★
                  </span>
                  <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full ${
                        selectedRatingFilter === star
                          ? "bg-white"
                          : "bg-gray-800"
                      }`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                  <span className="w-16 text-right text-xs font-semibold">
                    {percent}%
                  </span>
                  <span className="w-10 text-right text-xs">
                    ({count})
                  </span>
                </button>
              ))}
            </div>
            {selectedRatingFilter && (
              <button
                type="button"
                onClick={handleClearFilter}
                className="mt-2 w-fit rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-600 transition hover:border-gray-900 hover:text-gray-900"
              >
                Clear filter
              </button>
            )}
          </div>
          <div className={photoCardClass}>
            <span className="text-lg font-semibold text-black">
              Customer Photoes
            </span>
            {previewImages.length > 0 ? (
              <div className={imageGridClass}>
                {previewImages.map((image: any, index: number) => (
                  <button
                    key={image.review_image_id}
                    type="button"
                    className="relative aspect-square overflow-hidden rounded-lg bg-gray-200"
                    onClick={() =>
                      handleImageClick(image.review_image_url, index)
                    }
                  >
                    <Image
                      src={image.review_image_url}
                      alt={image.review_image_url}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            ) : (
              <span className="text-sm text-gray-500">
                No customer photos uploaded yet.
              </span>
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
        wrapperClass: "block sm:hidden py-6 px-4 box-border bg-white",
        containerClass: "flex flex-col gap-6",
        infoWrapperClass: "flex flex-col gap-6",
        summaryCardClass:
          "flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm",
        photoCardClass:
          "flex flex-col gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-sm",
        imageGridClass: "grid grid-cols-3 gap-2",
        reviewListClass: "flex flex-col gap-4",
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
                          <span className="text-xs text-black font-bold">
                            {(value / reviews.length) * 100}%
                          </span>
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
