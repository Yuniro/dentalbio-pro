import BlogImage from "@/app/components/Image/BlogImage";
import { formatDateAsMMDDYYYY, formatDateAsMonth } from "@/utils/formatDate";
import ReactStars from "react-stars";
import ReviewContent from "./Basic/ReviewContent";

const ReviewItem: React.FC<ReviewType> = ({ ...reviewData }) => {
  return (
    <div className="flex flex-col items-center text-center mb-4">
      <div className='w-full flex justify-center'>
        <div className={`flex items-center ${reviewData.image_url?.length! > 0 ? "gap-2 text-left" : "gap-0 text-center"}`}>
          <div>
            <BlogImage
              src={reviewData.image_url!}
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
          <div>
            <div className='text-sm font-semibold'>{reviewData.reviewer_name}</div>
            <div className={`text-sm text-[#9D9D9D]`}>{formatDateAsMMDDYYYY(reviewData.created_at)}</div>
          </div>
        </div>
      </div>
      <div>
        <ReactStars
          count={5}
          size={20}
          color1="gray"
          color2="#000000"
          edit={false}
          half={false}
          value={reviewData.stars}
          className="flex justify-around"
        />
      </div>
      <ReviewContent reviewData={{ content: reviewData.content! }} />
      <div className="text-sm text-[#9D9D9D]">Source: {reviewData.platform}</div>
    </div>
  )
}

export default ReviewItem;