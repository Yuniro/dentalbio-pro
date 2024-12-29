'use client'
import LinkTitle from "@/app/components/Link/LinkTitle";
import React, { useEffect, useState } from "react";

type BlogListProps = {
  username: string;
  userFirstName: string;
  userTitle: string;
}

const BlogList: React.FC<BlogListProps> = ({
  username,
  userFirstName,
  userTitle
}: BlogListProps) => {
  const [blogs, setBlogs] = useState<any[] | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      const response = await fetch('/api/blogs', {
        method: 'GET'
      });
      const data = await response.json();
      setBlogs(data.data);
    };

    fetchBlogs();
  }, []);

  return (
    <div className="text-center mb-4">
      <h1 className="section-heading-treatment text-[23px] font-semibold">{userTitle === 'N/A' ? '' : userTitle} {userFirstName + '\'s Blogs'}</h1>
      {blogs && blogs.map((blog, index) => (
        <LinkTitle
          key={index}
          link={`${username}/blog/${blog.slug}`}
          title={blog.title}
        />
      ))}
    </div>
  )
}

export default BlogList;