import { Product } from "@/types/product";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition">
      <CardContent className="p-4 space-y-3">
        <div className="h-40 bg-muted rounded-md" />

        <h2 className="font-semibold text-sm line-clamp-2">{product.title}</h2>

        <p className="text-xs text-gray-500">{product.brand}</p>

        {/* 🔥 KEY CHANGE */}
        <p className="text-sm font-medium">From ₹{product.minPrice}</p>

        {/* optional */}
        <p className="text-xs text-gray-400">
          {product.listings?.length || 0} seller(s)
        </p>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
