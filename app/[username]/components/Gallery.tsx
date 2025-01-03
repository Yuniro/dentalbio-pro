"use client";
import { useEffect, useState } from "react";
import { Plus, Minus } from "phosphor-react"; // Import Phosphor Icons
import { createClient } from "@/utils/supabase/client";
import Collapse from "./Collapse";
import GalleryImage from "./GalleryImage";

export default function Gallery({ userId }: { userId: string }) {
  const [galleries, setGalleries] = useState<any[]>([]);

  // Fetch treatments from Supabase
  useEffect(() => {
    const fetchGalleries = async () => {
      const query = userId ? `?userId=${userId}` : '';
      const response = await fetch(`/api/galleries${query}`, {
        method: 'GET'
      });
      const data = await response.json();
      setGalleries(data.data);
    };

    fetchGalleries();
  }, [userId]);

  // Render treatments
  return (
    <div className="text-center treatment-wrapper" id="gallery">
      <h1 className="section-heading-treatment text-[23px] font-semibold">Gallery</h1>
      <div
        className="accordion custom-accoradion-wrapper"
        id="accordionExample"
      >
        {galleries.map((gallery, index) => (
          <div key={index} className="flex justify-around mb-4">
            <GalleryImage
              src={gallery.before_image_url}
              title={gallery.title}
              isAfter={false}
            />
            <GalleryImage
              src={gallery.after_image_url}
              title={gallery.title}
              isAfter={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
