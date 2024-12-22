// import React from "react";
// import { createClient } from "@/utils/supabase/server";
// import { redirect } from "next/navigation";

// import SaveButton from "./components/SaveButton";
// import {
//   FacebookLogo,
//   InstagramLogo,
//   LinkSimple,
//   TiktokLogo,
//   TwitterLogo,
//   Phone,
//   At,
//   CalendarPlus
// } from "@phosphor-icons/react/dist/ssr";
// import ProfilePictureUploader from "./ProfilePictureUploader";


// // Fetch the authenticated user ID
// async function getUserId() {
//   "use server";
//   const supabase = createClient();
//   const { data: userData, error: authError } = await supabase.auth.getUser();

//   if (authError || !userData?.user) {
//     return redirect(
//       "/login?error=User authentication failed, redirecting to login."
//     );
//   }

//   const userEmail = userData.user.email;

//   // Fetch the correct user_id from the users table based on the email
//   const { data: userRecord, error: userError } = await supabase
//     .from("users")
//     .select("id")
//     .eq("email", userEmail)
//     .single();

//   if (userError || !userRecord) {
//     return redirect("/error?message=user_not_found_in_users_table");
//   }

//   return userRecord.id; // The correct user ID from the users table
// }

// // Check if Dentistry already exists or create a new one
// async function getOrCreateDentistry(userId: string) {
//   "use server";
//   const supabase = createClient();

//   // Check if there's already a dentistry for the user
//   const { data: dentistry, error } = await supabase
//     .from("dentistries")
//     .select("*")
//     .eq("user_id", userId)
//     .single();

//   if (dentistry) {
//     return dentistry; // Return existing dentistry data
//   }

//   // If no dentistry exists, create a new one for the user
//   const newDentistry = {
//     user_id: userId,
//     about_title: "",
//     about_text: "",
//     phone: "",
//     booking_link: "",
//     contact_email: "",
//   };

//   const { data: insertedDentistry, error: insertError } = await supabase
//     .from("dentistries")
//     .insert([newDentistry])
//     .select("*")
//     .single();

//   if (insertError) {
//     return redirect("/error?message=failed_to_create_dentistry");
//   }

//   return insertedDentistry; // Return newly created dentistry data
// }

// // Check if social links exist, create if necessary
// async function getOrCreateSocialLinks(dentistryId: string) {
//   "use server";
//   const supabase = createClient();

//   const { data: socialLinks, error } = await supabase
//     .from("socials")
//     .select("*")
//     .eq("dentistry_id", dentistryId);
//   // @ts-ignore
//   if (socialLinks.length > 0) {
//     // @ts-ignore
//     return socialLinks[0];
//   }

//   // If no social links exist, create new empty records
//   const newSocialLinks = {
//     dentistry_id: dentistryId,
//     twitter_link: "",
//     instagram_link: "",
//     facebook_link: "",
//     tiktok_link: "",
//     other_link: "",
//   };

//   const { data: insertedSocials, error: insertError } = await supabase
//     .from("socials")
//     .insert([newSocialLinks])
//     .select("*")
//     .single();

//   if (insertError) {
//     return redirect("/error?message=failed_to_create_social_links");
//   }

//   return insertedSocials; // Return newly created social links
// }

// // Server Action to save or update Dentistry
// async function saveDentistryDetails(formData: FormData) {
//   "use server";
//   const supabase = createClient();
//   const userId = await getUserId();
//   const dentistry = await getOrCreateDentistry(userId);

//   // Update dentistry fields
//   const updatedDentistry = {
//     about_title: formData.get("about_title") as string,
//     about_text: formData.get("about_text") as string,
//     phone: formData.get("phone") as string,
//     booking_link: formData.get("booking_link") as string,
//     contact_email: formData.get("contact_email") as string,
//   };

//   const { error: dentistryError } = await supabase
//     .from("dentistries")
//     .update(updatedDentistry)
//     .eq("dentistry_id", dentistry.dentistry_id);

//   if (dentistryError) {
//     return redirect("/profile?error=failed_to_update_dentistry");
//   }
// }

