import { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";

interface PhoneInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  locale?: string;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  locale = "en",
  readOnly = false,
  placeholder,
  className,
  ...rest
}) => {
  const direction = "ltr";
  return (
    <div className="relative flex items-center">
      <span className="absolute left-3 text-gray-500 text-sm select-none">
        +966
      </span>
      <Input
        dir={direction}
        type="tel"
        className={`${className ? `${className} ` : ""}pl-14`}
        onChange={onChange}
        value={value}
        disabled={readOnly}
        placeholder={placeholder}
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={9}
        {...rest}
      />
    </div>
  );
};

export default PhoneInput;
