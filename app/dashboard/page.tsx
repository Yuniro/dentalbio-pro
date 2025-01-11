import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

import SaveButton from "./components/SaveButton";
import {
  FacebookLogo,
  InstagramLogo,
  LinkSimple,
  TiktokLogo,
  TwitterLogo,
  Phone,
  At,
  CalendarPlus,
  CaretDown,
  Certificate,
  Subtitles,
} from "@phosphor-icons/react/dist/ssr";
import ProfilePictureUploader from "./ProfilePictureUploader";
import LimitedTextArea from "./components/LimitedTextArea";
import LabeledInput from "./components/LabeledInput";
import { positions } from "@/utils/global_constants";

// Fetch the authenticated user ID
async function getUserId() {
  "use server";
  const supabase = createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();

  if (authError || !userData?.user) {
    return redirect(
      "/login?error=User authentication failed, redirecting to login."
    );
  }

  const userEmail = userData.user.email;

  // Fetch the correct user_id from the users table based on the email
  const { data: userRecord, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("email", userEmail)
    .single();

  if (userError || !userRecord) {
    return redirect("/error?message=user_not_found_in_users_table");
  }

  return userRecord.id; // The correct user ID from the users table
}

// Get detailed user information
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
    .select("id, email, first_name, last_name, title, position, gdc_no, qualification, isVerified")
    .eq("email", userEmail)
    .single();

  if (userError || !userRecord) {
    return redirect("/error?message=user_not_found");
  }

  return userRecord;
}

// Check if Dentistry already exists or create a new one
async function getOrCreateDentistry(userId: string) {
  "use server";
  const supabase = createClient();

  // Check if there's already a dentistry for the user
  const { data: dentistry, error } = await supabase
    .from("dentistries")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (dentistry) {
    return dentistry; // Return existing dentistry data
  }

  // If no dentistry exists, create a new one for the user

  // Fetch user's first_name, last_name, and email from the users table
  const { data: userRecord, error: userError } = await supabase
    .from("users")
    .select("first_name, last_name, email")
    .eq("id", userId)
    .single();

  if (userError || !userRecord) {
    return redirect("/error?message=failed_to_fetch_user_data");
  }

  // Construct full name and ensure it doesn't have extra spaces
  const fullName = `${userRecord.first_name || ""} ${userRecord.last_name || ""
    }`.trim();

  // Prepare the new dentistry data
  const newDentistry = {
    user_id: userId,
    about_title: fullName || "", // Set to first_name + last_name
    about_text: "",
    phone: "",
    booking_link: "",
    contact_email: userRecord.email || "", // Set to user's email
  };

  const { data: insertedDentistry, error: insertError } = await supabase
    .from("dentistries")
    .insert([newDentistry])
    .select("*")
    .single();

  if (insertError) {
    return redirect("/error?message=failed_to_create_dentistry");
  }

  return insertedDentistry; // Return newly created dentistry data
}

// Check if social links exist, create if necessary
async function getOrCreateSocialLinks(dentistryId: string) {
  "use server";
  const supabase = createClient();

  const { data: socialLinks, error } = await supabase
    .from("socials")
    .select("*")
    .eq("dentistry_id", dentistryId);

  if (socialLinks && socialLinks.length > 0) {
    return socialLinks[0];
  }

  // If no social links exist, create new empty records
  const newSocialLinks = {
    dentistry_id: dentistryId,
    twitter_link: "",
    instagram_link: "",
    facebook_link: "",
    tiktok_link: "",
    other_link: "",
  };

  const { data: insertedSocials, error: insertError } = await supabase
    .from("socials")
    .insert([newSocialLinks])
    .select("*")
    .single();

  if (insertError) {
    return redirect("/error?message=failed_to_create_social_links");
  }

  return insertedSocials; // Return newly created social links
}

// Server Action to save or update Dentistry
async function saveDentistryDetails(formData: FormData) {
  "use server";
  const supabase = createClient();
  const userId = await getUserId();
  const dentistry = await getOrCreateDentistry(userId);

  // Update dentistry fields
  const updatedDentistry = {
    about_title: formData.get("about_title") as string,
    about_text: formData.get("about_text") as string,
    phone: formData.get("phone") as string,
    booking_link: formData.get("booking_link") as string,
    contact_email: formData.get("contact_email") as string,
  };

  const { error: dentistryError } = await supabase
    .from("dentistries")
    .update(updatedDentistry)
    .eq("dentistry_id", dentistry.dentistry_id);

  if (dentistryError) {
    return redirect("/profile?error=failed_to_update_dentistry");
  }
}


// Server Action to save or update Dentistry
async function saveUserDetails(formData: FormData) {
  "use server";
  const supabase = createClient();
  const userId = await getUserId();

  // Update dentistry fields
  const updatedUserData = {
    position: formData.get("position") as string,
    gdc_no: formData.get("gdc_no") as string,
    qualification: formData.get("qualification") as string
  };

  const { error: userError } = await supabase
    .from("users")
    .update(updatedUserData)
    .eq("id", userId);

  if (userError) {
    return redirect("/profile?error=failed_to_update_user");
  }
}


