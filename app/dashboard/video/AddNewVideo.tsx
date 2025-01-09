'use client'
import FullRoundedButton from "@/app/components/Button/FullRoundedButton";
import React, { useState } from "react"
import AddVideoModal from "../components/AddVideoModal";

type AddNewVideoProps = {
  group_id: string;
  onAdd: (video: any) => void;
}

const AddNewVideo: React.FC<AddNewVideoProps> = ({
  group_id,
  onAdd,
}: AddNewVideoProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => {
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
  }

  const handleSubmit = async (formData: VideoType) => {
    const response = await fetch('/api/videos', {
      method: 'POST',
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    if (result.error) {
      console.log(result.error);
    } else {
      onAdd(result);

      closeModal();
    }
  };

  return (
    <>
      <FullRoundedButton onClick={openModal} className="mb-4">Add Video</FullRoundedButton>

      <AddVideoModal
        group_id={group_id}
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </>
  )
}

export default AddNewVideo;