'use client'

import { normalizeVideoUrl } from "@/utils/normalizeVideoUrl";
import { X } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";

type VideoItemType = {
  title: string;
  link: string;
}

const VideoItem: React.FC<VideoItemType> = ({
  title,
  link
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div className={`w-full`}>
      <div className="toplinks-main">
        <div
          className={`w-full block cursor-pointer toplinks-wrapper toplinks-without-image text-center transition-opacity duration-500 ${isOpen ? "opacity-0 invisible h-0 p-0 m-0 border-none" : "h-auto visible opacity-100"}`}
          onClick={() => setIsOpen(true)}
        >
          {title}
        </div>
      </div>

      <div className={`overflow-hidden transition-[height] duration-500 ${isOpen ? "h-96 opacity-100" : "h-0 opacity-0"}`}>
        {isOpen &&
          <iframe
            src={normalizeVideoUrl(link)!}
            className="w-full h-80"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>}
        <div
          className="w-full flex justify-center py-4"
        >
          <div
            className="w-8 h-8 bg-[#00000080] rounded-full flex justify-center items-center cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <X size={24} color="#000" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoItem;