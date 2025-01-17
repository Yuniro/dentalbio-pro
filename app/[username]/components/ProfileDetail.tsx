"use client";
import React, { useEffect, useState, useReducer } from "react";
import Link from "next/link";
import Navbar from "./Navbar";
import { createClient } from "@/utils/supabase/client";
import { FacebookLogo, InstagramLogo, SealCheck, TiktokLogo, TwitterLogo } from "@phosphor-icons/react/dist/ssr";
import SocialLinks from "./SocialLinks";
import VerificationBadge from "@/app/components/VerificationBadge";
import IndividualProductList from "./IndividualProductList";

export default function ProfileDetail({
  userId,
  username,
  position,
  gdc_no,
  qualification,
  title,
  description,
  dentistry_id,
  isVerified,
}: {
  userId: string;
  username: string;
  position: string;
  gdc_no: string;
  qualification: string;
  title: string;
  description: string;
  dentistry_id: string;
  isVerified: boolean;
}) {
  const [productGroups, setProductGroups] = useState<GroupType[]>([]);
  const [products, setProducts] = useState<IndividualProductType[]>([]);
  const [locations, setLocations] = useState<any[] | null>(null);
  const [socialLinks, setSocialLinks] = useState<any>(null); // State for social links
  const [loading, setLoading] = useState(true);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const [isShopOpen, toggleShopOpen] = useReducer((state: boolean) => !state, false);

  // Fetch the location based on the dentistry_id
  useEffect(() => {
    async function fetchLocation() {
      const supabase = createClient();

      const { data: dentistryLocations, error: dentistryLocationError } =
        await supabase
          .from("dentistry_locations")
          .select(`
            location_id,
            locations (country, city, area, full_address)`
          )
          .eq("dentistry_id", dentistry_id)

      if (dentistryLocationError) {
        console.error("Error fetching location:", dentistryLocationError);
        setLoading(false);
        return;
      }

      setLocations(dentistryLocations);

      // setLocations(dentistryLocation.locations); // Store the location data
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
        .eq("dentistry_id", dentistry_id);

      if (socialsError) {
        console.error("Error fetching social links:", socialsError);
        return;
      }

      // Handle multiple rows (if needed)
      if (socials && socials.length > 0) {
        socials.forEach((social) => {
          setSocialLinks(social);
          return;
        });
      } else {
        console.log("No socials found for the given dentistry_id.");
      }

      if (socialsError) {
        console.error("Error fetching social links:", socialsError);
        return;
      }
    }

    fetchLocation();
    fetchSocialLinks();
  }, [dentistry_id]);

  useEffect(() => {
    async function fetchGroupList() {
      const query = [
        userId ? `userId=${userId}` : '', // Add userId if it exists
        'type=products'
      ]
        .filter(Boolean)                  // Remove empty strings
        .join('&');                       // Join with '&' to form a valid query string

      const response = await fetch(`/api/groups?${query}`, {
        method: 'GET'
      });
      const data = await response.json();

      setProductGroups(data);
    }

    fetchGroupList();
  }, [dentistry_id]);

  useEffect(() => {
    async function fetchProductList() {
      const query = userId ? `userId=${userId}` : '';

      const response = await fetch(`/api/individual-products?${query}`, {
        method: 'GET'
      });
      const data = await response.json();

      // setProductGroups(data);
      setProducts(data);
    }

    fetchProductList();
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
          <div className="flex justify-center items-center gap-2 pb-1">
            <h2 className="fw-medium user-name text-[23px] pb-0">{title}</h2>
            <div className="desktopview-header flex items-center">
              {isVerified && <VerificationBadge size={22} />}
            </div>
          </div>
          <div className="user-profile-header-detail">
            <div className="flex items-center gap-[6px] justify-center">
              <h5>@{username}</h5>
              {isVerified && <VerificationBadge />}
            </div>
          </div>
          <SocialLinks {...socialLinks} />
        </div>
      </div>

      <Navbar toggleShopOpen={toggleShopOpen} />

      {/* {productGroups.length > 0 && <div className={`flex flex-wrap pb-4 ${isShopOpen ? 'animate-fade-in' : 'animate-fade-out'}`}>
        {productGroups.map((group) => <ProductList key={group.id} products={group.datas!} />)}
      </div>} */}

      <div className={`flex flex-wrap ${products.length > 0 ? 'pb-4' : ''} ${isShopOpen ? 'animate-fade-in' : 'animate-fade-out'}`}>
        <IndividualProductList products={products} />
      </div>

      {/* "Based in" Section */}
      {locations && (
        <div className="basedin-tabination-wrapper">
          <ul
            className="nav nav-tabs border-0 justify-content-center align-items-center"
            role="tablist"
          >
            <li className="based-in-text">Based in</li>
            {locations.map((location) => (
              <li className="nav-item" key={location.location_id}>
                <button className="nav-link border-0 profile-tab active">
                  {location.locations.city}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Description */}
      <div className="profile-contents text-center p-0">
        <h5 className="pb-[27px]">{description}</h5>
        {(position !== "Other" || gdc_no || qualification) &&
          <div className="profile-address pb-6">
            {position !== "Other" && <div>{position}</div>}
            {gdc_no && <div>GDC No. {gdc_no}</div>}
            {qualification && <div>{qualification}</div>}
            {/* {location && location.full_address && location?.full_address} */}
          </div>}
      </div>
    </>
  );
}
