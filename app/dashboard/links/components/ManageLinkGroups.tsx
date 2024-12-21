"use client";
import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { createClient } from "@/utils/supabase/client";
import LinkGroup from "./LinkGroup";

// Fetch link groups for the Dentistry
async function fetchLinkGroups(dentistryId: string) {
  const supabase = createClient();
  const { data: linkGroups, error } = await supabase
    .from("link_groups")
    .select("link_group_id, heading, rank")
    .eq("dentistry_id", dentistryId)
    .order("rank");

  if (error) {
    console.error(error);
    return [];
  }

  return linkGroups;
}

export default function ManageLinkGroups({
  dentistryId,
}: {
  dentistryId: string;
}) {
  const [linkGroups, setLinkGroups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch link groups on load
  const loadLinkGroups = async () => {
    setIsLoading(true);
    const fetchedLinkGroups = await fetchLinkGroups(dentistryId);
    setLinkGroups(fetchedLinkGroups);
    setIsLoading(false);
  };

  useEffect(() => {
    loadLinkGroups();
  }, [dentistryId]);

  return (
    <DndProvider backend={HTML5Backend}>
      {/* <h2 className="text-lg font-semibold mb-3">Manage Link Groups</h2> */}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        linkGroups.map((group, index) => (
          <LinkGroup
            key={group.link_group_id}
            group={group}
            index={index}
            setGroups={setLinkGroups}
            groups={linkGroups}
          />
        ))
      )}
    </DndProvider>
  );
}
