'use client'
import BlogImage from "@/app/components/Image/BlogImage";
import ConfirmMessage from "@/app/components/Modal/ConfirmMessagel";
import { CaretDown, CaretUp, PencilSimple, Trash } from "@phosphor-icons/react/dist/ssr";
import React, { useState } from "react"

type GalleryCardProps = {
  id: string;
  title: string;
  before_image_url?: string;
  after_image_url?: string;
  created?: Date;
  onEditItem: (id: string) => void;
  onDelete: (id: string) => void;
}

const GalleryCard: React.FC<GalleryCardProps> = ({
  id,
  title,
  before_image_url,
  after_image_url,
  created,
  onEditItem,
  onDelete,
}: GalleryCardProps) => {
  const [isOpenConfirmMessage, setIsOpenConfirmMessage] = useState<boolean>(false);

  const handleDelete = () => {
    onDelete(id);
  }

  return (
    <>
      <div className="w-full p-6 shadow rounded-[26px] flex overflow-hidden gap-4 mb-4">
        {/* Caret Buttons */}
        <div className="cursor-pointer">
          <div><CaretUp /></div>
          <div><CaretDown /></div>
        </div>

        <div className="flex-grow flex flex-col">
          <div className="w-full flex items-center h-8 mb-4">
            {/* Title and Content */}
            <div className="flex-grow text-[14px] overflow-hidden">
              {/* Title Row */}
              <div className="flex flex-1 items-center truncate gap-2">
                <div className="text-[#5046db] font-bold truncate">{title}</div>
                <PencilSimple
                  size={18}
                  className="cursor-pointer flex-shrink-0 hover:text-[#5046db]"
                  onClick={() => onEditItem(id)}
                />
              </div>

              {/* Content Row */}
            </div>

            {/* Trash Button */}
            <div>
              <div onClick={() => setIsOpenConfirmMessage(true)}>
                <Trash size={20} className="cursor-pointer hover:text-red-700" />
              </div>
            </div>
          </div>
          <div className="flex justify-around">
            <BlogImage
              src={before_image_url!}
              className="w-2/5 aspect-square rounded-[6px]" />
            <BlogImage
              src={after_image_url!}
              className="w-2/5 aspect-square rounded-[6px]" />
          </div>
        </div>
      </div>

      <ConfirmMessage
        description="Aure you sure you want to delete the gallery?"
        okText="Delete"
        isOpen={isOpenConfirmMessage}
        onClose={() => setIsOpenConfirmMessage(false)}
        onOk={handleDelete}
      />
    </>
  )
}

export default GalleryCard;