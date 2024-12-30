'use client'
import { useState } from "react";

type BlogImageProps = {
  src: string;
  alt?: string; // Optional alt text
  className?: string; // Optional CSS class
};

const BlogImage = ({
  src,
  alt = "Image preview",
  className = "",
}: BlogImageProps) => {
  const [valid, setValid] = useState<boolean>(true);

  const handleError = () => {
    setValid(false); // Replace with fallback image
  };

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} ${valid ? "" : "hidden"}`}
      onError={handleError} // Handle invalid image error
    />
  );
};

export default BlogImage;
