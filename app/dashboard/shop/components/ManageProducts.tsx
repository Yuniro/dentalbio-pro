'use client'
import { useCallback, useEffect, useState } from 'react';
import { useDrag, useDrop } from "react-dnd";
import SkeletonLoader from '@/app/components/Loader/Loader';
import { usePreview } from '@/app/components/PreviewContext';
import AddNewProduct from './AddNewProduct';
import ProductCard from './ProductCard';
import AddProductModal from './AddProductModal';

function DraggableProductCard({
  product,
  itemType,
  index,
  onUpdate,
  onDelete,
  onEditItem,
  moveProduct
}: {
  product: ProductType,
  itemType: number;
  index: number;
  onUpdate: any;
  onDelete: any;
  onEditItem: any;
  moveProduct: any;
}) {
  const [, ref] = useDrag({
    type: "ItemType.BLOG" + itemType,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: "ItemType.BLOG" + itemType,
    hover: (draggedItem: any) => {
      if (draggedItem.index !== index) {
        moveProduct(draggedItem.index, index);
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
      <ProductCard
        onUpdate={onUpdate}
        onDelete={onDelete}
        onEditItem={onEditItem}
        {...product}
      />
    </div>
  );
}


const ManageProducts = ({
  itemType,
  group_id,
  fetchedProducts
}: {
  itemType: number;
  group_id: string;
  fetchedProducts: ProductType[]
}) => {
  const [isEditingOpen, setIsEditingOpen] = useState<boolean>(false);
  const [products, setProducts] = useState<any[] | null>(null);
  const [initialProducts, setInitialProducts] = useState<any[] | null>(null);
  const [editingProduct, setEditingProduct] = useState<ProductType>({
    id: "",
    group_id,
    name: "",
    link: "",
    platform: "",
    price: "",
    currency: "GBP(£)",
    enabled: true,
    rank: 0,
  });

  const { triggerReload } = usePreview();

  useEffect(() => {
    setProducts(fetchedProducts);
    setInitialProducts(fetchedProducts);

  }, [fetchedProducts]);

  const handleAdd = async (product: ProductType) => {
    setProducts((prevProducts) => {
      if (!prevProducts) return [product];
      return [...prevProducts, product];
    })

    triggerReload();
  }

  const uploadImage = async (image: File) => {
    const formData = new FormData();
    formData.append('bucket_name', 'product-images');
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

  const handleEdit = async (product: ProductType, image: File | null) => {
    const image_url = image ? await uploadImage(image) : "";

    const response = await fetch('/api/products', {
      method: 'PUT',
      body: JSON.stringify({ ...product, image_url }),
    });

    const result = await response.json();
    if (result.error) {
      console.log(result.error);
    } else {
      // console.log(result);
      setProducts((prevProducts) => {
        return prevProducts?.map((product) => (product.id === result.id ? result : product))!;
      })
    }
    setIsEditingOpen(false);
    triggerReload();
  }

  const handleDelete = async (id: string) => {
    setProducts((prevProducts) => {
      if (!prevProducts) return prevProducts;
      return prevProducts.filter(product => product.id !== id);
    });

    const response = await fetch('/api/products', {
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
    await setEditingProduct(products?.at(products?.findIndex((product) => product.id === id)));
    setIsEditingOpen(true);
  }

  const updateOrder = async (updatedProducts: any[]) => {
    const orderList = updatedProducts.map((product, index) => ({
      id: product.id,
      rank: index,
    }));

    const data = { table: "products", datasToUpdate: orderList };

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
  const moveProduct = useCallback(
    (fromIndex: number, toIndex: number) => {
      const updatedProducts = Array.from(products!);
      const [movedProduct] = updatedProducts.splice(fromIndex, 1);
      updatedProducts.splice(toIndex, 0, movedProduct);
      setProducts(updatedProducts);

      updateOrder(updatedProducts);
      setInitialProducts(updatedProducts);
    }, [products]);

  return (
    <div className='mb-4'>
      {/* <DndProvider backend={HTML5Backend}> */}
      {products ?
        products.length > 0 ?
          products.map((product, index) => (
            <DraggableProductCard
              key={product.id}
              index={index}
              product={product}
              itemType={itemType}
              onUpdate={handleEdit}
              onDelete={handleDelete}
              onEditItem={handleEditItem}
              moveProduct={moveProduct}
            />
          )) :
          <div className='pb-10 text-lg text-gray-400 text-center'>There is no product to show</div> :
        <SkeletonLoader />}
      {/* </DndProvider> */}

      <div className="flex justify-end mt-6">
        <AddNewProduct group_id={group_id} onAdd={handleAdd} />
      </div>

      <AddProductModal
        group_id={group_id}
        isOpen={isEditingOpen}
        onClose={() => setIsEditingOpen(false)}
        onSubmit={handleEdit}
        {...editingProduct}
      />
    </div>
  );
};

export default ManageProducts;
