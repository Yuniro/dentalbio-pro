import BlogImage from "@/app/components/Image/BlogImage";

type GalleryImageProps = {
  src: string;
  title: string;
  isAfter: boolean;
}

const GalleryImage: React.FC<GalleryImageProps> = ({
  src,
  title,
  isAfter,
}: GalleryImageProps) => {
  return (
    <div
      className="w-[40%]">
      <div className="w-full rounded-lg cursor-pointer overflow-hidden mb-3">
        <BlogImage
          src={src}
          className="aspect-square hover:scale-110 transition-all duration-300"
        />
      </div>
      <h5 className="text-[18px] font-medium mb-1">{title}</h5>
      <h6 className="text-[#989898] text-[16px]">{isAfter ? "After" : "Before"}</h6>
    </div>
  )
}

export default GalleryImage;