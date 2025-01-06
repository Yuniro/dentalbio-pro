'use client'
import React, { useEffect, useState } from "react";
import ReviewItem from "./ReviewItem";

type ReviewsProps = {
  userId: string;
}

const Reviews: React.FC<ReviewsProps> = ({
  userId,
}: ReviewsProps) => {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const query = userId ? `?userId=${userId}` : '';
      const response = await fetch(`/api/reviews${query}`, {
        method: 'GET'
      });
      const data = await response.json();
      setReviews(data.data);
    };

    fetchReviews();
  }, []);

  return (
    <div className="text-center" id="review">
      {(reviews.length > 0) &&
        <div className="mb-4">
          <h1 className="section-heading-treatment text-[23px] font-semibold">Reviews</h1>
          {reviews.map((review, index) => (
            <ReviewItem
              key={index}
              {...review}
            />
          ))}
        </div>}
    </div>
  )
}

export default Reviews;