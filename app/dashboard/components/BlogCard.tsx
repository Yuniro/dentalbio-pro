'use client'
import ConfirmMessage from "@/app/components/Modal/ConfirmMessagel";
import { CaretDown, CaretUp, PencilSimple, Trash } from "@phosphor-icons/react/dist/ssr";
import React, { useState } from "react"

type BlogCardProps = {
  id: string;
  title: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  image_url?: string;
  created?: Date;
  onEditItem: (id: string) => void;
  onDelete: (id: string) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({
  id,
  title,
  content,
  meta_title,
  meta_description,
  image_url,
  created,
  onEditItem,
  onDelete,
}: BlogCardProps) => {
  const [isOpenConfirmMessage, setIsOpenConfirmMessage] = useState<boolean>(false);

  const handleDelete = () => {
    onDelete(id);
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
            <div className="text-[#5046db] font-bold truncate">{title}</div>
            <PencilSimple
              size={18}
              className="cursor-pointer flex-shrink-0 hover:text-[#5046db]"
              onClick={() => onEditItem(id)}
            />
          </div>

          {/* Content Row */}
          <div className="truncate">{content}</div>
        </div>

        {/* Trash Button */}
        <div>
          <div onClick={() => setIsOpenConfirmMessage(true)}>
            <Trash size={20} className="cursor-pointer hover:text-red-700" />
          </div>
        </div>
      </div>

      <ConfirmMessage
        description="Aure you sure you want to delete the blog?"
        okText="Delete"
        isOpen={isOpenConfirmMessage}
        onClose={() => setIsOpenConfirmMessage(false)}
        onOk={handleDelete}
      />
    </>
  )
}

export default BlogCard;