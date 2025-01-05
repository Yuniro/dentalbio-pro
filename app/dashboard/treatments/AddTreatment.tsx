"use client";
import React, { useReducer, useState } from "react";
import SaveButton from "../components/SaveButton";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import LabeledInput from "../components/LabeledInput";
import LimitedTextArea from "../components/LimitedTextArea";

// Function for Captical First
function toCapitalFirst(sentence: string): string {
  return sentence.toLowerCase().replace(/\b\w/g, (match) => match.toUpperCase());
}

// Client-side component to add a treatment
export default function AddTreatmentForm({ dentistryId }: { dentistryId: string }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isService, toggleIsService] = useReducer((prevState) => !prevState, true);
  const router = useRouter(); // Next.js router for refresh

  const maxLimit = 200;

  // Function to limit text area
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Prevent input beyond the max limit
    if (e.target.value.length <= maxLimit) {
      setDescription(e.target.value);
    }
  }

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (description === '') {
      setIsFocused(false);
    }
  };

  // Function to handle the form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const supabase = createClient();

    // Insert new treatment
    const { data: treatmentData, error: treatmentError } = await supabase
      .from("treatments")
      .insert([{
        title: toCapitalFirst(title),
        description,
        isService
      }])
      .select("treatment_id")
      .single();

    if (treatmentError) {
      console.error("Error adding treatment:", treatmentError);
      return;
    }

    // Get the max rank for the treatments associated with the dentistry
    const { data: maxRankData, error: rankError } = await supabase
      .from("dentistry_treatments")
      .select("rank")
      .eq("dentistry_id", dentistryId)
      .order("rank", { ascending: false })
      .limit(1)
      .single();

    let nextRank = 1; // Default to 1 if no treatments exist

    if (maxRankData) {
      nextRank = maxRankData.rank + 1; // Increment rank if there is data
    } else if (rankError && rankError.code !== "PGRST116") {
      // Only log if the error is something other than no rows found (PGRST116)
      console.error("Error fetching max rank:", rankError);
      return;
    }

    // Link the new treatment to the dentistry
    const { error: linkError } = await supabase
      .from("dentistry_treatments")
      .insert([
        { dentistry_id: dentistryId, treatment_id: treatmentData.treatment_id, rank: nextRank },
      ]);

    if (linkError) {
      console.error("Error linking treatment:", linkError);
      return;
    }

    // Ensure page refresh after successful submission
    try {
      window.location.reload(); // Hard refresh fallback
    } catch (error) {
      console.error("Soft refresh failed, performing hard reload:", error);
      window.location.reload(); // Hard refresh fallback
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 mt-10">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold mb-3">Add new {isService ? "service" : "treatment"}</h2>
        <div className="flex justify-between items-center gap-2">
          <label>Treatment</label>
          <div className="form-check form-switch custom-form-check">
            <input
              className="form-check-input cursor-pointer toggler"
              type="checkbox"
              role="switch"
              // id={`flexSwitchCheckChecked-${link.link_id}`}
              checked={isService}
              onChange={toggleIsService}
            />
          </div>
          <label>Service</label>
        </div>
      </div>
      <div className="mb-3">
        <LabeledInput
          id='title'
          label={`${isService ? "Service" : "Treatment"} Title`}
          name="title"
          className="w-ful text-base"
          // placeholder="Treatment Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="relative w-full mb-3 bg-white rounded-[26px] pt-[20px] pb-2 px-4 ">
        <label
          htmlFor="description"
          className={`absolute top-[12px] text-gray-500 transition-all duration-100 ease-linear transform ${isFocused || description ? '-translate-y-[7px] text-xs' : 'scale-100'}`}
        >
          {isService ? "Service" : "Treatment"} Description
        </label>
        <textarea
          name="description"
          id="description"
          className="w-full resize-none focus:outline-none text-base placeholder:text-neutral-500 text-neutral-800 placeholder:font-normal min-h-40"
          // placeholder="Treatment Description"
          value={description}
          onChange={handleTextChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required
        />
        <div className='text-right text-gray-500'>{description.length}/{maxLimit}</div>
      </div>
      <div className="w-full flex justify-end">
        <SaveButton text={`Add ${isService ? "service" : "treatment"}`} />
      </div>
    </form>
  );
}
