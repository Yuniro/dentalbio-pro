// components/AddVideoModal.tsx

import { useEffect, useState } from "react";
import LabeledInput from "./LabeledInput";
import FullRoundedButton from "@/app/components/Button/FullRoundedButton";

type ModalProps = VideoType & {
  group_id: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: VideoType) => void;
}

const AddVideoModal: React.FC<ModalProps> = ({
  group_id,
  isOpen,
  onClose,
  onSubmit,
  ...props
}) => {
  const [formData, setFormData] = useState<VideoType>({
    title: "",
    group_id,
    link: "",
  });
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    if (props.id) {
      setFormData(props);
    } else {
      setFormData({
        title: "",
        group_id,
        link: "",
      });
    }
    setIsUploading(false);
  }, [isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    setIsUploading(true);
    onSubmit(formData);
  };

  return (
    <>
      {isOpen && (
        <div
          className="modal-overlay overflow-auto fixed bg-[#00000080] z-10 left-0 top-0 right-0 bottom-0 flex justify-center items-center"
          onMouseDown={onClose}
        >
          <div
            className="w-[600px] overflow-hidden flex flex-col rounded-[26px] bg-[#F3F3F1] p-10"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h4 className="mb-2">{props.id ? "Edit" : "Add New"} Video</h4>
            <div className="text-gray-500 text-sm pl-2">Enter the URL of your video. You can embed the video right on your Dentalbio.</div>
            <form action={handleSubmit}>
              <div className="max-h-[80vh] overflow-y-auto pt-3">
                <LabeledInput
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
                <LabeledInput
                  label="Video Link"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  tooltip
                  tooltipText={<>
                    <div>Please enter youtube or vimeo video links.</div>
                    <div className="">-https://www.youtube.com/watch?v=abc123</div>
                    <div className="">-https://vimeo.com/12345678</div>
                  </>}
                  required
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <FullRoundedButton isLoading={isUploading} type="submit">
                  {props.id ? "Update" : "Add"} Video
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

export default AddVideoModal;
