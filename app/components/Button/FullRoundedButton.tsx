import React, { ButtonHTMLAttributes } from "react"

interface FullRoundedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
}

const FullRoundedButton: React.FC<FullRoundedButtonProps> = ({
  children,
  className,
  ...props
}: FullRoundedButtonProps) => {
  return (
    <button
      className={"px-[20px] py-[10px] bg-[#5046db] hover:bg-[#302a83] font-bold text-white rounded-[26px] transition-all ease-in-out " + className}
      {...props}
    >
      {children}
    </button>
  )
}

export default FullRoundedButton;