// Server Action to save or update Social Links
async function saveSocialLinks(formData: FormData) {
  "use server";
  const supabase = createClient();
  const userId = await getUserId();
  const dentistry = await getOrCreateDentistry(userId);
  const socialLinks = await getOrCreateSocialLinks(dentistry.dentistry_id);

  // Update social links fields
  const updatedSocialLinks = {
    twitter_link: getValidatedSocialInput(formData.get("twitter_link") as string, 'twitter'),
    instagram_link: getValidatedSocialInput(formData.get("instagram_link") as string, 'instagram'),
    facebook_link: getValidatedSocialInput(formData.get("facebook_link") as string, 'facebook'),
    tiktok_link: getValidatedSocialInput(formData.get("tiktok_link") as string, 'tiktok'),
    other_link: formData.get("other_link") as string,
  };

  const { error: socialsError } = await supabase
    .from("socials")
    .update(updatedSocialLinks)
    .eq("dentistry_id", dentistry.dentistry_id);

  if (socialsError) {
    return redirect("/profile?error=failed_to_update_social_links");
  }
}

async function onSaveUserAndDentistryData(formData: FormData) {
  "use server";
  saveDentistryDetails(formData);
  saveUserDetails(formData);
}

// validate social platform link
type Platform = "facebook" | "twitter" | "instagram" | "tiktok";

interface ValidationResult {
  valid: boolean;
  message: string;
  url?: string;
}

const platformBaseUrls: Record<Platform, string> = {
  facebook: "https://www.facebook.com/",
  twitter: "https://twitter.com/",
  instagram: "https://www.instagram.com/",
  tiktok: "https://www.tiktok.com/@"
};

function extractUsername(url: string, platform: Platform): string | null {
  const usernamePattern: Record<Platform, RegExp> = {
    facebook: /(?:https?:\/\/(?:www\.)?facebook\.com\/)([a-zA-Z0-9._]+)/,
    twitter: /(?:https?:\/\/(?:www\.)?twitter\.com\/)([a-zA-Z0-9_]+)/,
    instagram: /(?:https?:\/\/(?:www\.)?instagram\.com\/)([a-zA-Z0-9._]+)\/?/,
    tiktok: /(?:https?:\/\/(?:www\.)?tiktok\.com\/@?)([a-zA-Z0-9._]+)\/?/
  };

  const match = url.match(usernamePattern[platform]);
  return match ? match[1] : null;  // Return the captured username or null if not found
}

function validateSocialMediaInput(input: string, platform: Platform): ValidationResult {
  const usernamePattern: Record<Platform, RegExp> = {
    facebook: /^[a-zA-Z0-9._]{5,50}$/, // Facebook usernames (5–50 characters)
    twitter: /^[a-zA-Z0-9_]{1,15}$/, // Twitter usernames (1–15 characters)
    instagram: /^[a-zA-Z0-9._]{1,30}$/, // Instagram usernames (1–30 characters)
    tiktok: /^[a-zA-Z0-9._]{1,24}$/ // TikTok usernames (1–24 characters)
  };

  const urlPattern: Record<Platform, RegExp> = {
    facebook: /^https:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9._]+$/,
    twitter: /^https:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9_]+$/,
    instagram: /^https:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._]+\/?$/,
    tiktok: /^https:\/\/(www\.)?tiktok\.com\/@?[a-zA-Z0-9._]+\/?$/
  };

  if (!input) {
    return { valid: false, message: "Input cannot be empty." };
  }

  const isUrl = input.startsWith("http");
  if (isUrl) {
    // Validate full URL
    if (urlPattern[platform].test(input)) {
      return { valid: true, message: "Valid URL.", url: input };
    } else {
      return { valid: false, message: `Invalid URL. Please ensure it starts with the correct platform link.` };
    }
  } else {
    // Validate username
    if (usernamePattern[platform].test(input)) {
      return { valid: true, message: "Valid username.", url: platformBaseUrls[platform] + input };
    } else {
      return { valid: false, message: `Invalid username. Please check the format and try again` };
    }
  }
}

function getValidatedSocialInput(input: string, platform: Platform): string {
  const res = validateSocialMediaInput(input, platform);
  return res.url ? res.url : "";
}

