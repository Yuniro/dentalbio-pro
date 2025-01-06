'use client'

import { useCallback, useEffect, useState } from "react";
import AddNewGroupForm from "./components/AddNewGroupForm";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableBlogGroup from "./components/DraggableBlogGroup";
import { arraysAreEqual } from "@/utils/function_utils";
import { usePreview } from "@/app/components/PreviewContext";
import ManageBlogs from "./ManageBlogs";
import SkeletonLoader from "@/app/components/Loader/Loader";

type ManageBlogGroupProps = {
  username: string;
}

const ManageBlogGroups: React.FC<ManageBlogGroupProps> = ({ username }: { username: string; }) => {
  const [blogGroups, setBlogGroups] = useState<BlogGroupType[] | null>(null);
  const [initialBlogGroups, setInitialBlogGroups] = useState<BlogGroupType[]>([]);

  const { triggerReload } = usePreview();

  useEffect(() => {
    const fetchBlogGroups = async () => {
      const response = await fetch('/api/blog-groups', {
        method: 'GET'
      });
      const data = await response.json();

      setBlogGroups(data.data);
      setInitialBlogGroups(data.data);
    };

    fetchBlogGroups();
  }, []);

  const handleAdd = (group: BlogGroupType) => {
    setBlogGroups((prevGroups) => {
      if (!prevGroups)
        return [group];
      return [...prevGroups, group];
    })
  }

  const handleUpdate = async (props: { id: string; name?: string; enabled?: boolean; }) => {

    const response = await fetch('/api/blog-groups', {
      method: 'PUT',
      body: JSON.stringify(props),
    });

    const result = await response.json();
    if (result.error) {
      console.log(result.error);
    } else {
      // console.log(result);
      setBlogGroups((prevGroups) => {
        return prevGroups?.map((group) => (group.id === result.id ? result : group))!;
      })

      triggerReload();
    }
  }

  const handleDelete = async ({ id }: { id: string }) => {
    setBlogGroups((prevGroups) => {
      if (!prevGroups) return prevGroups;
      return prevGroups.filter(group => group.id !== id);
    });

    const response = await fetch('/api/blog-groups', {
      method: 'DELETE',
      body: JSON.stringify({ id })
    });

    const data = await response.json();
    if (data.error) {
      console.log("Failed to delete", data.error);
    }

    triggerReload();
  }

  const updateOrder = async (updatedBlogs: any[]) => {
    const orderList = updatedBlogs.map((blog, index) => ({
      id: blog.id,
      rank: index,
    }));

    const data = { table: "blog_groups", datasToUpdate: orderList };

    // console.log(orderList);

    const response = await fetch('/api/update-order', {
      method: 'POST',
      body: JSON.stringify(data)
    })

    const result = await response.json();

    if (response.ok) {
      console.log('update orders');
      triggerReload();
    } else {
      console.log(`Error: ${result.error}`)
    }
  }

  // Move treatment in the list
  const moveBlogGroup = useCallback(
    (fromIndex: number, toIndex: number) => {
      const updatedBlogs = Array.from(blogGroups!);
      const [movedBlog] = updatedBlogs.splice(fromIndex, 1);
      updatedBlogs.splice(toIndex, 0, movedBlog);
      setBlogGroups(updatedBlogs);

      // Check if the new order is different from the initial order
      if (!arraysAreEqual(updatedBlogs, initialBlogGroups!)) {
        updateOrder(updatedBlogs);
        setInitialBlogGroups(updatedBlogs);
      }
    }, [blogGroups]);

  if (!blogGroups) {
    return (
      <>
        <SkeletonLoader />
        <SkeletonLoader />
        <SkeletonLoader />
        <SkeletonLoader />
        <SkeletonLoader />
      </>
    )
  }

  return (
    <div>
      <AddNewGroupForm onAdd={handleAdd} />

      <DndProvider backend={HTML5Backend}>
        {blogGroups && blogGroups.map((group, index) => {
          return (
            <div key={index}>
              <DraggableBlogGroup
                index={index}
                key={group.id}
                blogGroup={group}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                moveBlogGroup={moveBlogGroup}
              />
              <ManageBlogs
                itemType={index}
                group_id={group.id}
                fetchedBlogs={group.blogs!}
                username={username}
              />
              {(blogGroups.length > (index + 1)) &&
                <hr className="my-8" />}
            </div>
          )
        })}
        {blogGroups.length === 0 &&
          <div className='pb-10 text-lg text-gray-400 text-center'>There is no blog to show</div>}
      </DndProvider>
    </div>
  )
}

export default ManageBlogGroups;