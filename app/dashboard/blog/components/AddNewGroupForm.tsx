"use client";
import React, { useState } from "react";
import LabeledInput from "../../components/LabeledInput";
import { Spinner } from "@phosphor-icons/react/dist/ssr";
import FullRoundedButton from "@/app/components/Button/FullRoundedButton";

export default function AddNewGroupForm({
  onAdd,
  targetUserId,
  enabled = false,
}: {
  onAdd: (group: BlogGroupType) => void,
  targetUserId: string | null;
  enabled?: boolean;
}) {
  const [heading, setHeading] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false); // State to toggle form visibility

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);


    const formData = { name: heading, targetUserId };

    const response = await fetch('/api/blog-groups', {
      method: 'POST',
      body: JSON.stringify(formData)
    })

    const result = await response.json();

    if (response.ok) {
      onAdd(result);
    } else {
      console.log(`Error: ${result.error}`);
    }

    setHeading(""); // Reset the input after adding the group
    setIsLoading(false);
    setShowForm(false); // Hide the form after successful submission
  };

  return (
    <div className="w-full">
      {/* Button to toggle the form */}
      {!showForm && (
        <>
          <FullRoundedButton className="w-full mb-4 py-3 text-xl" onClick={() => setShowForm(true)} disabled={!enabled}>Add New Group</FullRoundedButton>
        </>
      )}

      {/* Form to add a new link group */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-column max-w-100 w-full"
        >
          <LabeledInput
            label="Group Title"
            name="name"
            type="text"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            required
          />
          <div className="flex gap-2 pt-2 mb-4 w-full justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary-1 hover:bg-[#302A83] transition-all text-white py-1.5 rounded-[26px] text-md px-3 font-semibold flex items-center gap-2"
            >
              {isLoading && <Spinner className="animate-spin" size={20} />} Save
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
