'use client'
import { useCallback, useEffect, useState } from 'react';
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import BlogCard from '../components/BlogCard';
import AddNewBlog from './AddNewBlog';
import EditBlogModal from '../components/EditBlogModal';
import SkeletonLoader from '@/app/components/Loader/Loader';
import { arraysAreEqual } from '@/utils/function_utils';

const ItemType = {
  BLOG: "BLOG"
}

function DraggableBlogCard({
  blog,
  index,
  onDelete,
  onEditItem,
  moveBlog
}: {
  blog: BlogType,
  index: number;
  onDelete: any;
  onEditItem: any;
  moveBlog: any;
}) {
  const [, ref] = useDrag({
    type: ItemType.BLOG,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType.BLOG,
    hover: (draggedItem: any) => {
      if (draggedItem.index !== index) {
        moveBlog(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => {
        if (node) ref(node);
        drop(node);
      }}
    >
      <BlogCard
        onDelete={onDelete}
        onEditItem={onEditItem}
        {...blog}
      />
    </div>
  );
}


const ManageBlogs = () => {
  const [isEditingOpen, setIsEditingOpen] = useState<boolean>(false);
  const [blogs, setBlogs] = useState<any[] | null>(null);
  const [initialBlogs, setInitialBlogs] = useState<any[] | null>(null);
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
      setInitialBlogs(data.data);
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

  const updateOrder = async (updatedBlogs: any[]) => {
    const orderList = updatedBlogs.map((blog, index) => ({
      id: blog.id,
      rank: index,
    }));

    // console.log(orderList);

    const response = await fetch('/api/blogs-manage', {
      method: 'POST',
      body: JSON.stringify(orderList)
    })

    const result = await response.json();

    if (response.ok) {
      console.log('update orders');
    } else {
      console.log(`Error: ${result.error}`)
    }
  }

  // Move treatment in the list
  const moveBlog = useCallback(
    (fromIndex: number, toIndex: number) => {
      const updatedBlogs = Array.from(blogs!);
      const [movedBlog] = updatedBlogs.splice(fromIndex, 1);
      updatedBlogs.splice(toIndex, 0, movedBlog);
      setBlogs(updatedBlogs);

      // Check if the new order is different from the initial order
      if (!arraysAreEqual(updatedBlogs, initialBlogs!)) {
        updateOrder(updatedBlogs);
      }
    }, [blogs]);

  return (
    <div>
      <h4 className='mb-6'>My Blogs</h4>

      <DndProvider backend={HTML5Backend}>
        {blogs ?
          blogs.length > 0 ?
            blogs.map((blog, index) => (
              <DraggableBlogCard
                key={index}
                index={index}
                blog={blog}
                onDelete={handleDelete}
                onEditItem={handleEditItem}
                moveBlog={moveBlog}
              />
            )) :
            <div className='py-10 text-lg text-gray-400 text-center'>There is no blog to show</div> :
          <SkeletonLoader />}
      </DndProvider>

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
