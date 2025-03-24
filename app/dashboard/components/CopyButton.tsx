"use client";

import { useState } from "react";

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
    <div className="flex justify-between items-center gap-2 dentalbio-copy-wrapper">
      <p className="m-0 truncate transition-all">
        dental.bio/
        <span>{username ? `${username}` : "Loading..."}</span>
      </p>
      <button
        onClick={handleCopy}
      >
        {isCopied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
};

export default CopyButton;
