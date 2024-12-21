import Link from "next/link";
import React from "react";

type Props = {};

export default function ExampleBtn({}: Props) {
  return (
    <div className=" bg-primary-1 hover:bg-opacity-95 transition-all select-none mt-6 w-min mx-auto py-2.5 px-6 text-sm md:text-base rounded-3xl text-white font-medium whitespace-nowrap">
      <Link href={"https://digimax.uk/dentalbio/"} target="_blank" className="">
        View example
      </Link>
    </div>
  );
}
