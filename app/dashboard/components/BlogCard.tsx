import { CaretDown, CaretUp, PencilSimple, Trash } from "@phosphor-icons/react/dist/ssr";
import React from "react"

type BlogCardProps = {
  id: string;
  title: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  image_url?: string;
  created?: Date;
}

const BlogCard: React.FC<BlogCardProps> = ({
  title,
  content,
  meta_title,
  meta_description,
  image_url,
  created,
}: BlogCardProps) => {
  return (
    <div className="w-full p-6 shadow rounded-[26px] flex items-center gap-4 mb-4">
      <div className="cursor-pointer">
        <div><CaretUp /></div>
        <div><CaretDown /></div>
      </div>
      <div className="flex-grow text-[14px]">
        <div className="flex items-center text-ellipsis gap-2">
          <span className="text-[#5046db] font-bold">{title}</span>
          <PencilSimple size={18} className="cursor-pinter"/>
        </div>
        <div className="text-ellipsis">{content}</div>
      </div>
      <div>
        <div><Trash size={20} className="cursor-pointer"/></div>
      </div>
    </div>
  )
}

export default BlogCard;