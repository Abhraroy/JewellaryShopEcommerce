'use client';

import { useState, useEffect } from 'react';
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
  reviews}: {reviews: any}) {
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  // Collect all review images
  const allReviewImages = reviews
    .filter((review: any) => review.review_images && review.review_images.length > 0)
    .flatMap((review: any) => review.review_images!);

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

  let averageRating = 0;
  reviews.forEach((review: any) => {
    averageRating += review.rating;
  });
  averageRating = averageRating / reviews.length;


  let reviewDistribution = new Array(6).fill(0)
  reviews.forEach((review: any) => {
    reviewDistribution[review.rating]++;
  });
  useEffect(()=>{
    console.log("reviews",reviews);
    console.log("previewImages",previewImages);
  },[reviews]);


  return (
    <>
      {/* Mobile Parent Container (0px - 639px) */}
      <div className="block sm:hidden py-4 box-border">
        <div>
          {/* Mobile rating distribution code goes here (0px - 639px) */}
        </div>
        {selectedRatingFilter && (
          <div className="mt-2">
            {/* Mobile clear filter button code goes here */}
          </div>
        )}
      </div>

      {/* Small Mobile Parent Container (640px - 767px) */}
      <div className="hidden sm:block md:hidden py-6 box-border">
        <div>
          {/* Small mobile rating distribution code goes here (640px - 767px) */}
        </div>
        {selectedRatingFilter && (
          <div className="mt-3">
            {/* Small mobile clear filter button code goes here */}
          </div>
        )}
      </div>

      {/* Tablet Parent Container (768px - 1023px) */}
      <div className="hidden md:block lg:hidden py-8 box-border">
        <div>
          {/* Tablet rating distribution code goes here (768px - 1023px) */}
        </div>
        {selectedRatingFilter && (
          <div className="mt-4">
            {/* Tablet clear filter button code goes here */}
          </div>
        )}
      </div>

      {/* Desktop Parent Container (1024px - 1279px) */}
      <div className="hidden lg:block xl:hidden py-10 box-border">
        <div>
          {/* Desktop rating distribution code goes here (1024px - 1279px) */}
        </div>
        {selectedRatingFilter && (
          <div className="mt-5">
            {/* Desktop clear filter button code goes here */}
          </div>
        )}
      </div>

      {/* Large Desktop Parent Container (1280px - 1535px) */}
      <div className="hidden xl:block 2xl:hidden py-12 box-border">
        <div>
          {/* Large desktop rating distribution code goes here (1280px - 1535px) */}
        </div>
        {selectedRatingFilter && (
          <div className="mt-6">
            {/* Large desktop clear filter button code goes here */}
          </div>
        )}
      </div>

      {/* Extra Large Desktop Parent Container (1536px+) */}
      <div className="hidden 2xl:flex py-12 box-border  items-center justify-center ">
        <div className="w-[90vw] gap-10 flex flex-col items-center justify-center ">
          <span className=' w-full text-start text-2xl text-black font-bold ' >CUSTOMER REVIEW</span>
          <div className='w-full flex-row flex' >
            <div className='flex flex-col items-center w-1/2 gap-[0.7rem] ' >
             {averageRating && <span className='text-2xl text-black font-bold ' >{averageRating}</span>}
              <div className="flex items-center justify-center mb-1">
                    {renderStars(averageRating, 'md')}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600">
                    {reviews.length} reviews
                  </span>
              <div className='w-full ' >
                {
                  reviewDistribution.slice().reverse().map((value,index) => {
                    if (5-index === 0) return null;
                    return (
                      <div key={index} className="flex flex-row items-center justify-center gap-[1rem]">
                        <span className='text-xl text-black font-bold'>{5-index}⭐</span>
                        <div className="w-[60%] h-[5px] bg-gray-200 shrink-0 relative">
                          <div 
                            className="h-full bg-gray-800 absolute top-0 left-0 z-10"
                            style={{
                              width: `${reviews.length > 0 ? (value / reviews.length) * 100 : 0}%`
                            }}
                          ></div>
                          <span className='text-xs text-black font-bold'>{(value/reviews.length)*100}%</span>
                        </div>
                      </div>
                    );
                  })
                }
              </div>
            </div>
            <div className='w-1/2 p-[1rem] bg-gray-100 rounded-lg flex flex-col gap-[1rem] ' >
              <span className='text-lg text-black font-bold ' >Customer Photoes</span>
              <div className='flex w-full flex-wrap ' >
                {
                  previewImages
                  .map((image:any)=>(
                    <div key={image.review_image_id} className='w-[100px] h-[100px] bg-gray-500 rounded-lg ' >
                      <Image className='object-cover w-full h-full rounded-lg  ' src={image.review_image_url} alt={image.review_image_url} width={100} height={100} />
                    </div>
                  ))
                }
              </div>
              {
                allReviewImages.length > 12 && (
                  <button className='text-blue-500 text-sm font-bold ' >View all photoes({allReviewImages.length})</button>
                )
              }
            </div>
          </div>
          <div className='w-[90%] bg-blue-300 p-[1rem] rounded-lg flex flex-col ' >
          {
            reviews.length>0 ?(
            reviews.map((review:any)=>(
              <>
              <div key={review.review_id} className='flex flex-col  ' >
                <div className='flex flex-row' >
                  <div className='flex flex-row items-center gap-[1rem] ' >
                    <div className='w-15 h-15  bg-gray-500 rounded-full flex items-center justify-center ' >
                      <p className='text-white text-3xl font-bold ' >{review.users.email.charAt(0).toUpperCase()}</p>
                    </div>
                    <span className='text-black text-[1.2rem] font-bold ' >{review.users.first_name} {review.users.last_name}</span>
                    
                  </div>
                </div>
              </div>
              </>
            ))
            ):(
            <span className='text-black text-sm font-bold ' >
              No reviews found for this product
              </span>)
          }
          </div>
        </div>
        
      </div>
    </>
  );
}
