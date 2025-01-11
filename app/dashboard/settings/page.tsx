import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SaveButton from "../components/SaveButton";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import { titles } from "@/utils/global_constants";

// Fetch authenticated user details
async function getUserDetails() {
  "use server";
  const supabase = createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();

  if (authError || !userData?.user) {
    return redirect("/login");
  }

  const userEmail = userData.user.email;

  const { data: userRecord, error: userError } = await supabase
    .from("users")
    .select("id, email, first_name, middle_name, last_name, title, position")
    .eq("email", userEmail)
    .single();

  if (userError || !userRecord) {
    return redirect("/error?message=user_not_found");
  }

  return userRecord;
}

// Server action to update user details
async function updateUserDetails(formData: FormData) {
  "use server";
  const supabase = createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();

  if (authError || !userData?.user) {
    return redirect("/login");
  }

  const userEmail = userData.user.email;

  const updatedUserDetails = {
    first_name: formData.get("first_name") as string,
    middle_name: formData.get("middle_name") as string,
    last_name: formData.get("last_name") as string,
    title: formData.get("title") as string,
  };

  const { error: updateError } = await supabase
    .from("users")
    .update(updatedUserDetails)
    .eq("email", userEmail);

  if (updateError) {
    return redirect("/error?message=failed_to_update_user_details");
  }
}

// Main page component
export default async function SettingsPage() {
  const user = await getUserDetails(); // Fetch user details

  return (
    <div className="memberpanel-details-wrapper">
      <div id="columns">
        <div className="text-center bg-[#F7FAFC] p-2 rounded-[26px] text-gray-500 font-semibold my-4">These details are private, and will not be visible on your Dentalbio.</div>
        <h2 className="text-lg font-semibold text-dark">Settings</h2>

        {/* Form to update user details */}
        <form action={updateUserDetails} className="mb-10 ml-2">
          <div className="mb-3 relative">
            <h2 className="text-base text-dark">Title</h2>
            <div className="relative">
              <select
                name="title"
                className="w-full appearance-none p-2 rounded-[26px] py-2 text-base px-3 text-neutral-800 pr-10"
                defaultValue={user?.title || ""}
              >
                {titles.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
              <CaretDown
                size={20}
                weight="bold"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 pointer-events-none"
              />
            </div>
          </div>

          {/* First Name */}
          <div className="mb-3">
            <h2 className="text-base text-dark">First Name</h2>
            <input
              name="first_name"
              className="w-full p-2 rounded-[26px] py-2 text-base px-3 placeholder:text-neutral-500 text-neutral-800"
              defaultValue={user?.first_name || ""}
              placeholder="First Name"
            />
          </div>

          {/* Middle Name */}
          <div className="mb-3">
            <h2 className="text-base text-dark">Middle Name (optional)</h2>
            <input
              name="middle_name"
              className="w-full p-2 rounded-[26px] py-2 text-base px-3 placeholder:text-neutral-500 text-neutral-800"
              defaultValue={user.middle_name || ""}
              placeholder="Middle Name (optional)"
            />
          </div>

          {/* Last Name */}
          <div className="mb-3">
            <h2 className="text-base text-dark">Last Name</h2>
            <input
              name="last_name"
              className="w-full p-2 rounded-[26px] py-2 text-base px-3 placeholder:text-neutral-500 text-neutral-800"
              defaultValue={user?.last_name || ""}
              placeholder="Last Name"
            />
          </div>

          {/* Save Button */}
          <div className="w-full flex items-end justify-end">
            <SaveButton />
          </div>
        </form>

        <hr className="mb-10 border-neutral-400" />

        <ForgotPasswordForm defaultEmail={user.email} />
      </div>
    </div>
  );
}
