"use client";
import { useEffect, useState } from "react";
import { Plus, Minus } from "phosphor-react"; // Import Phosphor Icons
import { createClient } from "@/utils/supabase/client";

export default function Treatments({ dentistryId }: { dentistryId: string }) {
  const [treatments, setTreatments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // Handle loading state
  const [openItem, setOpenItem] = useState<number | null>(null); // Track the accordion item

  // Fetch treatments from Supabase
  useEffect(() => {
    async function fetchTreatments() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("dentistry_treatments")
        .select("treatment_id, rank, treatments(title, description)")
        .eq("dentistry_id", dentistryId)
        .order("rank");

      if (error) {
        console.error("Error fetching treatments:", error);
        setLoading(false);
        return;
      }

      // Update the treatments state
      setTreatments(
        data.map((entry: any) => ({
          treatment_id: entry.treatment_id,
          title: entry.treatments.title,
          description: entry.treatments.description,
          rank: entry.rank,
        }))
      );

      setLoading(false);
    }

    fetchTreatments();
  }, [dentistryId]);

  // Toggle the accordion item
  const toggleItem = (index: number) => {
    setOpenItem((prevIndex) => (prevIndex === index ? null : index));
  };

  // Show loading message while fetching data
  if (loading) {
    return <h2 className="section-heading-treatment">Loading treatments...</h2>;
  }

  // If no treatments are available, show a placeholder message
  if (treatments.length === 0) {
    return <h2 className="section-heading-treatment"></h2>;
  }

  // Render treatments
  return (
    <section>
      <div className="text-center treatment-wrapper">
        <h1 className="section-heading-treatment">Treatments</h1>
        <div
          className="accordion custom-accoradion-wrapper"
          id="accordionExample"
        >
          {treatments.map((treatment, index) => (
            <div className="accordion-item" key={treatment.treatment_id}>
              <h2 className="accordion-header flex justify-between items-start">
                {/* Wrapper for both text and icon */}
                <button
                  className={`accordion-button flex-1 text-left ${
                    openItem === index ? "" : "collapsed"
                  }`}
                  type="button"
                  aria-expanded={openItem === index}
                  onClick={() => toggleItem(index)}
                  aria-controls={`collapse${index}`}
                >
                  <span>{treatment.title || "Untitled Treatment"}</span>
                </button>
                {/* Plus/Minus Icons */}
                <button
                  className="ml-2"
                  onClick={() => toggleItem(index)}
                  aria-expanded={openItem === index}
                >
                  {openItem === index ? (
                    <Minus size={20} />
                  ) : (
                    <Plus size={20} />
                  )}
                </button>
              </h2>
              <div
                id={`collapse${index}`}
                className={`accordion-collapse transition-all ${
                  openItem === index
                    ? "max-h-[500px] ease-in"
                    : "max-h-0 ease-out"
                } overflow-hidden duration-300`}
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body text-start">
                  <h6>
                    {treatment.description || "No description available."}
                  </h6>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
