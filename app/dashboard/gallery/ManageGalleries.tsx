'use client'
import { useCallback, useEffect, useState } from 'react';
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import AddNewGallery from './AddNewGallery';
import SkeletonLoader from '@/app/components/Loader/Loader';
import { arraysRankingAreEqual } from '@/utils/function_utils';
import GalleryCard from './components/GalleryCard';
import EditGalleryModal from './components/EditGalleryModal';
import { usePreview } from '@/app/components/PreviewContext';

const ItemType = {
  BLOG: "BLOG"
}

function DraggableGalleryCard({
  gallery,
  index,
  onUpdate,
  onDelete,
  onEditItem,
  moveGallery
}: {
  gallery: GalleryType,
  index: number;
  onUpdate: any;
  onDelete: any;
  onEditItem: any;
  moveGallery: any;
}) {
  const [, ref] = useDrag({
    type: ItemType.BLOG,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType.BLOG,
    hover: (draggedItem: any) => {
      if (draggedItem.index !== index) {
        moveGallery(draggedItem.index, index);
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
      <GalleryCard
        onUpdate={onUpdate}
        onDelete={onDelete}
        onEditItem={onEditItem}
        {...gallery}
      />
    </div>
  );
}


const ManageGalleries = () => {
  const [isEditingOpen, setIsEditingOpen] = useState<boolean>(false);
  const [galleries, setGalleries] = useState<any[] | null>(null);
  const [initialGalleries, setInitialGalleries] = useState<any[] | null>(null);
  const [editingGallery, setEditingGallery] = useState<GalleryType>({
    id: "",
    user_id: "",
    title: "",
    before_image_url: "",
    after_image_url: "",
    rank: 0,
    created_at: "",
  });

  const { triggerReload } = usePreview();

  useEffect(() => {
    const fetchGalleries = async () => {
      const response = await fetch('/api/galleries', {
        method: 'GET'
      });
      const data = await response.json();
      setGalleries(data.data);
      setInitialGalleries(data.data);
    };

    fetchGalleries();
  }, []);

  const handleAdd = async (gallery: GalleryType) => {
    setGalleries((prevGalleries) => {
      if (!prevGalleries) return [gallery];
      return [...prevGalleries, gallery];
    })

    triggerReload();
  }

  const handleEdit = async (gallery: GalleryType, before_image_file: File | null, after_image_file: File | null) => {
    if (before_image_file) {
      const before_image_url = await uploadImage(before_image_file);
      gallery = { ...gallery, before_image_url };
    }
    if (after_image_file) {
      const after_image_url = await uploadImage(after_image_file);
      gallery = { ...gallery, after_image_url };
    }

    const response = await fetch('/api/galleries', {
      method: 'PUT',
      body: JSON.stringify({ ...gallery }),
    });

    const result = await response.json();
    if (result.error) {
      console.log(result.error);
    } else {
      // console.log(result);
      setGalleries((prevGalleries) => {
        return prevGalleries?.map((gallery) => (gallery.id === result.id ? result : gallery))!;
      })

      setIsEditingOpen(false);

      triggerReload();
    }
  }

  const handleDelete = async (id: string) => {
    setGalleries((prevGalleries) => {
      if (!prevGalleries) return prevGalleries;
      return prevGalleries.filter(gallery => gallery.id !== id);
    });

    const response = await fetch('/api/galleries', {
      method: 'DELETE',
      body: JSON.stringify({ id })
    });

    const data = await response.json();
    if (data.error) {
      console.log("Failed to delete", data.error);
    }

    triggerReload();
  }

  const handleEditItem = async (id: string) => {
    await setEditingGallery(galleries?.at(galleries?.findIndex((gallery) => gallery.id === id)));
    setIsEditingOpen(true);
  }

  const uploadImage = async (image: File) => {
    const formData = new FormData();
    formData.append('bucket_name', 'gallery-images');
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

  const updateOrder = async (updatedGalleries: any[]) => {
    const orderList = updatedGalleries.map((gallery, index) => ({
      id: gallery.id,
      rank: index,
    }));

    const data = { table: "galleries", datasToUpdate: orderList };

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
  const moveGallery = useCallback(
    (fromIndex: number, toIndex: number) => {
      const updatedGalleries = Array.from(galleries!);
      const [movedGallery] = updatedGalleries.splice(fromIndex, 1);
      updatedGalleries.splice(toIndex, 0, movedGallery);
      setGalleries(updatedGalleries);

      // Check if the new order is different from the initial order
      if (!arraysRankingAreEqual(updatedGalleries, initialGalleries!)) {
        updateOrder(updatedGalleries);
        setInitialGalleries(updatedGalleries);
      }
    }, [galleries]);

  return (
    <div>
      <h4 className='mb-6'>My Galleries</h4>

      <DndProvider backend={HTML5Backend}>
        {galleries ?
          galleries.length > 0 ?
            galleries.map((gallery, index) => (
              <DraggableGalleryCard
                key={gallery.id}
                index={index}
                gallery={gallery}
                onUpdate={handleEdit}
                onDelete={handleDelete}
                onEditItem={handleEditItem}
                moveGallery={moveGallery}
              />
            )) :
            <div className='py-10 text-lg text-gray-400 text-center'>There is no gallery to show</div> :
          <SkeletonLoader />}
      </DndProvider>

      <div className="flex justify-end mt-6">
        <AddNewGallery onAdd={handleAdd} />
      </div>

      <EditGalleryModal
        isOpen={isEditingOpen}
        onClose={() => setIsEditingOpen(false)}
        onSubmit={handleEdit}
        {...editingGallery}
      />
    </div>
  );
};

export default ManageGalleries;
