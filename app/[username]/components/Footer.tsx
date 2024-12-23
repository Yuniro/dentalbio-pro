"use client";
import React, { useEffect, useState } from "react";
import { DotsThreeCircle } from "phosphor-react";
import { createClient } from "@/utils/supabase/client";
import ShareModal from "./ShareModal";

export default function Footer({
  dentistryId,
  bookingLink,
  contact_email,
  userTitle,
  userFirstName,
  userLastName,
  username,
}: {
  dentistryId: string;
  bookingLink: string;
  contact_email: string;
  userTitle: string;
  userFirstName: string;
  userLastName: string;
  username: string;
}) {
  const [socialLinks, setSocialLinks] = useState<any>(null);

  useEffect(() => {
    // Fetch social links
    async function fetchSocialLinks() {
      const supabase = createClient();
      const { data: socials, error: socialsError } = await supabase
        .from("socials")
        .select(
          "twitter_link, instagram_link, facebook_link, tiktok_link, other_link"
        )
        .eq("dentistry_id", dentistryId)
        .single();

      if (socialsError) {
        console.error("Error fetching social links:", socialsError);
        return;
      }

      setSocialLinks(socials);
    }

    fetchSocialLinks();
  }, [dentistryId]);

  return (
    <>
      <section>
        <div className="row section-wrapper-contact">
          <div className="col-12 text-center">
            {bookingLink && (
              <a href={`mailto:${contact_email}`}>
                <button className="custom-outline-btn contact-btn">
                  Contact me
                </button>
              </a>
            )}
            <div className="d-flex align-items-center justify-content-center gap-2 pt-1">
              {socialLinks?.instagram_link && (
                <a
                  href={socialLinks.instagram_link}
                  className="user-social-icon"
                >
                  <i className="fa-brands fa-instagram"></i>
                </a>
              )}
              {socialLinks?.tiktok_link && (
                <a href={socialLinks.tiktok_link} className="user-social-icon">
                  <i className="fa-brands fa-tiktok"></i>
                </a>
              )}
              {socialLinks?.twitter_link && (
                <a href={socialLinks.twitter_link} className="user-social-icon">
                  <i className="fa-brands fa-x-twitter"></i>
                </a>
              )}
              {socialLinks?.facebook_link && (
                <a
                  href={socialLinks.facebook_link}
                  className="user-social-icon"
                >
                  <i className="fa-brands fa-facebook"></i>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="relative align-items-center">
          <div className="col-12 text-center">
            <div className="footer-logo">
              <a href="/">
                <img src="/logo.svg" alt="logo" className="img-fluid mx-auto" />
              </a>
            </div>
            <a
              href="/"
              className="text-decoration-none text-black fw-semibold footer-dentalbio"
            >
              Join {userTitle === 'N/A' ? '' : userTitle} {userFirstName} on Dentalbio
            </a>
          </div>
          <div className="absolute w-[44px] top-0 right-0">
            <ShareModal username={username} />
          </div>
        </div>

        <div className="row">
          <div className="col-12 text-center digimax-wrapper">
            <img
              src="./Perks-logo.svg"
              alt="digimax"
              className="img-fluid mx-auto"
            />
            <p>
              A{" "}
              <a href="https://www.digimax.co.uk/" target="_blank">
                Digimax
              </a>{" "}
              Project
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
