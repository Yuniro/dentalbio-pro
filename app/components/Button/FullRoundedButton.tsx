import { Spinner } from "@phosphor-icons/react/dist/ssr";
import React, { ButtonHTMLAttributes } from "react"

interface FullRoundedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  buttonType?: 'primary' | 'danger' | 'ghost' | 'warning';
}

const FullRoundedButton: React.FC<FullRoundedButtonProps> = ({
  children,
  className,
  isLoading,
  buttonType,
  ...props
}: FullRoundedButtonProps) => {
  return (
    <button
      className={(className ? className : "") + 
        (buttonType === 'danger' ? " bg-red-500 hover:bg-red-800" :
        buttonType === 'ghost' ? " bg-gray-500 hover:bg-gray-400" :
        buttonType === 'warning' ? " bg-[#DE8A6D] hover:bg-[#f58661]" :
        " bg-primary-1 hover:bg-[#302a83]" ) + " flex justify-center items-center px-[20px] py-[10px] font-bold text-white rounded-[26px] transition-all ease-in-out "}
      disabled={isLoading}
      {...props}
    >
      {isLoading && <Spinner className="animate-spin mr-1" size={20} />}
      {children}
    </button>
  )
}

export default FullRoundedButton;