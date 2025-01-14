// components/LabeledInput.tsx
'use client'
import { Info } from '@phosphor-icons/react/dist/ssr';
import React, { InputHTMLAttributes, useEffect, useState } from 'react';

interface AboutTextProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  tooltip?: boolean;
  tooltipText?: React.ReactNode;
  placeholder?: string;
  className?: string;
  children?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LabeledInput: React.FC<AboutTextProps> = ({
  name,
  label,
  tooltip,
  tooltipText,
  placeholder,
  className,
  children,
  onChange,
  ...props
}) => {
  const [value, setValue] = useState<string>(props.value ? props.value as string : props?.defaultValue as string || "");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false);

  useEffect(() => {
    if (props.value)
      setValue(props.value as string);
  }, [props])

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

  const showTooltip = () => {
    setTooltipVisible(true);
  }

  const hideTooltip = () => {
    setTooltipVisible(false);
  }

  return (
    <div className="mb-3 relative flex-grow">
      <div className='rounded-[26px] bg-white pt-[20px] pb-2 px-4 h-[50px]'>
        <label
          onMouseEnter={showTooltip}
          onMouseLeave={hideTooltip}
          htmlFor={name}
          className={`absolute flex items-center gap-1 top-[12px] text-gray-500 transition-all duration-100 ease-linear transform cursor-pointer ${isFocused || value ? '-translate-y-[7px] text-xs' : 'scale-100'} ${children ? "pl-5" : ""}`}
        >
          {label}
          {tooltip &&
            <div
              // onMouseEnter={showTooltip}
              // onMouseLeave={hideTooltip}
              className='flex-grow'>
              <Info
                size={20}
              />
              {/* {tooltipVisible && */}
              <div className={`absolute w-[400px] bottom-8 -left-5 bg-[#121822] text-white p-2 z-50 text-sm rounded-lg transition-opacity duration-300 ${tooltipVisible ? "opacity-100 visible" : "opacity-0 invisible"}`}>{tooltipText}</div>
            </div>}
        </label>

        {children}
        <input
          className={`w-full placeholder:text-neutral-500 text-neutral-800 placeholder:font-normal ${className}`}
          placeholder={isFocused || value ? placeholder : ''}
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