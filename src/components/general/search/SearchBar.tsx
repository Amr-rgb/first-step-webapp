import { Search } from "lucide-react";
import { Input } from "../../ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div className="h-15 flex rtl:flex-row-reverse items-center w-full rounded-full border px-4 py-2 bg-white shadow-sm">
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent focus:outline-none text-right pr-2 border-none shadow-none placeholder:text-mid-gray"
        placeholder={placeholder}
      />
      <Search className="text-gray-400 size-6 ml-2" />
    </div>
  );
};

export default SearchBar;
