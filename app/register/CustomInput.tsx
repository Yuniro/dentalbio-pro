"use client";

import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css"; // Import flatpickr styles

type CustomInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  name?: string;
  labelBottom?: string;
};

export default function CustomInput({
  value,
  onChange,
  placeholder,
  type = "text",  // Default to text if no type provided
  name,
  labelBottom
}: CustomInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (type === "date" && inputRef.current) {
      const fp = flatpickr(inputRef.current, {
        dateFormat: "d/m/Y",
        defaultDate: value,
        onChange: (_, dateStr) => {
          onChange(dateStr)
        },
      });

      return () => {
        fp.destroy();
      };
    }
  }, [type, value, onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative left-1/2 top-5 transform -translate-x-1/2 max-w-xl w-full px-5 mt-5">
      <div className="max-w-xl w-full rounded-[40px] border-[0.6px] shadow-sm bg-white bg-opacity-90 backdrop-blur-lg border-neutral-300 py-4 px-3 flex items-center justify-between transition-all duration-300 ease-in-out">
        <input
          type={type !== "date" ? type : "text"}
          name={name ? name : "text"}
          value={value}
          onChange={handleChange}
          required
          placeholder={placeholder}
          className="w-full bg-transparent text-2xl text-dark font-semibold px-4 py-1.5 outline-none placeholder-neutral-500 placeholder:text-2xl"
          ref={inputRef}
        />
        {type === "date" && (
          <span className="text-gray-500 text-sm ml-2">dd/mm/yyyy</span>
        )}
      </div>
      {
        labelBottom &&
        <div className="text-dark font-medium text-sm mx-10 mt-2">
          {labelBottom}
        </div>
      }
    </div>
  );
}
