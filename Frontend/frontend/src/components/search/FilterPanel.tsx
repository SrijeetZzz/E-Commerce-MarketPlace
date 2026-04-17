import { Input } from "@/components/ui/input";

interface Props {
  minPrice: string;
  maxPrice: string;
  setMinPrice: (v: string) => void;
  setMaxPrice: (v: string) => void;
}

const FilterPanel = ({
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
}: Props) => {
  return (
    <div className="flex gap-4">
      <Input
        placeholder="Min Price"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
      />

      <Input
        placeholder="Max Price"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
      />
    </div>
  );
};

export default FilterPanel;