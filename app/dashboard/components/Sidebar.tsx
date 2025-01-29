"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Cookies from "js-cookie";
import { User, Gear, MapPin, Heart, LinkSimple, House, ShoppingCartSimple } from "phosphor-react";
import { CheckSquare, Globe, Image, LockSimple, Medal, Newspaper, SealCheck, Video } from "@phosphor-icons/react/dist/ssr";
import { getEffectiveUserId } from "@/utils/user/getEffectiveUserId";
import { useAdmin } from "@/utils/functions/useAdmin";
import FullRoundedButton from "@/app/components/Button/FullRoundedButton";
import { sendDowngradePlanMail } from "@/utils/mails/sendDowngradePlanMail";
import ConfirmMessage from "@/app/components/Modal/ConfirmMessagel";

// Constants for storing keys in cookies
const COOKIE_USERNAME_KEY = "username";
const COOKIE_DENTISTRY_ID_KEY = "dentistry_id";

export default function Sidebar() {
  const { getTargetUserId } = useAdmin();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const [userSubscriptionStatus, setUserSubscriptionStatus] = useState<string | null>(null);
  const [dentistryId, setDentistryId] = useState<string | null>(null);
  const [announcements, setAnnouncements] = useState({ title: '', content: '' });
  const [proAvailable, setProAvailable] = useState<boolean>(false);
  const [premiumProAvailable, setPremiumProAvailable] = useState<boolean>(false);
  const [isOpenDowngradeConfirmMessage, setIsOpenDowngradeConfirmMessage] = useState<boolean>(false);
  const [isOpenDeleteConfirmMessage, setIsOpenDeleteConfirmMessage] = useState<boolean>(false);

  const pathname = usePathname();

  // Fetch user info on component mount
  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const response = await fetch('/api/announcements', {
        method: 'GET',
      });

      const fetchData = await response.json();
      setAnnouncements(fetchData);
    }

    fetchAnnouncements();
  }, [])

  const handleDowngrade = async () => {
    const response = await fetch("/api/subscribe", {
      method: "DELETE",
    });

    const data = await response.json();
    console.log(data);

    setProAvailable(false);
    setPremiumProAvailable(false);
  }

  const handleDelete = async () => {
    const supabase = createClient();

    const userId = await getEffectiveUserId({ targetUserId: getTargetUserId(), supabase });

    const response = await fetch('/api/dentistry', {
      method: 'DELETE',
      body: JSON.stringify({ id: userId })
    });

    const data = await response.json();

    if (data.error) {
      console.error(data.error);
    }

    router.push("/success");
  }

  // Function to toggle the sidebar visibility
  const handleToggle = () => setIsOpen(!isOpen);
  const handleClose = () => setIsOpen(false);

  // Fetch logged-in user's email and username, and set it in cookies
  const fetchUserInfo = async () => {
    const supabase = createClient();
    const response = await fetch('/api/user', {
      method: 'POST',
      body: JSON.stringify({ targetUserId: getTargetUserId()! })
    });
    const userRecord = await response.json();

    if (!userRecord) {
      return router.push("/error?message=user_not_found");
    }

    const fetchedUsername = userRecord.username;
    const userId = userRecord.id;

    // Store the username in cookies for future usage
    Cookies.set(COOKIE_USERNAME_KEY, fetchedUsername, { expires: 7 });
    setUsername(fetchedUsername);
    setUserSubscriptionStatus(userRecord.subscription_status);

    console.log(userRecord.subscription_status);

    if ((userRecord.subscription_status === "PRO" || userRecord.subscription_status === "PREMIUM PRO"))
      setProAvailable(true);
    if (userRecord.subscription_status === "PREMIUM PRO")
      setPremiumProAvailable(true);

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
              className={`offcanvas offcanvas-start navbar-collapse custom-memberpanel-navbar ${isOpen ? "show" : ""
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
                  label="Locations"
                  link="/dashboard/location"
                  isActive={pathname === "/dashboard/location"}
                  Icon={MapPin}
                  onClick={handleClose}
                />
                <SidebarItem
                  label="Treatments / Services"
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
                  label="Blogs"
                  link="/dashboard/blog"
                  isActive={pathname === "/dashboard/blog"}
                  enabled={proAvailable}
                  Icon={Newspaper}
                  onClick={handleClose}
                />
                <SidebarItem
                  label="Gallery"
                  link="/dashboard/gallery"
                  isActive={pathname === "/dashboard/gallery"}
                  enabled={proAvailable}
                  Icon={Image}
                  onClick={handleClose}
                />
                <SidebarItem
                  label="Reviews"
                  link="/dashboard/review"
                  isActive={pathname === "/dashboard/review"}
                  enabled={proAvailable}
                  Icon={CheckSquare}
                  onClick={handleClose}
                />
                <SidebarItem
                  label="Videos"
                  link="/dashboard/video"
                  isActive={pathname === "/dashboard/video"}
                  enabled={proAvailable}
                  Icon={Video}
                  onClick={handleClose}
                />
                <SidebarItem
                  label="Shop"
                  link="/dashboard/shop"
                  isActive={pathname === "/dashboard/shop"}
                  enabled={proAvailable}
                  Icon={ShoppingCartSimple}
                  onClick={handleClose}
                />
                <SidebarItem
                  label="Verification"
                  link="/dashboard/verification"
                  isActive={pathname === "/dashboard/verification"}
                  enabled={proAvailable}
                  Icon={SealCheck}
                  onClick={handleClose}
                />
                <SidebarItem
                  label="Domain Name"
                  link="/dashboard/domain"
                  isActive={pathname === "/dashboard/domain"}
                  enabled={premiumProAvailable}
                  Icon={Globe}
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

      {announcements.title &&
        <div className="memberpanel-sidebar-detail">
          <p className="fw-bold memberpanel-detail-title">
            {announcements.title}
          </p>
          <p className="mb-0">{announcements.content}</p>
        </div>}

      {!premiumProAvailable &&
        <Link
          href={"/upgrade"}
          target="_blank"
          className="no-underline add-btn upgrade-now-btn"
        >
          <button>Upgrade now</button>
        </Link>}
      {proAvailable &&
        <FullRoundedButton onClick={() => setIsOpenDowngradeConfirmMessage(true)} buttonType="warning" className="w-full my-4 text-[20px]">Cancel Current Plan</FullRoundedButton>}

      <FullRoundedButton onClick={() => setIsOpenDeleteConfirmMessage(true)} buttonType="danger" className="w-full my-4 text-[20px]">Delete Bio</FullRoundedButton>

      <div className="memberpanel-profile flex items-center justify-start">
        <img
          src={profilePicUrl || "/placeholder.png"}
          alt="Profile"
          className="img-fluid rounded-full w-16 h-16 object-cover"
        />
        <p className="fw-bold mb-0">@{username ? username : "loading..."}</p>
      </div>

      <ConfirmMessage
        description="Aure you sure you want to downgrade your plan?"
        okText="Delete"
        isOpen={isOpenDowngradeConfirmMessage}
        onClose={() => setIsOpenDowngradeConfirmMessage(false)}
        onOk={handleDowngrade}
      />

      <ConfirmMessage
        description="Aure you sure you want to delete your account?"
        okText="Delete"
        isOpen={isOpenDeleteConfirmMessage}
        onClose={() => setIsOpenDeleteConfirmMessage(false)}
        onOk={handleDelete}
      />
    </div>
  );
}

interface SidebarItemProps {
  label: string;
  link: string;
  isActive: boolean;
  enabled?: boolean;
  Icon: React.ElementType;
  onClick: () => void;
}

const SidebarItem = ({
  label,
  link,
  isActive,
  enabled = true,
  Icon,
  onClick,
}: SidebarItemProps) => {
  return (
    <Link
      href={link}
      className={`flex justify-start nav-item align-items-center gap-3 no-underline ${isActive ? "text-black" : enabled ? "text-neutral-900" : "text-gray-500"}`}
      onClick={onClick}
    >
      <Icon
        size={24}
        weight={`${isActive ? (link === "/dashboard/links" ? "bold" : "fill") : "regular"
          }`}
      />
      <div className="flex-grow">
        {label}
      </div>

      {!enabled &&
        <LockSimple size={20} />}
    </Link>
  );
};
