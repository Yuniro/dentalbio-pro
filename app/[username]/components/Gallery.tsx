"use client";
import { useEffect, useState } from "react";
import { Plus, Minus } from "phosphor-react"; // Import Phosphor Icons
import { createClient } from "@/utils/supabase/client";
import Collapse from "./Collapse";
import GalleryImage from "./GalleryImage";
import { useNavbar } from "@/app/contexts/NavbarContext";

export default function Gallery({ userId }: { userId: string }) {
  const [galleries, setGalleries] = useState<any[]>([]);
  const { setNavItemState } = useNavbar();

  // Fetch treatments from Supabase
  useEffect(() => {
    const fetchGalleries = async () => {
      const query = userId ? `?userId=${userId}` : '';
      const response = await fetch(`/api/galleries${query}`, {
        method: 'GET'
      });
      const data = await response.json();
      setGalleries(data);

      if (data.length > 0) {
        setNavItemState("Gallery", true);
      }
    };

    fetchGalleries();
  }, [userId]);

  // Render treatments
  return (
    <div className="text-center treatment-wrapper" id="gallery">
      {galleries.length > 0 &&
        <>
          <h1 className="section-heading-treatment text-[23px] md:text-[26px] font-semibold pb-8">Gallery</h1>
          <div
            className="accordion custom-accoradion-wrapper"
            id="accordionExample"
          >
            {galleries.map((gallery) => (
              <div key={gallery.id} className="flex justify-center gap-6 mb-4">
                <GalleryImage
                  src={gallery.before_image_url}
                  title={gallery.title}
                  subTitle={gallery.before_image_label}
                />
                <GalleryImage
                  src={gallery.after_image_url}
                  title={gallery.title}
                  subTitle={gallery.after_image_label}
                />
              </div>
            ))}
          </div>
        </>}
    </div>
  );
}
