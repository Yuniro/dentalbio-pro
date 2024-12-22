import { SubmitButton } from "./SubmitButton"; // Assuming this exists
import { Manrope } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { updatePasswordAction } from "./actions"; // Import the action here

const manrope = Manrope({ subsets: ["latin"] });

export default function UpdatePasswordPage() {

  return (
    <div className={`${manrope.className} text-center flex flex-col justify-center items-center py-20 gap-5`}>
      <span className="text-dark font-medium text-sm -mb-2">Reset your password</span>
      <h1 className="text-3xl pb-2 font-extrabold bg-gradient-to-r from-[#8866e9] via-[#cb7470] to-[#ed8b39] bg-clip-text text-transparent">
        Update Password
      </h1>

      <form action={updatePasswordAction} method="post" className="space-y-5 w-full max-w-xl">
        {/* Email Field */}
        <div className="relative z-50 font-semibold left-1/2 top-5 transform -translate-x-1/2 max-w-xl w-full px-5 mt-5">
          <div className="max-w-xl w-full rounded-[40px] border-[0.6px] shadow-sm bg-white bg-opacity-90 backdrop-blur-lg border-neutral-300 py-4 px-3 flex items-center justify-between transition-all duration-300 ease-in-out">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              className="w-full bg-transparent text-2xl text-dark px-4 py-1.5 outline-none placeholder-neutral-500"
            />
          </div>
        </div>

        {/* New Password Field */}
        <div className="relative z-50 font-semibold left-1/2 top-5 transform -translate-x-1/2 max-w-xl w-full px-5 mt-5">
          <div className="max-w-xl w-full rounded-[40px] border-[0.6px] shadow-sm bg-white bg-opacity-90 backdrop-blur-lg border-neutral-300 py-4 px-3 flex items-center justify-between transition-all duration-300 ease-in-out">
            <input
              type="password"
              name="password"
              placeholder="Enter your new password"
              required
              className="w-full bg-transparent text-2xl text-dark px-4 py-1.5 outline-none placeholder-neutral-500"
            />
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="relative z-50 font-semibold left-1/2 top-5 transform -translate-x-1/2 max-w-xl w-full px-5 mt-5">
          <div className="max-w-xl w-full rounded-[40px] border-[0.6px] shadow-sm bg-white bg-opacity-90 backdrop-blur-lg border-neutral-300 py-4 px-3 flex items-center justify-between transition-all duration-300 ease-in-out">
            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm your new password"
              required
              className="w-full bg-transparent text-2xl text-dark px-4 py-1.5 outline-none placeholder-neutral-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <SubmitButton />
      </form>

      <Link href={"/"}>
        <Image
          src={"/logo.svg"}
          width={150}
          height={25}
          alt="Logo"
          className="px-4 pt-20"
        />
      </Link>
    </div>
  );
}
