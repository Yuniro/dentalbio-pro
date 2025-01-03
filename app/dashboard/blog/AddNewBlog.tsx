'use client'
import FullRoundedButton from "@/app/components/Button/FullRoundedButton";
import React, { useReducer, useState } from "react"
import AddBlogModal from "../components/AddBlogModal";

type AddNewBlogProps = {
  onAdd: (blog: any) => void;
}

const AddNewBlog: React.FC<AddNewBlogProps> = ({
  onAdd,
}: AddNewBlogProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => {
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
  }

  const uploadImage = async (image: File) => {
    const formData = new FormData();
    formData.append('bucket_name', 'blog-images');
    formData.append('image', image);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    const result = await response.json();

    if (response.ok) {
      // console.log(`Image uploaded successfully! URL: ${result.publicUrl}`);
      return result.publicUrl;
    } else {
      console.log(`Error: ${result.error}`);
    }
  }

  const handleSubmit = async (formData: { title: string; content: string; image: File | null; meta_title: string; meta_description: string }) => {
    const image_url = formData.image ? await uploadImage(formData.image) : "";
    // const image_url = '';

    const response = await fetch('/api/blogs', {
      method: 'POST',
      body: JSON.stringify({ ...formData, image_url }),
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
      <FullRoundedButton onClick={openModal}>Add Blog</FullRoundedButton>

      <AddBlogModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </>
  )
}

export default AddNewBlog;