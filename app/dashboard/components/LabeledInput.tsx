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
  value: controlledValue,
  defaultValue,
  ...props
}) => {
  const [value, setValue] = useState<string>(controlledValue as string ?? "");

  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false);

  useEffect(() => {
    if (controlledValue !== undefined) {
      setValue(controlledValue as string);
    }
  }, [controlledValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (controlledValue === undefined) {
      setValue(e.target.value);
    }
    onChange?.(e);
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => !value && setIsFocused(false);
  const showTooltip = () => setTooltipVisible(true);
  const hideTooltip = () => setTooltipVisible(false);

  return (
    <div className="mb-3 relative flex-grow">
      <div className="rounded-[26px] bg-white pt-[20px] pb-2 px-4 h-[50px]">
        <label
          onMouseEnter={showTooltip}
          onMouseLeave={hideTooltip}
          htmlFor={name}
          className={`absolute flex items-center gap-1 top-[12px] text-gray-500 transition-all duration-100 ease-linear transform cursor-pointer ${isFocused || defaultValue || value ? '-translate-y-[7px] text-xs' : 'scale-100'
            } ${children ? 'pl-5' : ''}`}
        >
          {label}
          {tooltip && (
            <div className="flex-grow">
              <Info size={20} />
              <div
                className={`absolute w-[400px] bottom-8 -left-5 bg-[#121822] text-white p-2 z-50 text-sm rounded-lg transition-opacity duration-300 ${tooltipVisible ? 'opacity-100 visible' : 'opacity-0 invisible'
                  }`}
              >
                {tooltipText}
              </div>
            </div>
          )}
        </label>
        {children}
        <input
          className={`w-full placeholder:text-neutral-500 text-neutral-800 placeholder:font-normal ${className}`}
          placeholder={isFocused || value || defaultValue ? placeholder : ''}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          id={name}
          name={name}
          value={controlledValue !== undefined ? value : undefined}
          defaultValue={controlledValue === undefined ? defaultValue : undefined}
          {...props}
        />
      </div>
    </div>
  );
};

export default LabeledInput;