// // Server Action to save or update Social Links
// async function saveSocialLinks(formData: FormData) {
//   "use server";
//   const supabase = createClient();
//   const userId = await getUserId();
//   const dentistry = await getOrCreateDentistry(userId);
//   const socialLinks = await getOrCreateSocialLinks(dentistry.dentistry_id);

//   // Update social links fields
//   const updatedSocialLinks = {
//     twitter_link: formData.get("twitter_link") as string,
//     instagram_link: formData.get("instagram_link") as string,
//     facebook_link: formData.get("facebook_link") as string,
//     tiktok_link: formData.get("tiktok_link") as string,
//     other_link: formData.get("other_link") as string,
//   };

//   const { error: socialsError } = await supabase
//     .from("socials")
//     .update(updatedSocialLinks)
//     .eq("dentistry_id", dentistry.dentistry_id);

//   if (socialsError) {
//     return redirect("/profile?error=failed_to_update_social_links");
//   }
// }

// export default async function Profile() {
//   const userId = await getUserId();
//   const dentistry = await getOrCreateDentistry(userId);
//   const socialLinks = await getOrCreateSocialLinks(dentistry.dentistry_id);

//   return (
//     <div className="memberpanel-details-wrapper">
//       <div id="columns">
//         {/* Dentistry Form */}
//         <ProfilePictureUploader dentistryId={dentistry.dentistry_id} />

//         <form
//           action={saveDentistryDetails}
//           method="post"
//           className="mb-6 mt-10"
//         >
//           <h2 className="text-lg font-semibold mb-3">Dentistry Details</h2>

//           <div className="mb-6">
//             <input
//               name="about_title"
//               className="w-full p-2 rounded-[26px] py-2 text-base px-3 placeholder:text-neutral-500 text-neutral-800 placeholder:font-normal"
//               defaultValue={dentistry?.about_title || ""}
//               placeholder="Profile title"
//             />
//           </div>
//           <div className="mb-3">
//             <textarea
//               name="about_text"
//               className="w-full p-2 focus:outline-none rounded-[26px] py-2 text-base px-3 placeholder:text-neutral-500 text-neutral-800 placeholder:font-normal min-h-40"
//               placeholder="About text"
//               defaultValue={dentistry?.about_text || ""}
//             />
//           </div>

//           {/* <div className="mb-3">
//             <input
//               name="phone"
//               className="w-full p-2 rounded-[26px] py-2 text-base px-3 placeholder:text-neutral-500 text-neutral-800 placeholder:font-normal"
//               defaultValue={dentistry?.phone || ""}
//               placeholder="Contact Phone"
//             />
//           </div> */}

//           <div className="mb-3 relative">
//             <Phone
//               size={24}
//               className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
//             />
//             <input
//               name="phone"
//               className="w-full pl-11 rounded-[26px] py-2 text-base pr-3 placeholder:text-neutral-500 text-neutral-800 placeholder:font-normal"
//               defaultValue={dentistry?.phone || ""}
//               placeholder="Contact Phone"
//             />
//           </div>




//           <div className="mb-3 relative">
//             <At
//               size={24}
//               className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
//             />
//             <input
//                name="contact_email"
//               type="email"
//               className="w-full pl-11 rounded-[26px] py-2 text-base pr-3 placeholder:text-neutral-500 text-neutral-800 placeholder:font-normal"
//               defaultValue={dentistry?.contact_email || ""}
//               placeholder="Contact Email"
//             />
//           </div>

//           <div className="mb-3 relative">
//             <CalendarPlus
//               size={24}
//               className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
//             />
//             <input
//                className="w-full pl-11 rounded-[26px] py-2 text-base pr-3 placeholder:text-neutral-500 text-neutral-800 placeholder:font-normal"
//                name="booking_link"
//               defaultValue={dentistry?.booking_link || ""}
//               placeholder="Booking Link"
//             />
//           </div>

//           {/* <div className="mb-3">
//             <input
//               className="w-full p-2 rounded-[26px] py-2 text-base px-3 placeholder:text-neutral-500 text-neutral-800 placeholder:font-normal"
//               name="booking_link"
//               defaultValue={dentistry?.booking_link || ""}
//               placeholder="Booking Link"
//             />
//           </div> */}

