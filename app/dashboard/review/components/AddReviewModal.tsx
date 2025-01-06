// components/AddReviewModa.tsx

import { useEffect, useState } from "react";
import FullRoundedButton from "@/app/components/Button/FullRoundedButton";
import LabeledInput from "../../components/LabeledInput";
import ImageUploader from "../../components/ImageUploader";
import LimitedTextArea from "../../components/LimitedTextArea";
import ReactStars from "react-stars";
import CustomDatePicker from "@/app/components/DatePicker/DatePicker";

type ModalProps = ReviewType & {
  username: string;
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (formData: ReviewType, image_file: File | null) => void;
  onEdit?: (formData: ReviewType, image_file: File | null) => void;
}

const AddReviewModal: React.FC<ModalProps> = ({
  username,
  isOpen,
  onClose,
  onCreate,
  onEdit,
  ...props
}) => {
  const [formData, setFormData] = useState<ReviewType>({
    reviewer_name: "",
    stars: 5,
    content: "",
    image_url: "",
    created_at: null,
    platform: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    if (props.id) {
      setFormData(props);
    } else {
      setFormData({
        reviewer_name: "",
        stars: 5,
        content: "",
        image_url: "",
        created_at: null,
        platform: "",
      });
    }

    setSelectedImage(null);
    setIsUploading(false);
  }, [isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleStarsChange = (stars: number) => {
    setFormData((prevState) => ({
      ...prevState,
      stars
    }));
  }

  const handleDateChange = (date: Date | null) => {
    setFormData((prevState) => ({
      ...prevState,
      created_at: date,
    }));
  }

  const handleSubmit = () => {
    setIsUploading(true);
    if (props.id && onEdit)
      onEdit({ ...props, ...formData }, selectedImage);
    else if (onCreate)
      onCreate(formData, selectedImage);
  };

  const handleFileChange = (image: File) => {
    setSelectedImage(image);
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
            <h4 className="mb-4">Add New Review</h4>
            <form action={handleSubmit}>
              <div className="max-h-[70vh] overflow-y-auto">
                <LabeledInput
                  label="Reviewer Name"
                  name="reviewer_name"
                  value={formData.reviewer_name}
                  onChange={handleChange}
                  required
                />
                <LimitedTextArea
                  placeholder="Review Content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                />
                <CustomDatePicker
                  selectedDate={formData.created_at}
                  onChange={handleDateChange}
                  className="w-full"
                />
                <ReactStars
                  count={5}
                  size={80}
                  color2={"#ffd700"}
                  half={false}
                  value={formData.stars}
                  onChange={handleStarsChange}
                  className="flex justify-around mb-3 react-star"
                />
                <ImageUploader
                  image_url={formData.image_url}
                  onFileChange={handleFileChange}
                  text="Add Photo (optional)"
                />
                <LabeledInput
                  label="Review Platform"
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <FullRoundedButton isLoading={isUploading} type="submit">
                  {props.id ? "Update" : "Add"} Review
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

export default AddReviewModal;
