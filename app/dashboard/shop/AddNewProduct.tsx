'use client'
import FullRoundedButton from "@/app/components/Button/FullRoundedButton";
import React, { useState } from "react"
import AddProductModal from "./components/AddProductModal";

type AddNewProductProps = {
  group_id: string;
  onAdd: (product: any) => void;
}

const AddNewProduct: React.FC<AddNewProductProps> = ({
  group_id,
  onAdd,
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

  const handleSubmit = async (formData: ProductType, image: File | null) => {
    const image_url = image ? await uploadImage(image) : "";

    const response = await fetch('/api/products', {
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
      <FullRoundedButton onClick={openModal} className="mb-4">Add Product</FullRoundedButton>

      <AddProductModal
        group_id={group_id}
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </>
  )
}

export default AddNewProduct;