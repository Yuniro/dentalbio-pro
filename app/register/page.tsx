"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Manrope } from "next/font/google";
import React, { useState } from "react";
import Dropdown from "./Dropdown";
import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";
import ClaimForm from "../components/home-page/ClaimForm";
import Country from "./Country";
import Image from "next/image";
import Link from "next/link";
import ErrorMessage from "../components/ErrorMessage";
import { countries, positions, titles } from "@/utils/global_constants";

const manrope = Manrope({ subsets: ["latin"] });

export default function Page() {
  const searchParams = useSearchParams();
  const usernameFromUrl = searchParams.get("username");
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    birthday: "",
    offerCode: "",
    position: "",
    country: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [subErrorMessage, setSubErrorMessage] = useState<string | null>(null);

  // Handle input changes
  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate password length
  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  // Check if all fields are completed
  const validateAllFields = () => {
    return (
      formData.title &&
      formData.firstName &&
      formData.lastName &&
      formData.birthday &&
      formData.position &&
      formData.offerCode &&
      formData.country &&
      formData.email &&
      formData.password &&
      formData.confirmPassword
    );
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!validateAllFields()) {
      setErrorMessage("Oops! It looks like you missed some fields.");
      setSubErrorMessage("Complete the form and try again.");
      return;
    }

    // Validate email and password
    if (!validateEmail(formData.email)) {
      setErrorMessage("Your email doesn't seem to be valid.");
      setSubErrorMessage("Check for typos and try again.");
      return;
    }

    if (!validatePassword(formData.password)) {
      setErrorMessage("Password too short.");
      setSubErrorMessage("Make sure it's 6 characters or longer.");
      return;
    }

    // Validate that passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Your passwords don't match.");
      setSubErrorMessage("Try typing them again.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    // Send registration data to the API
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        username: usernameFromUrl || "",
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthday: formData.birthday,
        position: formData.position,
        offerCode: formData.offerCode,
        country: formData.country,
        title: formData.title,
        redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/confirm`,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      router.push(`/register/success?username=${encodeURIComponent(usernameFromUrl || "")}`);
    } else {
        setErrorMessage(data.error || "There was an issue with registration.");
        setSubErrorMessage("Please try again.");
    }
    setLoading(false);
  };

  return (
    <>
      <div
        className={`${manrope.className} text-center flex flex-col justify-start items-center py-10 gap-5 pt-20 min-h-screen`}
      >
        {!usernameFromUrl ? (
          <div className=" h-full text-center flex flex-col justify-between items-center py-10 gap-32">
            <div className="flex flex-col justify-center items-center gap-5">
              <span className="text-[23px] md:text-[26px] font-semibold bg-gradient-to-r mb-3 from-primary-1 via-primary-2 to-primary-orange-1 bg-clip-text text-transparent">
                Choose your username
              </span>
              <ClaimForm />
            </div>
            <Link href={"/"} className=" mt-20">
              <Image
                src="/logo.svg"
                width={150}
                height={40}
                alt="Footer logo"
                className="mb-10 mt-20"
              />
            </Link>
          </div>
        ) : (
          <>
            <span className="text-dark font-medium text-sm -mb-2">
              Congratulations!
            </span>
            <span className="text-3xl font-extrabold bg-gradient-to-r from-[#8866e9] via-[#cb7470] to-[#ed8b39] bg-clip-text text-transparent">
              dental.bio/{usernameFromUrl}
            </span>
            <span className="text-dark font-medium text-sm -mt-2">
              is available, make it yours:
            </span>
            <span className="text-4xl font-bold text-dark mt-4 -mb-6">
              Almost there
            </span>

            <div className="space-y-7 max-w-screen-sm w-full">
              <Dropdown
                selected={formData.title}
                onSelect={(value) => handleInputChange("title", value)}
                options={titles}
                label="Title"
              />
              <CustomInput
                value={formData.firstName}
                onChange={(value) => handleInputChange("firstName", value)}
                placeholder="First Name"
              />
              <CustomInput
                value={formData.lastName}
                onChange={(value) => handleInputChange("lastName", value)}
                placeholder="Last Name"
              />
              <CustomInput
                value={formData.birthday}
                onChange={(value) => handleInputChange("birthday", value)}
                type="date"
                placeholder="Birthday"
              />
              <Dropdown
                selected={formData.position}
                onSelect={(value) => handleInputChange("position", value)}
                options={positions}
                label="Position"
              />
              <CustomInput
                value={formData.offerCode}
                onChange={(value) => handleInputChange("offerCode", value)}
                placeholder="OfferCode (optional)"
              />
              <Country
                selected={formData.country}
                onSelect={(value) => handleInputChange("country", value)}
                options={countries}
                label="Country"
              />
              <CustomInput
                value={formData.email}
                onChange={(value) => handleInputChange("email", value)}
                placeholder="Email"
                type="email"
              />
              <CustomInput
                value={formData.password}
                onChange={(value) => handleInputChange("password", value)}
                placeholder="Password"
                type="password"
              />
              <CustomInput
                value={formData.confirmPassword}
                onChange={(value) =>
                  handleInputChange("confirmPassword", value)
                }
                placeholder="Confirm Password"
                type="password"
              />
              {errorMessage && (
                <div className=" pt-8 text-center">
                  <ErrorMessage
                    errorMessage={errorMessage}
                    subError={subErrorMessage || ""}
                  />
                </div>
              )}
              <CustomButton
                text={loading ? "Claiming..." : `Claim @${usernameFromUrl}`}
                onClick={handleSubmit}
              />
            </div>
            <span className=" mt-10">
              Already have an account?{" "}
              <Link href={"/login"} className="underline">
                Log in
              </Link>
            </span>
            <Link href={"/"} >
              <Image
                src="/logo.svg"
                width={150}
                height={40}
                alt="Footer logo"
                className="mb-10 mt-20"
              />
            </Link>
          </>
        )}
      </div>
    </>
  );
}
