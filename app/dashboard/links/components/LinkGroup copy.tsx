"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import AddLinkForm from "./AddLinkForm";
import LinkItem from "./LinkItem";

// Fetch links for the link group
async function fetchLinks(linkGroupId: string) {
  const supabase = createClient();

  // Ensure we are properly joining the dentistry_links table with the links table
  const { data: links, error } = await supabase
    .from("dentistry_links")
    .select(`
      link_id,
      links (
        title,
        link
      )
    `)
    .eq("link_group_id", linkGroupId); // Make sure we are filtering by the correct link_group_id

  if (error) {
    console.error("Error fetching links:", error);
    return [];
  }

  if (!links || links.length === 0) {
    console.log("No links found");
    return [];
  }

  // Return the joined data (link_id, title, link)
  return links.map((entry: any) => ({
    link_id: entry.link_id,
    title: entry.links.title,
    link: entry.links.link,
  }));
}

export default function LinkGroup({ group, dentistryId }: any) {
  const [links, setLinks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newHeading, setNewHeading] = useState(group.heading);

  const loadLinks = async () => {
    setIsLoading(true);
    const fetchedLinks = await fetchLinks(group.link_group_id);
    setLinks(fetchedLinks);
    setIsLoading(false);
  };

  useEffect(() => {
    loadLinks();
  }, [group.link_group_id]);

  // Handle group title edit
  const handleEditGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();

    const { error: updateError } = await supabase
      .from("link_groups")
      .update({ heading: newHeading })
      .eq("link_group_id", group.link_group_id);

    if (updateError) {
      console.error("Error updating group heading:", updateError);
    } else {
      setIsEditing(false);
    }
  };

  const handleDeleteGroup = async () => {
    const supabase = createClient();
    const { error: deleteError } = await supabase
      .from("link_groups")
      .delete()
      .eq("link_group_id", group.link_group_id);

    if (deleteError) {
      console.error("Error deleting group:", deleteError);
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="link-group">
      {isEditing ? (
        <form onSubmit={handleEditGroup}>
          <input
            type="text"
            value={newHeading}
            onChange={(e) => setNewHeading(e.target.value)}
            className="w-full p-2 mb-3"
          />
          <button type="submit" className="btn btn-primary">
            Save Heading
          </button>
        </form>
      ) : (
        <div className="d-flex align-items-center gap-2 mb-3">
          <h3>{group.heading}</h3>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDeleteGroup}>Delete Group</button>
        </div>
      )}

      <AddLinkForm linkGroupId={group.link_group_id} onLinkAdded={loadLinks} />
      <ul>
        {isLoading ? (
          <div>Loading...</div>
        ) : links.length > 0 ? (
          links.map((link, index) => (
            <LinkItem
              key={link.link_id}
              index={index}
              link={link}
              group={group}
              setLinks={setLinks}
              links={links}
            />
          ))
        ) : (
          <div>No links added yet</div>
        )}
      </ul>
    </div>
  );
}