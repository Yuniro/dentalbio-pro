"use client";
import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Trash,
  PencilSimple,
  ArrowSquareOut,
  CaretUp,
  CaretDown,
} from "phosphor-react";
import { useDrag, useDrop } from "react-dnd";
import Link from "next/link";

const ItemType = {
  LINK: "link",
};

export default function LinkItem({
  link,
  index,
  moveLink,
  setLinks,
  links,
  linkGroupId,
}: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(link.title);
  const [newLinkUrl, setNewLinkUrl] = useState(link.link);
  const [isActive, setIsActive] = useState(link.is_active);

  const ref = React.useRef<HTMLLIElement>(null);

  const [, drag] = useDrag({
    type: ItemType.LINK,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType.LINK,
    hover: (draggedItem: any) => {
      if (draggedItem.index !== index) {
        moveLink(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  drag(drop(ref));

  // Handle toggling the is_active field
  const handleToggleActive = async () => {
    const supabase = createClient();

    const { error } = await supabase
      .from("links")
      .update({ is_active: !isActive })
      .eq("link_id", link.link_id);

    if (error) {
      console.error("Error updating is_active field:", error);
    } else {
      setIsActive(!isActive);
      const event = new Event("iframeRefresh");
      window.dispatchEvent(event);
    }
  };

  // Handle deleting a link
  const handleDeleteLink = async () => {
    const supabase = createClient();

    // First, delete the link from the `dentistry_links` table
    const { error: dentistryLinksError } = await supabase
      .from("dentistry_links")
      .delete()
      .eq("link_id", link.link_id);

    if (dentistryLinksError) {
      console.error(
        "Error deleting from dentistry_links:",
        dentistryLinksError
      );
      return;
    }

    // Then, delete the actual link from the `links` table
    const { error: linksError } = await supabase
      .from("links")
      .delete()
      .eq("link_id", link.link_id);

    if (linksError) {
      console.error("Error deleting from links:", linksError);
      return;
    }

    // Remove the deleted link from the local state
    const updatedLinks = links.filter((l: any) => l.link_id !== link.link_id);

    // Update ranks of remaining links
    const reRankedLinks = updatedLinks.map((l: any, idx: number) => ({
      ...l,
      rank: idx + 1,
    }));

    setLinks(reRankedLinks);

    // Update ranks in the database
    for (let i = 0; i < reRankedLinks.length; i++) {
      const { error: rankError } = await supabase
        .from("links")
        .update({ rank: reRankedLinks[i].rank })
        .eq("link_id", reRankedLinks[i].link_id);
      if (rankError) {
        console.error("Error updating rank:", rankError);
      }
    }

    const event = new Event("iframeRefresh");
    window.dispatchEvent(event);
  };

  // Handle editing a link
  const handleEditLink = async () => {
    const supabase = createClient();

    const { error } = await supabase
      .from("links")
      .update({ title: newTitle, link: newLinkUrl })
      .eq("link_id", link.link_id);

    if (error) {
      console.error("Error updating link:", error);
    } else {
      setIsEditing(false);
      const updatedLinks = links.map((l: any) =>
        l.link_id === link.link_id
          ? { ...l, title: newTitle, link: newLinkUrl }
          : l
      );
      setLinks(updatedLinks);
      const event = new Event("iframeRefresh");
      window.dispatchEvent(event);
    }
  };

  return (
    <li
      ref={ref}
      className="flex justify-between items-center mb-2 bg-transparent w-full"
    >
      {isEditing ? (
        <div className="flex flex-column max-w-100 w-full">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full p-2 rounded-[26px] py-2 text-base px-3 placeholder:text-neutral-500 text-neutral-800 placeholder:font-normal mb-2"
            placeholder="Link Title"
          />
          <input
            type="text"
            value={newLinkUrl}
            onChange={(e) => setNewLinkUrl(e.target.value)}
            className="w-full p-2 rounded-[26px] py-2 text-base px-3 placeholder:text-neutral-500 text-neutral-800 placeholder:font-normal"
            placeholder="Link URL"
          />
          <div className="flex gap-2 pt-2 w-full justify-end">
            <button
              onClick={handleEditLink}
              className="bg-primary-1 hover:bg-[#302A83] transition-all text-white py-1.5 rounded-[26px] text-md px-3 font-semibold flex items-center gap-2"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-neutral-500 hover:bg-opacity-80 transition-all text-white py-1.5 rounded-[26px] text-md px-3 font-semibold flex items-center gap-2"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="membar-cards w-full">
            <div className="flex items-start gap-3 bg-transparent w-full p-4">
              {/* Drag Handle */}
              <div className="flex flex-col gap-0 cursor-move p-1 mt-2">
                <CaretUp className="-mb-0.5" weight="bold" />
                <CaretDown className="-mt-0.5" weight="bold" />
              </div>
              <div className="w-full">
                {/* Member Card Actions */}
                <div className="flex items-center justify-between gap-2 mb-3 member-cards-actions">
                  <div>
                    <div className="flex items-center gap-2 member-heading">
                      <p className="mb-0">{link.title}</p>
                      {/* Edit Icon */}
                      <PencilSimple
                        onClick={() => setIsEditing(true)}
                        className="cursor-pointer"
                      />
                    </div>
                    {/* Link */}
                    <p className="links-wrapper mb-0">{link.link}</p>
                  </div>
                  {/* Link and Switch */}
                  <div className="flex gap-1 items-center">
                    <button
                      onClick={handleDeleteLink}
                      className="w-8 h-8 p-0.5 hover:bg-red-100 hover:text-red-700 flex items-center justify-center rounded-md transition-all"
                    >
                      <Trash size={20} />
                    </button>
                    <Link
                      href={link.link}
                      target="_blank"
                      className="w-8 h-8 p-0.5 hover:bg-neutral-100 hover:text-neutral-700 text-neutral-900 flex items-center justify-center rounded-md transition-all"
                    >
                      <ArrowSquareOut size={20} />
                    </Link>
                    <div className="relative inline-block w-8 h-5">
                      <input checked={isActive} onChange={handleToggleActive} id="switch-component-blue" type="checkbox" className="peer appearance-none w-8 h-5 bg-white border-grey-500 border-[1px] rounded-full checked:bg-[#7d71e5] cursor-pointer transition-colors duration-300" />
                      <label htmlFor="switch-component-blue" className="absolute top-0 left-[2px] w-[14px] h-[14px] mt-[3px] bg-[#86B7FE] rounded-full shadow-sm transition-transform duration-300 peer-checked:translate-x-4 peer-checked:border-grey-500 peer-checked:bg-white cursor-pointer">
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </li>
  );
}
