import ProductItem from "./Basic/ProductItem";

type IndividualProductListProps = {
  products: IndividualProductType[];
};

export default function IndividualProductList({ products }: IndividualProductListProps) {
  return (
    <>
      {products.map((product) => <ProductItem key={product.id} product={product} />)}
    </>
  );
}
