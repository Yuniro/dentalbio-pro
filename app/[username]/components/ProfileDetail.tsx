"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "./Navbar";
import { createClient } from "@/utils/supabase/client";
import { FacebookLogo, InstagramLogo, TiktokLogo, TwitterLogo } from "@phosphor-icons/react/dist/ssr";

export default function ProfileDetail({
  username,
  position,
  title,
  description,
  dentistry_id,
}: {
  username: string;
  position: string;
  title: string;
  description: string;
  dentistry_id: string;
}) {
  const [location, setLocation] = useState<any>(null);
  const [socialLinks, setSocialLinks] = useState<any>(null); // State for social links
  const [loading, setLoading] = useState(true);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);

  // Fetch the location based on the dentistry_id
  useEffect(() => {
    async function fetchLocation() {
      const supabase = createClient();

      const { data: dentistryLocation, error: dentistryLocationError } =
        await supabase
          .from("dentistry_locations")
          .select(
            `
          location_id,
          locations (country, city, area, full_address)
        `
          )
          .eq("dentistry_id", dentistry_id)
          .single(); // Assuming one location per dentistry

      if (dentistryLocationError) {
        console.error("Error fetching location:", dentistryLocationError);
        setLoading(false);
        return;
      }

      setLocation(dentistryLocation.locations); // Store the location data
      fetchProfilePicture(dentistry_id);
      setLoading(false);
    }

    async function fetchSocialLinks() {
      const supabase = createClient();

      const { data: socials, error: socialsError } = await supabase
        .from("socials")
        .select(
          "twitter_link, instagram_link, facebook_link, tiktok_link, other_link"
        )
        .eq("dentistry_id", dentistry_id)
        .single();

      if (socialsError) {
        console.error("Error fetching social links:", socialsError);
        return;
      }

      setSocialLinks(socials);
    }

    fetchLocation();
    fetchSocialLinks();
  }, [dentistry_id]);

  const fetchProfilePicture = async (dentistryId: string) => {
    try {
      const supabase = createClient();

      // Check if the profile picture exists in the storage
      const { data, error } = await supabase.storage
        .from("profile-pics")
        .list(dentistryId);

      if (error) throw error;

      if (data.length > 0) {
        const fileName = data[0].name;
        const { data: urlData } = await supabase.storage
          .from("profile-pics")
          .getPublicUrl(`${dentistryId}/${fileName}`);

        setProfilePicUrl(urlData?.publicUrl || "/placeholder.png"); // Set the image URL or placeholder
      } else {
        setProfilePicUrl("/placeholder.png"); // Use placeholder if no profile pic
      }
    } catch (error) {
      console.error("Error fetching profile picture:", error);
      setProfilePicUrl("/placeholder.png"); // Set placeholder on error
    }
  };

  return (
    <>
      <div className="profile-detail-wrapper">
        <div className="user-profile text-center">
          <img
            src={profilePicUrl || "/placeholder.png"}
            alt="user"
            className="img-fluid mx-auto w-full h-full object-cover"
          />
        </div>
        <div className="text-center">
          <h2 className="fw-medium user-name">{title}</h2>
          <div className="user-profile-header-detail -mt-2">
            <div className="d-flex align-items-center gap-2 justify-content-center">
              <h5>@{username}</h5>
            </div>
          </div>

          {/* Social Links */}
          {socialLinks && (
            <div className="d-flex align-items-center justify-content-center gap-2">
              {socialLinks.instagram_link && (
                <a
                  href={socialLinks.instagram_link}
                  className="no-underline"
                  target="_blank"
                >
                  <InstagramLogo
                    size={26}
                    className="text-neutral-800"
                  />
                </a>
              )}
              {socialLinks.tiktok_link && (
                <a
                  href={socialLinks.tiktok_link}
                  className="no-underline"
                  target="_blank"
                >
                  <TiktokLogo
                    size={26}
                    className="text-neutral-800"
                  />
                </a>
              )}
              {socialLinks.twitter_link && (
                <a
                  href={socialLinks.twitter_link}
                  className="no-underline"
                  target="_blank"
                >
                  <TwitterLogo
                    size={26}
                    className="text-neutral-800"
                  />
                </a>
              )}
              {socialLinks.facebook_link && (
                <a
                  href={socialLinks.facebook_link}
                  className="no-underline"
                  target="_blank"
                >
                  <FacebookLogo
                    size={26}
                    className="text-neutral-800"
                  />
                </a>
              )}
              {socialLinks.other_link && (
                <a
                  href={socialLinks.other_link}
                  className="no-underline"
                  target="_blank"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="#ffff"
                    viewBox="0 0 256 256"
                  >
                    <path d="M128,24h0A104,104,0,1,0,232,128,104.12,104.12,0,0,0,128,24Zm88,104a87.61,87.61,0,0,1-3.33,24H174.16a157.44,157.44,0,0,0,0-48h38.51A87.61,87.61,0,0,1,216,128ZM102,168H154a115.11,115.11,0,0,1-26,45A115.27,115.27,0,0,1,102,168Zm-3.9-16a140.84,140.84,0,0,1,0-48h59.88a140.84,140.84,0,0,1,0,48ZM40,128a87.61,87.61,0,0,1,3.33-24H81.84a157.44,157.44,0,0,0,0,48H43.33A87.61,87.61,0,0,1,40,128ZM154,88H102a115.11,115.11,0,0,1,26-45A115.27,115.27,0,0,1,154,88Zm52.33,0H170.71a135.28,135.28,0,0,0-22.3-45.6A88.29,88.29,0,0,1,206.37,88ZM107.59,42.4A135.28,135.28,0,0,0,85.29,88H49.63A88.29,88.29,0,0,1,107.59,42.4ZM49.63,168H85.29a135.28,135.28,0,0,0,22.3,45.6A88.29,88.29,0,0,1,49.63,168Zm98.78,45.6a135.28,135.28,0,0,0,22.3-45.6h35.66A88.29,88.29,0,0,1,148.41,213.6Z"></path>
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <Navbar />

      {/* "Based in" Section */}
      {location && (
        <div className="basedin-tabination-wrapper">
          <ul
            className="nav nav-tabs border-0 justify-content-center align-items-center"
            role="tablist"
          >
            <li className="based-in-text">Based in</li>
            {location.city && (
              <li className="nav-item">
                <button className="nav-link border-0 profile-tab active">
                  {location.city}
                </button>
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Description */}
      <div className="profile-contents text-center">
        <h5>{description}</h5>
        <p className="profile-address">
          {position} <br />
          {location && location.full_address && location?.full_address}
        </p>
      </div>
    </>
  );
}
