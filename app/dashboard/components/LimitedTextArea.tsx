// components/AboutText.tsx
'use client'

import React, { InputHTMLAttributes, useState } from 'react';

interface LimitedTextAreaProp extends InputHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  defaultText?: string;
  required?: boolean;
}

const LimitedTextArea: React.FC<LimitedTextAreaProp> = ({
  name,
  placeholder,
  ...props
}) => {
  const [aboutTextContent, setAboutTextContent] = useState(props?.defaultValue as string || ""); // Track the textarea content
  const [isFocused, setIsFocused] = useState(false);
  const maxLimit = 200;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Prevent input beyond the max limit
    if (e.target.value.length <= maxLimit) {
      setAboutTextContent(e.target.value);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (aboutTextContent === '') {
      setIsFocused(false);
    }
  };

  return (
    <>
      <div className="mb-3">
        <div className='relative rounded-[26px] bg-white pt-[20px] pb-2 px-4'>
          <label
            htmlFor={name}
            className={`absolute top-[12px] text-gray-500 transition-all duration-100 ease-linear transform ${isFocused || aboutTextContent ? '-translate-y-[7px] text-xs' : 'scale-100'}`}
          >
            {placeholder}
          </label>
          <textarea
            name={name}
            className="w-full resize-none focus:outline-none text-base placeholder:text-neutral-500 text-neutral-800 placeholder:font-normal min-h-40"
            // placeholder={placeholder}
            value={aboutTextContent}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
        </div>
        <div className='text-right text-gray-500'>{aboutTextContent.length}/{maxLimit}</div>
      </div>
    </>
  );
}

export default LimitedTextArea;