"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import LinkItem from "./LinkItem";
import { useDrag, useDrop } from "react-dnd";

const ItemType = {
  LINK: "link",
};

// Fetch links for the link group
async function fetchLinks(linkGroupId: string) {
  const supabase = createClient();
  const { data: links, error } = await supabase
    .from("dentistry_links")
    .select(`
      link_id,
      links (
        title,
        link
      ),
      rank
    `)
    .eq("link_group_id", linkGroupId)
    .order("rank", { ascending: true });

  if (error) {
    console.error("Error fetching links:", error);
    return [];
  }

  return links.map((entry: any) => ({
    link_id: entry.link_id,
    title: entry.links.title,
    link: entry.links.link,
    rank: entry.rank,
  }));
}

export default function ManageLinks({ linkGroupId }: { linkGroupId: string }) {
  const [links, setLinks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load links for the link group
  const loadLinks = async () => {
    setIsLoading(true);
    const fetchedLinks = await fetchLinks(linkGroupId);
    setLinks(fetchedLinks);
    setIsLoading(false);
  };

  useEffect(() => {
    loadLinks(); // Load links when the component mounts
  }, [linkGroupId]);

  return (
    <ul>
    {links.length > 0 ? (
      links.map((link, index) => (
        <LinkItem
          key={link.link_id}
          index={index}
          link={link}
          setLinks={setLinks}
          links={links}
          linkGroupId={linkGroupId}
        />
      ))
    ) : (
      <div>No links added yet</div>
    )}
  </ul>
  
  );
}
