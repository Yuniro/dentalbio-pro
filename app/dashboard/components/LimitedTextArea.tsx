// components/AboutText.tsx
'use client'

import React, { useState } from 'react';

type LimitedTextAreaProp = {
  name: string;
  defaultText?: string;
  placeholder?: string;
  required?: boolean;
}

const LimitedTextArea: React.FC<LimitedTextAreaProp> = ({
  name,
  defaultText,
  placeholder,
  required,
}) => {
  const [aboutTextContent, setAboutTextContent] = useState(defaultText || ""); // Track the textarea content
  const maxLimit = 200;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Prevent input beyond the max limit
    if (e.target.value.length <= maxLimit) {
      setAboutTextContent(e.target.value);
    }
  };

  return (
    <>
      <div className="mb-3">
        <textarea
          name={name}
          className="w-full resize-none p-2 focus:outline-none rounded-[26px] py-2 text-base px-3 placeholder:text-neutral-500 text-neutral-800 placeholder:font-normal min-h-40"
          placeholder={placeholder}
          defaultValue={defaultText || ""}
          value={aboutTextContent}
          onChange={handleChange}
          required={required && true}
        />
        <div className='text-right text-gray-500'>{aboutTextContent.length}/{maxLimit}</div>
      </div>
    </>
  );
}

export default LimitedTextArea;