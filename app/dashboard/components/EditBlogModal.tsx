// components/AddBlogModa.tsx

import { useEffect, useState } from "react";
import LabeledInput from "./LabeledInput";
import LimitedTextArea from "./LimitedTextArea";
import FullRoundedButton from "@/app/components/Button/FullRoundedButton";
import ImageUploader from "./ImageUploader";

interface ModalProps extends BlogType {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (blog: BlogType, image: File | null) => void;
}

const EditBlogModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  ...props
}) => {
  const [formData, setFormData] = useState<BlogType>(props);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<string | null>(props.image_url);

  useEffect(() => {
    setCurrentImage(isOpen ? props.image_url : null);
    
    setIsUploading(false);
    setFormData(props);
  }, [isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    onSubmit(formData, selectedImage);
  };

  const handleFileChange = (image: File) => {
    setSelectedImage(image);
    setFormData((prevState) => ({
      ...prevState,
      image
    }))
  }

  return (
    <>
      {isOpen && (
        <div className="modal-overlay fixed bg-[#00000080] z-10 left-0 top-0 right-0 bottom-0 flex justify-center items-center" onClick={onClose}>
          <div className="w-[600px] rounded-[26px] bg-[#F3F3F1] p-10" onClick={(e) => e.stopPropagation()}>
            <h4 className="mb-4">Edit Blog</h4>
            <form onSubmit={handleSubmit}>
              <LabeledInput
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <LimitedTextArea
                placeholder="Content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                limit={5000}
                required
              />
              <ImageUploader
                onFileChange={handleFileChange}
                image_url={currentImage!}
              />
              <LabeledInput
                label="Meta Title"
                name="meta_title"
                value={formData.meta_title}
                onChange={handleChange}
              />
              <LabeledInput
                label="Meta Description"
                name="meta_description"
                value={formData.meta_description}
                onChange={handleChange}
              />
              <div className="flex justify-end gap-2">
                {/* <SaveButton text="Add Blog" /> */}
                <FullRoundedButton isLoading={isUploading} type="submit">Update Blog</FullRoundedButton>
                <FullRoundedButton type="button" buttonType="danger" onClick={onClose}>Close</FullRoundedButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditBlogModal;
