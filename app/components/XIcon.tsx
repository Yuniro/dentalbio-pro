import React from "react";

type Props = {};

export default function XIcon({}: Props) {
  return (
    <div className=" bg-red-50 border-8 h-12 border-red-300 rounded-full flex items-center justify-center aspect-square">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="size-6 p-0.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18 18 6M6 6l12 12"
        />
      </svg>
    </div>
  );
}
