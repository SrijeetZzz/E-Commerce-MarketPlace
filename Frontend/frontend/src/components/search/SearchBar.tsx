import { Input } from "@/components/ui/input";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

const SearchBar = ({ value, onChange }: Props) => {
  return (
    <Input
      placeholder="Search products..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default SearchBar;