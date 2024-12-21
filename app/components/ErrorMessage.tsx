import React from "react";
import XIcon from "./XIcon";

type Props = { errorMessage: string; subError?: string };

export default function ErrorMessage({ errorMessage, subError }: Props) {
  return (
    <>
      <div className=" w-full px-5 mx-auto">
        <div className="border border-red-300 w-min text-red-600 flex items-center justify-start gap-3 whitespace-nowrap font-medium mx-auto py-2 px-2.5 rounded-full bg-red-100">
          <XIcon />
          <div className=" flex flex-col items-start justify-center gap-0.5  pr-3">
            <span>{errorMessage}</span>
            <span className=" font-light">
              {subError ? subError : "Please try again!"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
