'use client'
import LinkTitle from "@/app/components/Link/LinkTitle";
import React, { useEffect, useState } from "react";

type BlogListProps = {
  username: string;
  groupname: string;
  fetchedBlogs: BlogType[];
}

const BlogList: React.FC<BlogListProps> = ({
  groupname,
  fetchedBlogs,
  username,
}: BlogListProps) => {
  const [blogs, setBlogs] = useState<any[]>(fetchedBlogs);

  return (
    <div className="text-center mb-4">
      {(blogs.length > 0) &&
        <>
          <h1 className="section-heading-treatment text-[26px] font-semibold pb-8">{groupname}</h1>
          {blogs.map((blog, index) => (
            <LinkTitle
              key={blog.id}
              link={`${username}/blog/${blog.slug}`}
              title={blog.title}
            />
          ))}
        </>}
    </div>
  )
}

export default BlogList;