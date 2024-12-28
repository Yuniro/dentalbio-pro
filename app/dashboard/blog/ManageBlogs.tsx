'use client'
import SkeletonLoader from '@/app/components/Loader/Loader';
import { useEffect, useState } from 'react';
import BlogCard from '../components/BlogCard';
import AddNewBlog from './AddNewBlog';
import EditBlogModal from '../components/EditBlogModal';

const ManageBlogs = () => {
  const [isEditingOpen, setIsEditingOpen] = useState<boolean>(false);
  const [blogs, setBlogs] = useState<any[] | null>(null);
  const [editingBlog, setEditingBlog] = useState<BlogType>({
    id: "",
    writer_id: "",
    title: "",
    content: "",
    image_url: "",
    meta_title: "",
    meta_description: "",
    rank: 0,
    created_at: "",
  });

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

  const handleAdd = async (blog: BlogType) => {
    setBlogs((prevBlogs) => {
      if (!prevBlogs) return [blog];
      return [...prevBlogs, blog];
    })
  }

  const handleEdit = async (blog: BlogType, image: File | null) => {
    if (image) {
      const image_url = await uploadImage(image);
      blog = { ...blog, image_url };
    }

    const response = await fetch('/api/blogs', {
      method: 'PUT',
      body: JSON.stringify({ ...blog }),
    });

    const result = await response.json();
    if (result.error) {
      console.log(result.error);
    } else {
      // console.log(result);
      setBlogs((prevBlogs) => {
        return prevBlogs?.map((blog) => (blog.id === result.id ? result : blog))!;
      })

      setIsEditingOpen(false);
    }
  }

  const handleDelete = async (id: string) => {
    setBlogs((prevBlogs) => {
      if (!prevBlogs) return prevBlogs;
      return prevBlogs.filter(blog => blog.id !== id);
    });

    const response = await fetch('/api/blogs', {
      method: 'DELETE',
      body: JSON.stringify({ id })
    });

    const data = await response.json();
    if (data.error) {
      console.log("Failed to delete", data.error);
    }
  }

  const handleEditItem = async (id: string) => {
    await setEditingBlog(blogs?.at(blogs?.findIndex((blog) => blog.id === id)));
    setIsEditingOpen(true);
  }

  const uploadImage = async (image: File) => {
    const formData = new FormData();
    formData.append('bucket_name', 'blog-images');
    formData.append('image', image);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    const result = await response.json();

    if (response.ok) {
      // console.log(`Image uploaded successfully! URL: ${result.publicUrl}`);
      return result.publicUrl;
    } else {
      console.log(`Error: ${result.error}`);
    }
  }

  return (
    <div>
      <h4 className='mb-6'>My Blogs</h4>

      {blogs ?
        blogs.length > 0 ?
          blogs.map((blog, index) => (
            <BlogCard
              key={index}
              onDelete={handleDelete}
              onEditItem={handleEditItem}
              {...blog}
            />
          )) :
          <div className='py-10 text-lg text-gray-400 text-center'>There is no blog to show</div> :
        <SkeletonLoader />}

      <div className="flex justify-end mt-6">
        <AddNewBlog onAdd={handleAdd} />
      </div>

      <EditBlogModal
        isOpen={isEditingOpen}
        onClose={() => setIsEditingOpen(false)}
        onSubmit={handleEdit}
        {...editingBlog}
      />
    </div>
  );
};

export default ManageBlogs;
