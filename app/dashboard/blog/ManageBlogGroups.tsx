'use client'

import { useEffect, useState } from "react";

const ManageBlogGroups: React.FC = () => {
  const [blogGroups, setBlogGroups] = useState<any[]>([]);
  const [initialBlogGroups, setInitialBlogGroups] = useState<any[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const response = await fetch('/api/blog-groups', {
        method: 'GET'
      });
      const data = await response.json();
      
      setBlogGroups(data.data);
      setInitialBlogGroups(data.data);
    };

    fetchBlogs();
  }, []);

  return (
    <div>
      Manage Blog Groups
    </div>
  )
}

export default ManageBlogGroups;