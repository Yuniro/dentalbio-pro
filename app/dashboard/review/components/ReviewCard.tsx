'use client'
import ConfirmMessage from "@/app/components/Modal/ConfirmMessagel";
import { CaretDown, CaretUp, PencilSimple, Trash } from "@phosphor-icons/react/dist/ssr";
import React, { useEffect, useReducer, useState } from "react"

type ReviewCardProps = {
  username: string;
  id?: string;
  reviewer_name?: string;
  content?: string;
  slug?: string;
  enabled?: boolean;
  onUpdate: (review: ReviewType, image: null) => void;
  onEditItem: (id: string) => void;
  onDelete: (id: string) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  username,
  id,
  reviewer_name,
  content,
  slug,
  enabled,
  onUpdate,
  onEditItem,
  onDelete,
}: ReviewCardProps) => {
  const [isOpenConfirmMessage, setIsOpenConfirmMessage] = useState<boolean>(false);
  const [isActive, toggleIsActive] = useReducer((prevState) => !prevState, enabled!);

  useEffect(() => {
    if (enabled !== isActive) {
      const review = {
        id, enabled: isActive
      }
      onUpdate(review, null);
    }
  }, [isActive]);

  const handleDelete = () => {
    onDelete(id!);
  }

  return (
    <>
      <div className="w-full p-6 shadow rounded-[26px] flex items-center overflow-hidden gap-4 mb-4">
        {/* Caret Buttons */}
        <div className="cursor-pointer">
          <div><CaretUp /></div>
          <div><CaretDown /></div>
        </div>

        {/* Title and Content */}
        <div className="flex-grow text-[14px] overflow-hidden">
          {/* Title Row */}
          <div className="flex flex-1 items-center truncate gap-2">
            <div className="text-[#5046db] font-bold truncate">{reviewer_name}</div>
            <PencilSimple
              size={18}
              className="cursor-pointer flex-shrink-0 hover:text-[#5046db]"
              onClick={() => onEditItem(id!)}
            />
          </div>

          {/* Content Row */}
          <div className="truncate">{content}</div>
        </div>

        {/* Trash Button */}
        <div className="flex items-center gap-2">
          <div onClick={() => setIsOpenConfirmMessage(true)}>
            <Trash size={20} className="cursor-pointer hover:text-red-700" />
          </div>

          <div className="form-check form-switch custom-form-check">
            <input
              className="form-check-input cursor-pointer"
              type="checkbox"
              role="switch"
              // id={`flexSwitchCheckChecked-${link.link_id}`}
              checked={isActive}
              onChange={toggleIsActive}
            />
          </div>
        </div>
      </div>

      <ConfirmMessage
        description="Aure you sure you want to delete the review?"
        okText="Delete"
        isOpen={isOpenConfirmMessage}
        onClose={() => setIsOpenConfirmMessage(false)}
        onOk={handleDelete}
      />
    </>
  )
}

export default ReviewCard;