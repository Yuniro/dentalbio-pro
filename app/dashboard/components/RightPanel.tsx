"use client";
import React, { useEffect, useState } from "react";
import CopyButton from "./CopyButton";
import RightPanelClient from "./RightPanelClient";
import { useAdmin } from "@/utils/functions/useAdmin";
import { useRouter } from "next/navigation";

const RightPanel: React.FC = () => {
  const { getTargetUserId } = useAdmin();
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchUserInfo();
  }, []);

  // Fetch logged-in user's email and username, and set it in cookies
  const fetchUserInfo = async () => {
    const response = await fetch('/api/user', {
      method: 'POST',
      body: JSON.stringify({ targetUserId: getTargetUserId()! })
    });
    const data = await response.json();

    if (!data) {
      return router.push("/error?message=user_not_found");
    }

    setUsername(data.username);
  };

  return (
    <>
      <div className="col-xl-3 col-12 mb-3">
        <CopyButton username={username} />
        <RightPanelClient username={username} />
      </div>
    </>
  );
};

export default RightPanel;
