// "use client";
// import React, { useState } from "react";
// import { createClient } from "@/utils/supabase/client";
// import {
//   Trash,
//   PencilSimple,
//   ArrowsVertical,
//   ArrowSquareOut,
//   CaretUp,
//   CaretDown,
// } from "phosphor-react";
// import { useDrag, useDrop } from "react-dnd";
// import Link from "next/link";

// const ItemType = {
//   LINK: "link",
// };

// export default function LinkItem({
//   link,
//   index,
//   setLinks,
//   links,
//   linkGroupId,
// }: any) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [newTitle, setNewTitle] = useState(link.title);
//   const [newLinkUrl, setNewLinkUrl] = useState(link.link);
//   const [isActive, setIsActive] = useState(link.is_active);

//   // Drag and Drop for rearranging links
//   const [, ref] = useDrag({
//     type: ItemType.LINK,
//     item: { index, link_id: link.link_id },
//   });

//   const [, drop] = useDrop({
//     accept: ItemType.LINK,
//     hover: (draggedItem: any) => {
//       if (draggedItem.index !== index) {
//         const updatedLinks = [...links];
//         const [movedLink] = updatedLinks.splice(draggedItem.index, 1); // Remove the dragged link
//         updatedLinks.splice(index, 0, movedLink); // Insert the dragged link into the new index
//         setLinks(updatedLinks); // Update the state with the new order
//         draggedItem.index = index; // Update the dragged item's index to the new index
//       }
//     },
//     drop: async () => {
//       const supabase = createClient();
//       for (let i = 0; i < links.length; i++) {
//         const newRank = i + 1; // Ranks start from 1
//         const linkToUpdate = links[i];

//         // Update the rank in the `links` table
//         const { error: rankError } = await supabase
//           .from("links")
//           .update({ rank: newRank })
//           .eq("link_id", linkToUpdate.link_id); // Update each link's rank by its link_id

//         if (rankError) {
//           console.error("Error updating rank:", rankError);
//         }
//       }
//     },
//   });

//   // Handle toggling the is_active field
//   const handleToggleActive = async () => {
//     const supabase = createClient();

//     // Update the `is_active` field in the `links` table
//     const { error } = await supabase
//       .from("links")
//       .update({ is_active: !isActive })
//       .eq("link_id", link.link_id);

//     if (error) {
//       console.error("Error updating is_active field:", error);
//     } else {
//       setIsActive(!isActive); // Update local state
//     }
//   };

//   // Handle deleting a link
//   const handleDeleteLink = async () => {
//     const supabase = createClient();

//     // First, delete the link from the `dentistry_links` table
//     const { error: dentistryLinksError } = await supabase
//       .from("dentistry_links")
//       .delete()
//       .eq("link_id", link.link_id);

//     if (dentistryLinksError) {
//       console.error(
//         "Error deleting from dentistry_links:",
//         dentistryLinksError
//       );
//       return; // Exit if there's an error
//     }

//     // Then, delete the actual link from the `links` table
//     const { error: linksError } = await supabase
//       .from("links")
//       .delete()
//       .eq("link_id", link.link_id);

//     if (linksError) {
//       console.error("Error deleting from links:", linksError);
//       return; // Exit if there's an error
//     }

//     // Remove the deleted link from the local state
//     setLinks(links.filter((l: any) => l.link_id !== link.link_id));

//     // Now, update the ranks of the remaining links
//     for (let i = 0; i < links.length; i++) {
//       const updatedLink = links[i];
//       if (updatedLink.link_id !== link.link_id) {
//         const newRank = i + 1; // Adjust the rank based on the index

//         // Update the rank in the `links` table
//         const { error: rankError } = await supabase
//           .from("links")
//           .update({ rank: newRank })
//           .eq("link_id", updatedLink.link_id);

//         if (rankError) {
//           console.error("Error updating rank:", rankError);
//         }
//       }
//     }
//   };

//   // Handle editing a link
//   const handleEditLink = async () => {
//     const supabase = createClient();

//     const { error } = await supabase
//       .from("links")
//       .update({ title: newTitle, link: newLinkUrl })
//       .eq("link_id", link.link_id);

//     if (error) {
//       console.error("Error updating link:", error);
//     } else {
//       setIsEditing(false);
//       const updatedLinks = links.map((l: any) =>
//         l.link_id === link.link_id
//           ? { ...l, title: newTitle, link: newLinkUrl }
//           : l
//       );
//       setLinks(updatedLinks);
//     }
//   };