//           {/* Save Button for Dentistry */}
//           <div className="w-full flex items-end justify-end">
//             <SaveButton />
//           </div>
//         </form>

//         {/* Social Links Form */}
//         <form action={saveSocialLinks} method="post" className="mb-6 mt-10">
//           <h2 className="text-lg font-semibold mb-3">Social Links</h2>

//           <div className="mb-3 relative">
//             <TwitterLogo
//               size={24}
//               className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
//             />
//             <input
//               name="twitter_link"
//               className="w-full pl-11 rounded-[26px] py-2 text-base pr-3 placeholder:text-neutral-500 text-neutral-800 placeholder:font-normal"
//               defaultValue={socialLinks?.twitter_link || ""}
//               placeholder="Twitter Link"
//             />
//           </div>
//           <div className="mb-3 relative">
//             <InstagramLogo
//               size={24}
//               className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
//             />
//             <input
//               name="instagram_link"
//               className="w-full pl-11 rounded-[26px] py-2 text-base pr-3 placeholder:text-neutral-500 text-neutral-800 placeholder:font-normal"
//               defaultValue={socialLinks?.instagram_link || ""}
//               placeholder="Instagram Link"
//             />
//           </div>
//           <div className="mb-3 relative">
//             <FacebookLogo
//               size={24}
//               className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
//             />
//             <input
//               name="facebook_link"
//               className="w-full pl-11 rounded-[26px] py-2 text-base pr-3 placeholder:text-neutral-500 text-neutral-800 placeholder:font-normal"
//               defaultValue={socialLinks?.facebook_link || ""}
//               placeholder="Facebook Link"
//             />
//           </div>
//           <div className="mb-3 relative">
//             <TiktokLogo
//               size={24}
//               className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
//             />
//             <input
//               name="tiktok_link"
//               className="w-full pl-11 rounded-[26px] py-2 text-base pr-3 placeholder:text-neutral-500 text-neutral-800 placeholder:font-normal"
//               defaultValue={socialLinks?.tiktok_link || ""}
//               placeholder="TikTok Link"
//             />
//           </div>
//           <div className="mb-3 relative">
//             <LinkSimple
//               size={24}
//               className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
//             />
//             <input
//               name="other_link"
//               className="w-full pl-11 rounded-[26px] py-2 text-base pr-3 placeholder:text-neutral-500 text-neutral-800 placeholder:font-normal"
//               defaultValue={socialLinks?.other_link || ""}
//               placeholder="Other Link"
//             />
//           </div>

//           {/* Save Button for Social Links */}
//           <div className="w-full flex items-end justify-end">
//             <SaveButton />
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

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
} from "@phosphor-icons/react/dist/ssr";
import ProfilePictureUploader from "./ProfilePictureUploader";
import ProfileNameInput from "./components/ProfileNameInput";
import LimitedTextArea from "./components/LimitedTextArea";
import LabeledInput from "./components/LabeledInput";
import CustomizedImageUploader from "./components/CustomizedImageUploader";

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

  return (
    <div className="memberpanel-details-wrapper">
      <div id="columns">
        {/* <h2 className="text-lg font-semibold text-[#808F99]">Profile Title</h2>
        <h2 className="text-lg font-semibold mb-3">{dentistry?.about_title || ""}</h2> */}
        {/* Dentistry Form */}

        <ProfilePictureUploader dentistryId={dentistry.dentistry_id} />
        {/* <CustomizedImageUploader dentistryId={dentistry.dentistry_id} /> */}

        <form
          action={saveDentistryDetails}
          method="post"
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
            defaultValue={dentistry?.about_text || ""}
            placeholder="About text"
          />



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
        <form action={saveSocialLinks} method="post" className="mb-6 mt-10">
          <h2 className="text-lg font-semibold mb-3">Social Links</h2>


          <LabeledInput
            label="Twitter Link"
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
            label="Instagram Link"
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
            label="Facebook Link"
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
            label="Tiktok Link"
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
            label="Other Link"
            className="w-full text-base pl-5"
            name="other_link"
            defaultValue={socialLinks?.other_link || ""}
            // placeholder="Other Link"
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
