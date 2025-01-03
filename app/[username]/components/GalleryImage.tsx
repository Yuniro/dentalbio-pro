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
      className="w-[45%]">
      <div className="w-full rounded-lg cursor-pointer overflow-hidden">
        <BlogImage
          src={src}
          className="h-auto hover:scale-150 transition-all"
        />
      </div>
      <div>{title}</div>
      <div>{isAfter ? "After" : "Before"}</div>
    </div>
  )
}

export default GalleryImage;