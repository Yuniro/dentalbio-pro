import { formatDateAsMonth } from "@/utils/formatDate";
import ReactStars from "react-stars";

const ReviewItem: React.FC<ReviewType> = ({ ...reviewData }) => {
  return (
    <div className="flex flex-col items-center text-center mb-4">
      <div className='w-full flex justify-center'>
        <div className='flex items-center gap-2 text-left'>
          <div>
            <img
              src={reviewData.image_url || "/placeholder.png"}
              alt="user"
              className="w-8 h-8 rounded-full"
            />
          </div>
          <div>
            <div className='text-sm font-semibold'>{reviewData.reviewer_name}</div>
            <div className='text-sm text-[#9D9D9D] text-left'>{formatDateAsMonth(reviewData.created_at)}</div>
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
      <div className="text-base leading-5 text-[#9D9D9D] my-2 px-4">{reviewData.content}</div>
      <div className="text-sm text-[#9D9D9D]">Source: {reviewData.platform}</div>
    </div>
  )
}

export default ReviewItem;