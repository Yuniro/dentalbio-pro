"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Cookies from "js-cookie";
import { User, Gear, MapPin, Heart, LinkSimple, House } from "phosphor-react";

// Constants for storing keys in cookies
const COOKIE_USERNAME_KEY = "username";
const COOKIE_DENTISTRY_ID_KEY = "dentistry_id";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const [dentistryId, setDentistryId] = useState<string | null>(null);
  const pathname = usePathname();

  // Fetch user info on component mount
  useEffect(() => {
    fetchUserInfo();
  }, []);

  // Function to toggle the sidebar visibility
  const handleToggle = () => setIsOpen(!isOpen);
  const handleClose = () => setIsOpen(false);

  // Fetch logged-in user's email and username, and set it in cookies
  const fetchUserInfo = async () => {
    const supabase = createClient();
    const storedUsername = Cookies.get(COOKIE_USERNAME_KEY);
    const storedDentistryId = Cookies.get(COOKIE_DENTISTRY_ID_KEY);

    // Check if username and dentistry_id are already in cookies
    if (storedUsername && storedDentistryId) {
      setUsername(storedUsername);
      setDentistryId(storedDentistryId);
      fetchProfilePicture(storedDentistryId);
      return;
    }

    // Fetch the logged-in user's email
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData?.user) {
      console.error("Error fetching user:", authError);
      return;
    }

    const userEmail = authData.user.email;

    // Fetch the username from the `users` table using the email
    const { data: userRecord, error: userError } = await supabase
      .from("users")
      .select("username, id")
      .eq("email", userEmail)
      .single();

    if (userError || !userRecord) {
      console.error("Error fetching user info from users table:", userError);
      return;
    }

    const fetchedUsername = userRecord.username;
    const userId = userRecord.id;

    // Store the username in cookies for future usage
    Cookies.set(COOKIE_USERNAME_KEY, fetchedUsername, { expires: 7 });
    setUsername(fetchedUsername);

    // Fetch the `dentistry_id` using the user ID
    const { data: dentistryRecord, error: dentistryError } = await supabase
      .from("dentistries")
      .select("dentistry_id")
      .eq("user_id", userId)
      .single();

    if (dentistryError || !dentistryRecord) {
      console.error("Error fetching dentistry info:", dentistryError);
      return;
    }

    const fetchedDentistryId = dentistryRecord.dentistry_id;

    // Store the `dentistry_id` in cookies for future usage
    Cookies.set(COOKIE_DENTISTRY_ID_KEY, fetchedDentistryId, { expires: 7 });
    setDentistryId(fetchedDentistryId);

    // Fetch the profile picture using the `dentistry_id`
    fetchProfilePicture(fetchedDentistryId);
  };

  // Function to fetch profile picture from Supabase storage using dentistryId
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

        setProfilePicUrl(urlData?.publicUrl || "/placeholder.png");
      } else {
        setProfilePicUrl("/placeholder.png");
      }
    } catch (error) {
      console.error("Error fetching profile picture:", error);
      setProfilePicUrl("/placeholder.png");
    }
  };

  return (
    <div className="memberpanel-sidebar-wrapper">
      <div className="sidebar-nav-wrapper">
        <nav className="navbar navbar-expand-xl">
          <div className="container-fluid p-0">
            <button
              className="navbar-toggler w-100 text-end border-0"
              type="button"
              onClick={handleToggle}
              aria-controls="offcanvasExample"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            {/* Offcanvas Sidebar */}
            <div
              className={`offcanvas offcanvas-start navbar-collapse custom-memberpanel-navbar ${
                isOpen ? "show" : ""
              }`}
              tabIndex={-1}
              id="offcanvasExample"
              aria-labelledby="offcanvasExampleLabel"
              aria-modal={isOpen ? "true" : "false"}
              role="dialog"
            >
              <div className="d-xl-none d-block w-100 text-end pt-3 pe-3">
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleClose}
                  aria-label="Close"
                ></button>
              </div>
              <div className="navbar-nav w-100 flex-column overflow-y-auto">
                <SidebarItem
                  label="Bio"
                  link="/dashboard/"
                  isActive={pathname === "/dashboard"}
                  Icon={House}
                  onClick={handleClose}
                />
                {/* <SidebarItem
                  label="Profile"
                  link="/dashboard/profile"
                  isActive={pathname === "/dashboard/profile"}
                  Icon={User}
                  onClick={handleClose}
                /> */}
                <SidebarItem
                  label="Location"
                  link="/dashboard/location"
                  isActive={pathname === "/dashboard/location"}
                  Icon={MapPin}
                  onClick={handleClose}
                />
                <SidebarItem
                  label="Treatments"
                  link="/dashboard/treatments"
                  isActive={pathname === "/dashboard/treatments"}
                  Icon={Heart}
                  onClick={handleClose}
                />
                <SidebarItem
                  label="Links"
                  link="/dashboard/links"
                  isActive={pathname === "/dashboard/links"}
                  Icon={LinkSimple}
                  onClick={handleClose}
                />
                <SidebarItem
                  label="Settings"
                  link="/dashboard/settings"
                  isActive={pathname === "/dashboard/settings"}
                  Icon={Gear}
                  onClick={handleClose}
                />
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={handleClose}
        ></div>
      )}

      <div className="memberpanel-sidebar-detail">
        <p className="fw-bold memberpanel-detail-title">
          New Features Soon! ⏳
        </p>
        <p className="mb-0">Upgrade now and be the first to enjoy our upcoming features!</p>
      </div>
      <Link
        href={"/success"}
        target="_blank"
        className="no-underline add-btn upgrade-now-btn"
      >
        <button>Upgrade now</button>
      </Link>
      <div className="memberpanel-profile flex items-center justify-start">
        <img
          src={profilePicUrl || "/placeholder.png"}
          alt="Profile"
          className="img-fluid rounded-full w-16 h-16 object-cover"
        />
        <p className="fw-bold mb-0">@{username ? username : "loading..."}</p>
      </div>
    </div>
  );
}

interface SidebarItemProps {
  label: string;
  link: string;
  isActive: boolean;
  Icon: React.ElementType;
  onClick: () => void;
}

const SidebarItem = ({
  label,
  link,
  isActive,
  Icon,
  onClick,
}: SidebarItemProps) => {
  return (
    <Link
      href={link}
      className="nav-item d-flex align-items-center gap-3 no-underline"
      onClick={onClick}
    >
      <Icon
        size={24}
        weight={`${
          isActive ? (link === "/dashboard/links" ? "bold" : "fill") : "regular"
        }`}
        className={isActive ? "text-black" : "text-neutral-900"}
      />
      <span className={`nav-link ${isActive ? "active" : ""} p-0`}>
        {label}
      </span>
    </Link>
  );
};
