"use client";
import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";

import { LinkSimple } from "phosphor-react";

export default function AddLinkForm({
  linkGroupId,
  onLinkAdded,
}: {
  linkGroupId: string;
  onLinkAdded: () => void;
}) {
  const [title, setTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false); // Toggle form visibility

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const supabase = createClient();

    // Insert into links table
    const { data: newLink, error: linkError } = await supabase
      .from("links")
      .insert([{ title, link: linkUrl }])
      .select("link_id")
      .single();

    if (linkError) {
      console.error("Error adding link:", linkError);
      setIsLoading(false);
      return;
    }

    // Link the new link to the group
    const { error: linkGroupError } = await supabase
      .from("dentistry_links")
      .insert([{ link_group_id: linkGroupId, link_id: newLink.link_id }]);

    if (linkGroupError) {
      console.error("Error linking link to group:", linkGroupError);
      setIsLoading(false);
      return;
    }

    setTitle("");
    setLinkUrl("");
    setIsLoading(false);
    setShowForm(false); // Hide the form after successful submission

    // Callback to inform parent that a link was added
    onLinkAdded();
    window.location.reload();
  };

  return (
    <div className="w-full flex flex-col items-end">
      {/* Button to toggle the form */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="border border-neutral-800 hover:bg-neutral-300 flex items-center justify-center gap-1 transition-all text-neutral-950 py-2 px-4 rounded-[26px] text-md font-semibold"
        >
          <LinkSimple />
          Add New Link
        </button>
      )}

      {/* Form to add a new link */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-column max-w-100 w-full"
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded-[26px] py-2 text-base px-3 placeholder:text-neutral-500 text-neutral-800 placeholder:font-normal mb-2"
            placeholder="Title"
            required
          />
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="w-full p-2 rounded-[26px] py-2 text-base px-3 placeholder:text-neutral-500 text-neutral-800 placeholder:font-normal"
            placeholder="URL"
            required
          />
          <div className="flex gap-2 pt-2 w-full justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary-1 hover:bg-[#302A83] transition-all text-white py-1.5 rounded-[26px] text-md px-3 font-semibold flex items-center gap-2"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-neutral-500 hover:bg-opacity-80 transition-all text-white py-1.5 rounded-[26px] text-md px-3 font-semibold flex items-center gap-2"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
