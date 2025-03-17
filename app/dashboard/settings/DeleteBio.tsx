'use client'

import FullRoundedButton from "@/app/components/Button/FullRoundedButton";
import ConfirmMessage from "@/app/components/Modal/ConfirmMessagel";
import { useState } from "react";

type DeleteBioProps = {
  handleDelete: () => void;
}

const DeleteBio: React.FC<DeleteBioProps> = ({ handleDelete }) => {
  const [isOpenDeleteConfirmMessage, setIsOpenDeleteConfirmMessage] = useState<boolean>(false);

  return (
    <div>
      <h2 className="text-lg font-semibold text-dark text-start w-full mb-0">
        Delete this Bio
      </h2>

      <div className="text-sm text-gray-500 my-1 ml-2">Once you delete your bio, it cannot be recovered.</div>

      <div className="flex justify-end">
        <FullRoundedButton onClick={() => setIsOpenDeleteConfirmMessage(true)} buttonType="danger" className="my-2">Delete Bio</FullRoundedButton>
      </div>

      <ConfirmMessage
        description="Aure you sure you want to delete your bio?"
        okText="Delete"
        isOpen={isOpenDeleteConfirmMessage}
        onClose={() => setIsOpenDeleteConfirmMessage(false)}
        onOk={handleDelete}
      />
    </div>
  )
}

export default DeleteBio;