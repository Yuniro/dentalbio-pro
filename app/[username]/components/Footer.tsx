"use client";
import React, { useEffect, useState } from "react";
import { DotsThreeCircle } from "phosphor-react";
import { createClient } from "@/utils/supabase/client";
import ShareModal from "./ShareModal";
import SocialLinks from "./SocialLinks";

export default function Footer({
  dentistryId,
  bookingLink,
  contact_email,
  userFirstName,
  userLastName,
  username,
}: {
  dentistryId: string;
  bookingLink: string;
  contact_email: string;
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
            <SocialLinks {...socialLinks} />
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
              Join {userFirstName} {userLastName} on Dentalbio
            </a>
          </div>
          <div className="absolute w-[44px] top-0 right-0">
            <ShareModal username={username} />
          </div>
        </div>

        <div className="row">
          <div className="col-12 text-center digimax-wrapper">
            <img
              src="../../Perks-logo.svg"
              alt="digimax"
              className="img-fluid mx-auto"
            />
            <p>
              A{" "}
              <a href="https://digimax.dental/" target="_blank">
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
