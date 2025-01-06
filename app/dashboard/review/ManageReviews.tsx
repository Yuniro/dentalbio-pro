'use client'
import { useCallback, useEffect, useState } from 'react';
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import AddNewReview from './AddNewReview';
import SkeletonLoader from '@/app/components/Loader/Loader';
import { arraysRankingAreEqual } from '@/utils/function_utils';
import { useFormStatus } from 'react-dom';
import { usePreview } from '@/app/components/PreviewContext';
import ReviewCard from './components/ReviewCard';
import AddReviewModal from './components/AddReviewModal';

const ItemType = {
  BLOG: "BLOG"
}

function DraggableReviewCard({
  username,
  review,
  index,
  onUpdate,
  onDelete,
  onEditItem,
  moveReview
}: {
  username: string;
  review: ReviewType,
  index: number;
  onUpdate: any;
  onDelete: any;
  onEditItem: any;
  moveReview: any;
}) {
  const [, ref] = useDrag({
    type: ItemType.BLOG,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType.BLOG,
    hover: (draggedItem: any) => {
      if (draggedItem.index !== index) {
        moveReview(draggedItem.index, index);
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
      <ReviewCard
        username={username}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onEditItem={onEditItem}
        {...review}
      />
    </div>
  );
}


const ManageReviews = ({ username }: { username: string; }) => {
  const [isEditingOpen, setIsEditingOpen] = useState<boolean>(false);
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [reviewTitle, setReviewTitle] = useState<string | null>(null);
  const [reviews, setReviews] = useState<any[] | null>(null);
  const [initialReviews, setInitialReviews] = useState<any[] | null>(null);
  const [editingReview, setEditingReview] = useState<ReviewType>({
    id: "",
    user_id: "",
    reviewer_name: "",
    content: "",
    stars: 5,
    image_url: "",
    platform: "",
    rank: 0,
    enabled: true,
    created_at: "",
  });

  const { triggerReload } = usePreview();

  const status = useFormStatus();

  useEffect(() => {
    const fetchReviews = async () => {
      const response = await fetch('/api/reviews', {
        method: 'GET'
      });
      const data = await response.json();
      setReviews(data.data);
      setInitialReviews(data.data);
    };

    fetchReviews();
  }, []);

  const handleAdd = async (review: ReviewType) => {
    setReviews((prevReviews) => {
      if (!prevReviews) return [review];
      return [...prevReviews, review];
    })

    triggerReload();
  }

  const handleEdit = async (review: ReviewType, image_file: File | null) => {
    const image_url = image_file ? await uploadImage(image_file) : review.image_url;

    const response = await fetch('/api/reviews', {
      method: 'PUT',
      body: JSON.stringify({ ...review, image_url }),
    });

    const result = await response.json();
    if (result.error) {
      console.log(result.error);
    } else {
      // console.log(result);
      setReviews((prevReviews) => {
        return prevReviews?.map((review) => (review.id === result.id ? result : review))!;
      })
    }
    setIsEditingOpen(false);
    triggerReload();
  }

  const handleDelete = async (id: string) => {
    setReviews((prevReviews) => {
      if (!prevReviews) return prevReviews;
      return prevReviews.filter(review => review.id !== id);
    });

    const response = await fetch('/api/reviews', {
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
    await setEditingReview(reviews?.at(reviews?.findIndex((review) => review.id === id)));
    setIsEditingOpen(true);
  }

  const uploadImage = async (image: File) => {
    const formData = new FormData();
    formData.append('bucket_name', 'review-images');
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

    triggerReload();
  }

  const updateOrder = async (updatedReviews: any[]) => {
    const orderList = updatedReviews.map((review, index) => ({
      id: review.id,
      rank: index,
    }));

    const data = { table: "reviews", datasToUpdate: orderList };

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
  const moveReview = useCallback(
    (fromIndex: number, toIndex: number) => {
      const updatedReviews = Array.from(reviews!);
      const [movedReview] = updatedReviews.splice(fromIndex, 1);
      updatedReviews.splice(toIndex, 0, movedReview);
      setReviews(updatedReviews);

      updateOrder(updatedReviews);
      setInitialReviews(updatedReviews);
    }, [reviews]);

  return (
    <div>
      <h4 className='mb-6'>My Reviews</h4>

      <DndProvider backend={HTML5Backend}>
        {reviews ?
          reviews.length > 0 ?
            reviews.map((review, index) => (
              <DraggableReviewCard
                key={review.id}
                index={index}
                review={review}
                username={username}
                onUpdate={handleEdit}
                onDelete={handleDelete}
                onEditItem={handleEditItem}
                moveReview={moveReview}
              />
            )) :
            <div className='py-10 text-lg text-gray-400 text-center'>There is no review to show</div> :
          <SkeletonLoader />}
      </DndProvider>

      <div className="flex justify-end mt-6">
        <AddNewReview onAdd={handleAdd} username={username} />
      </div>

      <AddReviewModal
        username={username}
        isOpen={isEditingOpen}
        onClose={() => setIsEditingOpen(false)}
        onEdit={handleEdit}
        {...editingReview}
      />
    </div>
  );
};

export default ManageReviews;
