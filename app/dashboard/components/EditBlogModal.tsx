// components/AddBlogModa.tsx

import { useEffect, useState } from "react";
import LabeledInput from "./LabeledInput";
import LimitedTextArea from "./LimitedTextArea";
import FullRoundedButton from "@/app/components/Button/FullRoundedButton";
import ImageUploader from "./ImageUploader";
import RichTextEditor from "@/app/components/TextEditor/RichTextEditor";

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
  const [currentImage, setCurrentImage] = useState<string | null>(props.image_url!);

  useEffect(() => {
    setCurrentImage(isOpen ? props.image_url! : null);

    setIsUploading(false);
    setFormData(props);
  }, [isOpen])

  const handleContentChange = (value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      content: value,
    }));
  }

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
        <div
          className="modal-overlay overflow-auto fixed bg-[#00000080] z-10 left-0 top-0 right-0 bottom-0 flex justify-center items-center"
          onClick={onClose}
        >
          <div
            className="w-[600px] max-h-[90vh] overflow-hidden flex flex-col rounded-[26px] bg-[#F3F3F1] p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="mb-4">Add New Blog</h4>
            <form onSubmit={handleSubmit}>
              <div className="max-h-[60vh] overflow-y-auto">
                <LabeledInput
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
                <RichTextEditor
                  value={formData.content!}
                  onChange={handleContentChange} />
                <ImageUploader
                  onFileChange={handleFileChange}
                  image_url={currentImage!}
                />
                <LabeledInput
                  label="Meta Title"
                  name="meta_title"
                  tooltip={true}
                  tooltipText="The Meta Title is the main heading that appears in search results. Keep it concise, under 60 characters."
                  value={formData.meta_title}
                  onChange={handleChange}
                />
                <LimitedTextArea
                  placeholder="Meta Description"
                  name="meta_description"
                  tooltip={true}
                  tooltipText="The Meta Description provides a summary for search engines. Keep it between 50-200 characters."
                  value={formData.meta_description}
                  onChange={handleChange}
                />
                <LabeledInput
                  label="URL"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
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
