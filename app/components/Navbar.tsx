"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// function Hamburger() {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       fill="none"
//       viewBox="0 0 24 24"
//       strokeWidth={1.5}
//       stroke="currentColor"
//       className="size-6"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
//       />
//     </svg>
//   );
// }
// function CloseIcon() {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       fill="none"
//       viewBox="0 0 24 24"
//       strokeWidth={1.5}
//       stroke="currentColor"
//       className="size-6"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         d="M6 18 18 6M6 6l12 12"
//       />
//     </svg>
//   );
// }

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // const toggleMenu = () => {
  //   setIsOpen(!isOpen);
  // };

  return (
    <nav className="fixed z-[999999999] left-1/2 top-4 transform -translate-x-1/2 md:max-w-[600px] max-w-lg w-full px-5">
      <div 
        className="max-w-[600px] w-full rounded-[30px] border-[0.6px] shadow-sm bg-white bg-opacity-90 backdrop-blur-lg border-neutral-300 py-1 px-2 flex flex-row items-center justify-between transition-all duration-300 ease-in-out h-[60px]"
      >
        {/* Top Row with Logo and Hamburger */}
        <div className="w-full flex justify-between items-center">
          {/* Logo on the left */}
          <Link href={"/"}>
            <Image
              src={"/logo.svg"}
              width={150}
              height={30}
              alt="Dental.bio navigation bar logo"
              className="px-3 "
            />
          </Link>
        </div>
        <div className="flex items-center justify-center gap-2.5 mt-0">
          <Link
            href={"/#features"}
            className="bg-transparent px-4 py-2.5 rounded-full hidden md:block transition-all text-base whitespace-nowrap text-dark"
          >
            Features
          </Link>
          <Link
            href={"/register"}
            className="bg-primary-3 px-4 py-2.5 rounded-full hover:bg-opacity-80 transition-all text-base whitespace-nowrap text-white"
          >
            Join free
          </Link>
          <Link
            href={"https://digimax.uk/dentalbio/"}
            target="_blank"
            className="bg-primary-4 px-4 py-2.5 rounded-full hover:bg-opacity-80 transition-all text-base whitespace-nowrap text-white"
          >
            Example
          </Link>
          <Link
            href={"/login"}
            className="bg-primary-4 px-4 py-2.5 rounded-full hidden sm:block hover:bg-opacity-80 transition-all text-base whitespace-nowrap text-white"
          >
            Log in
          </Link>
        </div>
      </div>
    </nav>
  );
}
