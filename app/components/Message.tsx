'use client'
import React, { useState } from "react";
import FullRoundedButton from "./Button/FullRoundedButton";
import { useMessage } from "../contexts/MessageContext";

const Message: React.FC = () => {
  const { messageStatus, closeMessage } = useMessage();

  return (
    <>
      {messageStatus.isOpen && (
        <div
          className={`modal-overlay overflow-auto fixed bg-[#00000080] cursor-pointer z-10 top-0 left-0 right-0 bottom-0 flex justify-center items-center ${messageStatus.isOpen ? "animate-fade-in-short" : "animate-fade-out-short"
            }`}
          onMouseDown={closeMessage}
        >
          <div
            className="w-[600px] overflow-hidden cursor-auto flex flex-col rounded-[26px] bg-[#F3F3F1] px-10 pt-8 pb-6"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="text-xl">{messageStatus.message}</div>
            <div className="flex justify-end mt-4 gap-2">
              {messageStatus.extraButtons}
              <FullRoundedButton onClick={closeMessage} buttonType="danger">
                Close
              </FullRoundedButton>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Message;