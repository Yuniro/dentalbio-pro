'use client'
import SkeletonLoader from '@/app/components/Loader/Loader';
import { useEffect, useState } from 'react';
import BlogCard from '../components/BlogCard';

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState<any[] | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      const response = await fetch('/api/blogs', {
        method: 'GET'
      });
      const data = await response.json();
      setBlogs(data.data);

      console.log(data);
    };

    fetchBlogs();
  }, []);

  return (
    <div>
      <h4 className='mb-6'>My Blogs</h4>
      {blogs ?
        blogs.length > 0 ?
          blogs.map((blog, index) => (
            <BlogCard
              key={index}
              {...blog}
            />
          )) :
          <div className='py-10 text-lg text-gray-400 text-center'>There is no blog to show</div> :
        <SkeletonLoader />}
    </div>
  );
};

export default ManageBlogs;
