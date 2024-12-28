import { Image, Upload } from '@phosphor-icons/react/dist/ssr';
import React, { useEffect, useState } from 'react';

type ImageUploaderProps = {
  onFileChange: (image: File) => void;
  image_url?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onFileChange,
  image_url,
}: ImageUploaderProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(image_url!);

  useEffect(() => {
    setImagePreview(image_url!);
  }, [image_url])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileChange(file);
      setImagePreview(URL.createObjectURL(file)); // Preview the image
    }
  };

  return (
    <div className='mb-4'>
      <label htmlFor='uploader' className='w-full cursor-pointer'>
        {/* <button type="button"> */}
        {imagePreview ? (
          <div className="relative bg-black rounded-lg group">
          <img
            src={imagePreview}
            alt="preview"
            className="w-full transition-all ease-in-out hover:opacity-50 rounded-lg"
          />
        </div>
        ) : (
          <div className='w-full h-12 flex justify-center items-center bg-white border-[#BBB] rounded-[26px]'><Image size={22} />&nbsp;&nbsp;Add Image</div>
        )}
        {/* </button> */}
      </label>
      <input
        name='uploader'
        id='uploader'
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImageUploader;
