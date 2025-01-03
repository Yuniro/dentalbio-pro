// components/AddGalleryModa.tsx

import { useEffect, useState } from "react";
import FullRoundedButton from "@/app/components/Button/FullRoundedButton";
import LabeledInput from "../../components/LabeledInput";
import LimitedTextArea from "../../components/LimitedTextArea";
import ImageUploader from "../../components/ImageUploader";

interface ModalProps extends GalleryType {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (gallery: GalleryType, before_image_file: File | null, after_image_file: File | null) => void;
}

const EditGalleryModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  ...props
}) => {
  const [formData, setFormData] = useState<GalleryType>(props);
  const [beforeImageFile, setBeforeImageFile] = useState<File | null>(null);
  const [afterImageFile, setAfterImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [beforeImage, setBeforeImage] = useState<string | null>(props.before_image_url);
  const [afterImage, setAfterImage] = useState<string | null>(props.after_image_url);

  useEffect(() => {
    setBeforeImage(isOpen ? props.before_image_url : null);
    setAfterImage(isOpen ? props.after_image_url : null);

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
    onSubmit(formData, beforeImageFile, afterImageFile);
  };

  const handleFileChange = (image: File, after: boolean) => {
    if (after)
      setAfterImageFile(image);
    else
      setBeforeImageFile(image);
  }

  return (
    <>
      {isOpen && (
        <div className="modal-overlay fixed bg-[#00000080] z-10 left-0 top-0 right-0 bottom-0 flex justify-center items-center" onClick={onClose}>
          <div className="w-[600px] rounded-[26px] bg-[#F3F3F1] p-10" onClick={(e) => e.stopPropagation()}>
            <h4 className="mb-4">Edit Gallery</h4>
            <form onSubmit={handleSubmit}>
              <div className="max-h-[80vh] overflow-y-auto">
                <LabeledInput
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
                <ImageUploader
                  onFileChange={(image) => handleFileChange(image, false)}
                  image_url={beforeImage!}
                />
                <ImageUploader
                  onFileChange={(image) => handleFileChange(image, true)}
                  image_url={afterImage!}
                />
              </div>
              <div className="flex justify-end gap-2">
                {/* <SaveButton text="Add Gallery" /> */}
                <FullRoundedButton isLoading={isUploading} type="submit">Update Gallery</FullRoundedButton>
                <FullRoundedButton type="button" buttonType="danger" onClick={onClose}>Close</FullRoundedButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditGalleryModal;
