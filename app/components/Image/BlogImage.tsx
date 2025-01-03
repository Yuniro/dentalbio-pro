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
  const [valid, setValid] = useState<boolean>(false);

  const handleError = () => {
    setValid(false); // Replace with fallback image
  };

  const handleLoad = () => {
    setValid(true);
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} ${valid ? "" : "hidden"}`}
      onError={handleError} // Handle invalid image error
      onLoad={handleLoad}
    />
  );
};

export default BlogImage;
