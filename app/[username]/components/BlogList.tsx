'use client'
import LinkTitle from "@/app/components/Link/LinkTitle";
import React, { useEffect, useState } from "react";

type BlogListProps = {
  userId: string;
  username: string;
  userFirstName: string;
  userTitle: string;
}

const BlogList: React.FC<BlogListProps> = ({
  userId,
  username,
  userFirstName,
  userTitle
}: BlogListProps) => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [blogTitle, setBlogTitle] = useState<string | null>(`${username}'s Blogs`);

  useEffect(() => {
    const fetchBlogTitle = async () => {
      const query = userId ? `?userId=${userId}` : '';
      const response = await fetch(`/api/blog-titles${query}`, {
        method: 'GET'
      });
      const data = await response.json();

      setBlogTitle((data.data.length > 0) ? data.data[0].title : `${username}'s Blogs`);
    };

    fetchBlogTitle();
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      const query = userId ? `?userId=${userId}` : '';
      const response = await fetch(`/api/blogs${query}`, {
        method: 'GET'
      });
      const data = await response.json();
      setBlogs(data.data);
    };

    fetchBlogs();
  }, []);

  return (
    <div className="text-center mb-4" id="blog">
      {(blogs.length > 0) &&
        <>
          <h1 className="section-heading-treatment text-[23px] font-semibold">{blogTitle}</h1>
          {blogs.map((blog, index) => (
            <LinkTitle
              key={index}
              link={`${username}/blog/${blog.slug}`}
              title={blog.title}
            />
          ))}
        </>}
    </div>
  )
}

export default BlogList;