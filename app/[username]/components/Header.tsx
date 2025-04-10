"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import ShareModal from "./ShareModal";
import Link from "next/link";
import VerificationBadge from "@/app/components/VerificationBadge";
import { useNavbar } from "../../contexts/NavbarContext";
import FullRoundedButton from "@/app/components/Button/FullRoundedButton";

export default function Header({
  username,
  dentistry_id,
  contact_email,
  isOtherPage,
  isVerified,
  useDentalBrand = true,
}: {
  username: string;
  dentistry_id: string;
  contact_email: string;
  isOtherPage?: boolean;
  isVerified: boolean;
  useDentalBrand: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const { navState } = useNavbar();

  // Handle the scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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

  useEffect(() => {
    fetchProfilePicture(dentistry_id);
  }, []);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, target: string) => {
    e.preventDefault(); // Prevent default anchor behavior

    const targetElement = document.querySelector(target);
    const offset = 120; // Adjust this value for your navbar height or desired gap
    const elementPosition = targetElement!.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth', // Enables smooth scrolling
    });
  }

  return (
    <div>
      {/* Desktop View */}
      <div className="desktopview-header">
        <div
          className={`flex items-center justify-between ${scrolled ? "scrolled-header bg-neutral-200" : ""
            } transition-all`}
          id="onscroll-header"
        >
          {/* Profile image shown on scroll */}
          <div
            className={`onscroll-profile ${scrolled ? "block" : "hidden"}`}
          >
            <Image
              src={profilePicUrl || "/placeholder.png"}
              alt="profile"
              width={40}
              height={40}
              className="img-fluid"
            />
          </div>

          <div className="flex items-center gap-[5px] justify-center">
            <h6 className="fw-medium">@{username}</h6>
            {isVerified && <VerificationBadge direction="right" />}
          </div>


          {/* Dots icon for modal trigger */}
          <div className="flex items-center gap-2">
            {isOtherPage &&
              <Link
                href={`/${username}`}
                className="contact-me-btn whitespace-nowrap no-underline"
              >
                <span>Back</span>
              </Link>}
            {navState.Location ?
              <a href="#location" className="no-underline" onClick={e => handleScroll(e, "#location")}>
                <FullRoundedButton className="!py-[7px]">
                  Contact me
                </FullRoundedButton>
              </a> :
              (contact_email &&
                <a href={`mailto:${contact_email}`} className="no-underline" target="_blank">
                  <FullRoundedButton className="!py-[7px]" >
                    Contact me
                  </FullRoundedButton>
                </a>)}
            <ShareModal username={username} />
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="mobileview-header">
        <div
          className={`flex items-center justify-between ${scrolled ? "scrolled-header bg-neutral-200 py-1 top-6" : "px-0"
            } transition-all`}
          id="onscroll-header-mobile"
        >
          {/* Logo disappears on scroll */}
          {(!scrolled && useDentalBrand) && (
            <a href="/" id="header_logo">
              <Image
                src="/logo.svg"
                alt="logo"
                width={100}
                height={40}
                className="img-fluid mobile-logo"
              />
            </a>
          )}

          {/* Username visible on scroll */}
          <div className={`${(scrolled || !useDentalBrand) ? "d-block" : "d-none"}`}>
            <div className="flex items-center gap-[5px] justify-center">
              <h6 className="fw-medium max-w-32 truncate">@{username}</h6>
              {isVerified && <VerificationBadge direction="right" />}
            </div>
          </div>

          {/* Contact and modal button */}
          <div className="flex items-center gap-2">
            <a href="#location" className="no-underline" onClick={e => handleScroll(e, "#location")} id="onscroll-hide-contact-btn">
              <FullRoundedButton className={`py-2 ${navState.Location ? "" : "bg-[#BFBFBF]"}`} buttonType={navState.Location ? "primary" : "ghost"}>
                Contact me
              </FullRoundedButton>
            </a>
            {/* )} */}
            <ShareModal username={username} />
          </div>
        </div>
      </div>
    </div>
  );
}
