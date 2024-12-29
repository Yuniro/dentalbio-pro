import Link from "next/link";
import React from "react";

type LinkTitleProps = {
  link: string;
  title: string;
}

const LinkTitle: React.FC<LinkTitleProps> = ({
  link,
  title,
}: LinkTitleProps) => {
  return (
    <div className="w-full">
      <div className="toplinks-main">
        <Link
          href={link || "#"}
          className="text-center toplinks-wrapper toplinks-without-image"
          rel="noopener noreferrer"
        >
          <span>{title || "Untitled Link"}</span>
        </Link>
      </div>
    </div>
  )
}

export default LinkTitle;