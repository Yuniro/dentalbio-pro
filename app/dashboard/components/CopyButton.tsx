"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Cookies from "js-cookie";

const CopyButton = ({ username }: { username: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://dental.bio/${username}`);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000); // Reset copy message after 2 seconds
  };

  return (
    <div className="d-flex align-items-center justify-content-between gap-2 dentalbio-copy-wrapper">
      <p className="m-0 truncate transition-all">
        dental.bio/
        <span>{username ? `${username}` : "Loading..."}</span>
      </p>
      <button
        className="btn btn-outline-primary z-10  transition-all"
        onClick={handleCopy}
      >
        {isCopied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
};

export default CopyButton;
