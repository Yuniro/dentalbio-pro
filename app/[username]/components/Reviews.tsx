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
  const [externalLink, setExternalLink] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchReviewLink = async () => {
      const query = userId ? `?userId=${userId}` : '';
      const response = await fetch(`/api/external-review-pages${query}`, {
        method: 'GET'
      });
      const data = await response.json();
      if (data.data.length)
        setExternalLink(data.data[0].link);
    };

    fetchReviewLink();
  }, []);

  return (
    <div className="text-center" id="review">
      {(reviews.length > 0) &&
        <div className="mb-4">
          <h1 className="section-heading-treatment text-[23px] md:text-[26px] font-semibold pb-4">
            {externalLink ?
              <a href={externalLink} className="text-black no-underline" target="_blank">Reviews</a> :
              <span>Reviews</span>}
          </h1>
          {reviews.map((review) => (
            <ReviewItem
              key={review.id}
              {...review}
            />
          ))}
        </div>}
    </div>
  )
}

export default Reviews;