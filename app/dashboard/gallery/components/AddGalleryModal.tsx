// components/AddGalleryModa.tsx

import { useEffect, useState } from "react";
import FullRoundedButton from "@/app/components/Button/FullRoundedButton";
import LabeledInput from "../../components/LabeledInput";
import ImageUploader from "../../components/ImageUploader";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: { title: string; before_image: File | null; after_image: File | null }) => void;
}

const AddGalleryModal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    before_image: null,
    after_image: null,
  });
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    setFormData({
      title: "",
      before_image: null,
      after_image: null,
    });
    setIsUploading(false);
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

    if (formData.before_image && formData.after_image) {
      onSubmit(formData);
      return;
    }
  };

  const handleFileChange = (image: File, isAfter: boolean) => {
    const name = isAfter ? "after_image" : "before_image";
    setFormData((prevState) => ({
      ...prevState,
      [name]: image
    }))
  }

  return (
    <>
      {isOpen && (
        <div className="modal-overlay fixed bg-[#00000080] z-10 left-0 top-0 right-0 bottom-0 flex justify-center items-center" onClick={onClose}>
          <div className="w-[600px] rounded-[26px] bg-[#F3F3F1] p-10" onClick={(e) => e.stopPropagation()}>
            <h4 className="mb-4">Add New Gallery</h4>
            <form onSubmit={handleSubmit}>
              <LabeledInput
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <ImageUploader
                id="before_image"
                text="Add before image"
                onFileChange={(image) => handleFileChange(image, false)}
              />
              <ImageUploader
                id="after_image"
                text="Add after image"
                onFileChange={(image) => handleFileChange(image, true)}
              />
              <div className="flex justify-end gap-2">
                {/* <SaveButton text="Add Gallery" /> */}
                <FullRoundedButton isLoading={isUploading} type="submit">Add Gallery</FullRoundedButton>
                <FullRoundedButton type="button" buttonType="danger" onClick={onClose}>Close</FullRoundedButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddGalleryModal;