export default async function Profile() {
  const userId = await getUserId();
  const dentistry = await getOrCreateDentistry(userId);
  const socialLinks = await getOrCreateSocialLinks(dentistry.dentistry_id);
  const user = await getUserDetails();

  return (
    <div className="memberpanel-details-wrapper">
      <div id="columns">
        {/* <h2 className="text-lg font-semibold text-[#808F99]">Profile Title</h2>
        <h2 className="text-lg font-semibold mb-3">{dentistry?.about_title || ""}</h2> */}
        {/* Dentistry Form */}

        <ProfilePictureUploader dentistryId={dentistry.dentistry_id} />
        {/* <CustomizedImageUploader dentistryId={dentistry.dentistry_id} /> */}

        <form
          action={onSaveUserAndDentistryData}
          className="mb-6 mt-10"
        >
          <h2 className="text-lg font-semibold mb-3">Name</h2>
          <LabeledInput
            // id="about_title"
            label="Profile Title"
            defaultValue={dentistry?.about_title || ""}
            name="about_title"
            // placeholder="Profile Title"
            className="w-full text-base"
          />

          <h2 className="text-lg font-semibold mb-3">Bio</h2>
          <LimitedTextArea
            name="about_text"
            defaultText={dentistry?.about_text || ""}
            placeholder="About text"
          />

          {/* Position Dropdown */}
          <div className="mb-3 relative">
            <h2 className="text-base text-dark">Position</h2>
            <div className="relative">
              <select
                name="position"
                className="w-full appearance-none p-2 rounded-[26px] h-[50px] py-2 text-base px-3 text-neutral-800 pr-10 outline-none cursor-pointer"
                defaultValue={user?.position || ""}
              >
                {positions.map((position) => (
                  <option key={position} value={position}>
                    {position}
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

          <LabeledInput
            label="GDC / Professional Body Reg No. (optional)"
            defaultValue={user?.gdc_no || ""}
            name="gdc_no"
            className="w-full text-base pl-5">
            <Subtitles
              size={24}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
            />
          </LabeledInput>

          <LabeledInput
            label="Qualification (optional)"
            defaultValue={user?.qualification || ""}
            name="qualification"
            className="w-full text-base pl-5">
            <Certificate
              size={24}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
            />
          </LabeledInput>

          <LabeledInput
            // id="phone"
            label="Contact Phone (optional)"
            defaultValue={dentistry?.phone || ""}
            name="phone"
            // placeholder="Contact Phone (optional)"
            className="w-full text-base pl-5">
            <Phone
              size={24}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
            />
          </LabeledInput>

          <LabeledInput
            // id="email"
            label="Contact Email (optional)"
            defaultValue={dentistry?.contact_email || ""}
            name="contact_email"
            type="email"
            // placeholder="Contact Email (optional)"
            className="w-full text-base pl-5">
            <At
              size={24}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
            />
          </LabeledInput>

          <LabeledInput
            label="Booking Link (optional)"
            className="w-full text-base pl-5"
            name="booking_link"
            defaultValue={dentistry?.booking_link || ""}
          // placeholder="Booking Link (optional)"
          >
            <CalendarPlus
              size={24}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
            />
          </LabeledInput>

          {/* Save Button for Dentistry */}
          <div className="w-full flex items-end justify-end">
            <SaveButton />
          </div>
        </form>

        {/* Social Links Form */}
        <form action={saveSocialLinks} className="mb-6 mt-10">
          <h2 className="text-lg font-semibold mb-3">Social Links</h2>


          <LabeledInput
            label="Twitter Name"
            className="w-full text-base pl-5"
            name="twitter_link"
            defaultValue={extractUsername(socialLinks?.twitter_link, 'twitter') || ""}
          // placeholder="/username"
          >
            <TwitterLogo
              size={24}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
            />
          </LabeledInput>

          <LabeledInput
            label="Instagram Name"
            className="w-full text-base pl-5"
            name="instagram_link"
            defaultValue={extractUsername(socialLinks?.instagram_link, 'instagram') || ""}
          // placeholder="/username"
          >
            <InstagramLogo
              size={24}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
            />
          </LabeledInput>

          <LabeledInput
            label="Facebook Name"
            className="w-full text-base pl-5"
            name="facebook_link"
            defaultValue={extractUsername(socialLinks?.facebook_link, 'facebook') || ""}
          // placeholder="/username"
          >
            <FacebookLogo
              size={24}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
            />
          </LabeledInput>

          <LabeledInput
            label="Tiktok Name"
            className="w-full text-base pl-5"
            name="tiktok_link"
            defaultValue={extractUsername(socialLinks?.tiktok_link, 'tiktok') || ""}
          // placeholder="/username"
          >
            <TiktokLogo
              size={24}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
            />
          </LabeledInput>


          <LabeledInput
            label="Other Name"
            className="w-full text-base pl-5"
            name="other_link"
            defaultValue={socialLinks?.other_link || ""}
          // placeholder="Other Name"
          >
            <LinkSimple
              size={24}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
            />
          </LabeledInput>

          {/* Save Button for Social Links */}
          <div className="w-full flex items-end justify-end">
            <SaveButton />
          </div>
        </form>
      </div>
    </div>
  );
}
