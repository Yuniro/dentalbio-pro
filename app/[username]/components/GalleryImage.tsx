'use client'
import BlogImage from "@/app/components/Image/BlogImage";
import { useState } from "react";

type GalleryImageProps = {
  src: string;
  title: string;
  subTitle: string;
}

const GalleryImage: React.FC<GalleryImageProps> = ({
  src,
  title,
  subTitle,
}: GalleryImageProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <div
        className="w-[40%]">
        <div className="w-full rounded-lg cursor-pointer overflow-hidden mb-3" onClick={() => setIsOpen(true)}>
          <BlogImage
            src={src}
            className="aspect-square hover:scale-110 transition-all duration-300"
          />
        </div>
        <h5 className="text-[18px] font-medium mb-1">{title}</h5>
        <h6 className="text-[#989898] text-[16px]">{subTitle}</h6>
      </div>
      {isOpen &&
        <div className="fixed top-0 left-0 bottom-0 right-0 flex justify-center items-center z-10 bg-[#00000090]" onClick={() => setIsOpen(false)}>
          <BlogImage
            src={src}
          />
        </div>}
    </>
  )
}

export default GalleryImage;