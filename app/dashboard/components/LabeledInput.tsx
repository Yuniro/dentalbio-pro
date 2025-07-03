'use client'
import { Info } from '@phosphor-icons/react/dist/ssr';
import React, { InputHTMLAttributes, useState } from 'react';

interface LabeledInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  tooltip?: boolean;
  tooltipText?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

const LabeledInput: React.FC<LabeledInputProps> = ({
  name,
  label,
  tooltip,
  tooltipText,
  className = '',
  children,
  value,
  defaultValue,
  onChange,
  ...props
}) => {
  // For floating label: track focus and value (for uncontrolled)
  const [isFocused, setIsFocused] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState<string>(
    defaultValue ? String(defaultValue) : ''
  );
  const [tooltipVisible, setTooltipVisible] = useState(false);

  // Determine if label should float
  const isFloating = isFocused || Boolean(value ?? uncontrolledValue);

  // Handle change for uncontrolled
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (value === undefined) {
      setUncontrolledValue(e.target.value);
    }
    onChange?.(e);
  };

  return (
    <div className="mb-3 relative flex-grow">
      <div className="rounded-[26px] bg-white pt-[20px] pb-2 px-4 h-[50px]">
        <label
          onMouseEnter={() => setTooltipVisible(true)}
          onMouseLeave={() => setTooltipVisible(false)}
          htmlFor={name}
          className={`absolute flex items-center gap-1 top-[12px] text-gray-500 transition-all duration-100 ease-linear transform cursor-pointer ${isFloating ? '-translate-y-[7px] text-xs' : 'scale-100'} ${children ? 'pl-7' : ''}`}
        >
          {label}
          {tooltip && (
            <div className="flex-grow">
              <Info size={20} />
              <div
                className={`absolute w-[300px] md:w-[400px] bottom-8 left-0 bg-[#121822] text-white p-2 z-50 text-sm rounded-lg transition-opacity duration-300 ${tooltipVisible ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
              >
                {tooltipText}
              </div>
            </div>
          )}
        </label>
        {children}
        <input
          className={`w-full placeholder:text-neutral-500 text-neutral-800 placeholder:font-normal ${className}`}
          placeholder={isFloating ? props.placeholder : ''}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          id={name}
          name={name}
          value={value !== undefined ? value : uncontrolledValue}
          defaultValue={value === undefined ? defaultValue : undefined}
          onChange={handleChange}
          {...props}
        />
      </div>
    </div>
  );
};

export default LabeledInput;