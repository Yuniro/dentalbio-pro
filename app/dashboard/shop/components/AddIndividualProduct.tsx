'use client'
import FullRoundedButton from "@/app/components/Button/FullRoundedButton";
import React, { useState } from "react"
import AddIndividualProductModal from "./AddIndividualProductModal";

type AddNewProductProps = {
  onAdd: (product: any) => void;
  targetUserId: string;
  enabled: boolean;
}

const AddIndividualProduct: React.FC<AddNewProductProps> = ({
  onAdd,
  targetUserId,
  enabled,
}: AddNewProductProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => {
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
  }

  const uploadImage = async (image: File) => {
    const formData = new FormData();
    formData.append('bucket_name', 'product-images');
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

  const handleSubmit = async (formData: IndividualProductType, image: File | null) => {
    const image_url = image ? await uploadImage(image) : "";

    const response = await fetch('/api/individual-products', {
      method: 'POST',
      body: JSON.stringify({ ...formData, image_url, targetUserId }),
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
      <FullRoundedButton onClick={openModal} className="mb-4" disabled={!enabled}>Add Product</FullRoundedButton>

      <AddIndividualProductModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </>
  )
}

export default AddIndividualProduct;