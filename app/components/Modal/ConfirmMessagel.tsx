// components/ConfirmMessage.tsx

import FullRoundedButton from "../Button/FullRoundedButton";

interface ModalProps {
  isOpen: boolean;
  description: string;
  okText?: string;
  cancelText?: string;
  type?: 'primary' | 'danger';
  onOk: () => void;
  onClose: () => void;
}

const ConfirmMessage: React.FC<ModalProps> = ({
  isOpen,
  description,
  okText,
  cancelText,
  type,
  onOk,
  onClose,
}) => {

  return (
    <>
      {isOpen &&
        <div
          className={`modal-overlay cursor-pointer fixed bg-[#00000080] z-10 left-0 top-0 right-0 bottom-0 flex justify-center items-center  ${isOpen ? "animate-fade-in-short" : "animate-fade-out-short"}`}
          onMouseDown={onClose}
        >
          <div className="bg-white p-4 cursor-auto rounded-[26px]" onMouseDown={(e) => e.stopPropagation()}>
            <div className="pb-4 text-lg">{description}</div>
            <div className="flex justify-end gap-2">
              <FullRoundedButton buttonType="danger" type="submit" onClick={onOk}>{okText ? okText : "Yes"}</FullRoundedButton>
              <FullRoundedButton buttonType="ghost" onClick={onClose}>{cancelText ? cancelText : "Close"}</FullRoundedButton>
            </div>
          </div>
        </div>}
    </>
  );
};

export default ConfirmMessage;
