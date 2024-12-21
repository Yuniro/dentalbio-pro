// components/LabeledInput.tsx
'use client'
import React, { InputHTMLAttributes, useState } from 'react';

interface AboutTextProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  className?: string;
  children?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LabeledInput: React.FC<AboutTextProps> = ({
  name,
  label,
  className,
  children,
  onChange,
  ...props
}) => {
  const [value, setValue] = useState<string>(props?.defaultValue as string || "");
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (onChange)
      onChange(e);
  }

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (value === '') {
      setIsFocused(false);
    }
  };

  return (
    <div className="mb-3 relative">
      <div className='rounded-[26px] bg-white pt-[20px] pb-2 px-4 h-[50px]'>
        <label
          htmlFor={name}
          className={`absolute top-[12px] text-gray-500 transition-all duration-100 ease-linear transform ${isFocused || value ? '-translate-y-[7px] text-xs' : 'scale-100'} ${children ? "pl-5" : ""}`}
        >
          {label}
        </label>

        {children}
        <input
          className={`w-full placeholder:text-neutral-500 text-neutral-800 placeholder:font-normal ${className}`}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          id={name}
          name={name}
          {...props}
        />
      </div>
    </div>
  );
}

export default LabeledInput;