//   return (
//     <li
//       // @ts-ignore
//       ref={(node) => ref(drop(node))}
//       className="d-flex justify-between align-items-center mb-2 bg-transparent w-full"
//     >
//       {isEditing ? (
//         <div className="d-flex flex-column max-w-100 w-full">
//           <input
//             type="text"
//             value={newTitle}
//             onChange={(e) => setNewTitle(e.target.value)}
//             className="w-full p-2 rounded-[26px] py-2 text-base px-3 placeholder:text-neutral-500 text-neutral-800 placeholder:font-normal mb-2"
//             placeholder="Link Title"
//           />
//           <input
//             type="text"
//             value={newLinkUrl}
//             onChange={(e) => setNewLinkUrl(e.target.value)}
//             className="w-full p-2 rounded-[26px] py-2 text-base px-3 placeholder:text-neutral-500 text-neutral-800 placeholder:font-normal"
//             placeholder="Link URL"
//           />
//           <div className="flex gap-2 pt-2 w-full justify-end">
//             <button
//               onClick={handleEditLink}
//               className="bg-[#5046db] hover:bg-[#302A83] transition-all text-white py-1.5 rounded-[26px] text-md px-3 font-semibold flex items-center gap-2"
//             >
//               Save
//             </button>
//             <button
//               onClick={() => setIsEditing(false)}
//               className="bg-neutral-500 hover:bg-opacity-80 transition-all text-white py-1.5 rounded-[26px] text-md px-3 font-semibold flex items-center gap-2"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       ) : (
//         <>
//           <div className="membar-cards w-full">
//             <div className="d-flex align-items-start gap-3 bg-transparent w-full">
//               {/* Drag Arrow Icon */}

//               <div
//                 // @ts-ignore
//                 ref={ref}
//                 className="flex flex-col gap-0 hover:bg-purple-100 hover:text-[#302a83] rounded-md cursor-pointer p-1 mt-2"
//               >
//                 <CaretUp className="-mb-0.5" weight="bold" />
//                 <CaretDown className="-mt-0.5" weight="bold" />
//               </div>
//               <div className="w-full">
//                 {/* Member Card Actions */}
//                 <div className="d-flex align-items-center justify-content-between gap-2 mb-3 member-cards-actions">
//                   <div>
//                     <div className="d-flex align-items-center gap-2 member-heading">
//                       <p className="mb-0">{link.title}</p>
//                       {/* Edit Icon */}
//                       <PencilSimple
//                         onClick={() => setIsEditing(true)}
//                         className="cursor-pointer"
//                       />
//                     </div>
//                     {/* Link */}
//                     <p className="links-wrapper mb-0">{link.link}</p>
//                   </div>
//                   {/* Link and Switch */}
//                   <div className="d-flex gap-1 align-items-center">
//                     <button
//                       onClick={handleDeleteLink}
//                       className="w-8 h-8 p-0.5 hover:bg-red-100 hover:text-red-700 flex items-center justify-center rounded-md transition-all"
//                     >
//                       <Trash size={20} />
//                     </button>
//                     <Link
//                       href={link.link}
//                       target="_blank"
//                       className="w-8 h-8 p-0.5 hover:bg-neutral-100 hover:text-neutral-700 text-neutral-900 flex items-center justify-center rounded-md transition-all"
//                     >
//                       <ArrowSquareOut size={20} />
//                     </Link>
//                     <div className="form-check form-switch custom-form-check ml-2">
//                       <input
//                         className="form-check-input"
//                         type="checkbox"
//                         role="switch"
//                         id="flexSwitchCheckChecked"
//                         checked={isActive}
//                         onChange={handleToggleActive} // Call the toggle function here
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </li>
//   );
// }
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
    }
  };

  return (
    <li
      ref={ref}
      className="d-flex justify-between align-items-center mb-2 bg-transparent w-full"
    >
      {isEditing ? (
        <div className="d-flex flex-column max-w-100 w-full">
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
              className="bg-[#5046db] hover:bg-[#302A83] transition-all text-white py-1.5 rounded-[26px] text-md px-3 font-semibold flex items-center gap-2"
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
            <div className="d-flex align-items-start gap-3 bg-transparent w-full">
              {/* Drag Handle */}
              <div className="flex flex-col gap-0 cursor-move p-1 mt-2">
                <CaretUp className="-mb-0.5" weight="bold" />
                <CaretDown className="-mt-0.5" weight="bold" />
              </div>
              <div className="w-full">
                {/* Member Card Actions */}
                <div className="d-flex align-items-center justify-content-between gap-2 mb-3 member-cards-actions">
                  <div>
                    <div className="d-flex align-items-center gap-2 member-heading">
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
                  <div className="d-flex gap-1 align-items-center">
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
                    <div className="form-check form-switch custom-form-check ml-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id={`flexSwitchCheckChecked-${link.link_id}`}
                        checked={isActive}
                        onChange={handleToggleActive}
                      />
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
