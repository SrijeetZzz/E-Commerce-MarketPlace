import ProductCard from "../product/ProductCard";

const ProductGrid = ({ products }: any) => {
  if (!products.length) {
    return <p>No products found</p>;
  }

  return (
    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((item: any) => (
        <ProductCard key={item._id} product={item} />
      ))}
    </div>
  );
};

export default ProductGrid;