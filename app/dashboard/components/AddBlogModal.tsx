// components/AddBlogModa.tsx

import { useEffect, useState } from "react";
import LabeledInput from "./LabeledInput";
import LimitedTextArea from "./LimitedTextArea";
import FullRoundedButton from "@/app/components/Button/FullRoundedButton";
import ImageUploader from "./ImageUploader";
import { Info } from "@phosphor-icons/react/dist/ssr";
import RichTextEditor from "@/app/components/TextEditor/RichTextEditor";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: { title: string; content: string; image: File | null; meta_title: string; meta_description: string }) => void;
}

type formDataProps = {
  title: string;
  content: string;
  meta_title: string;
  meta_description: string;
  slug: string;
  image: File | null;
}

const AddBlogModal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<formDataProps>({
    title: "",
    content: "",
    meta_title: "",
    meta_description: "",
    slug: "",
    image: null,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    setFormData({
      title: "",
      content: "",
      meta_title: "",
      meta_description: "",
      slug: "",
      image: null
    });
    setSelectedImage(null);
    setIsUploading(false);
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
    onSubmit(formData);
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
            className="w-[600px] overflow-hidden flex flex-col rounded-[26px] bg-[#F3F3F1] p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="mb-4">Add New Blog</h4>
            <form onSubmit={handleSubmit}>
              <div className="max-h-[80vh] overflow-y-auto">
                <LabeledInput
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
                <RichTextEditor
                  value={formData.content}
                  onChange={handleContentChange} />
                {/* <LimitedTextArea
                  placeholder="Content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  limit={5000}
                  required
                /> */}
                <ImageUploader onFileChange={handleFileChange} text="Add Image (optional)" />
                <LabeledInput
                  label="Meta Title"
                  name="meta_title"
                  tooltip={true}
                  tooltipText="The Meta Title is the main heading that appears in search results. Keep it concise, under 60 characters."
                  value={formData.meta_title}
                  onChange={handleChange}
                >
                </LabeledInput>
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
                <FullRoundedButton isLoading={isUploading} type="submit">
                  Add Blog
                </FullRoundedButton>
                <FullRoundedButton type="button" buttonType="danger" onClick={onClose}>
                  Close
                </FullRoundedButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddBlogModal;
