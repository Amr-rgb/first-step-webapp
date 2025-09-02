import { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";

interface PhoneInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  locale?: string;
  className?: string;
  readOnly?: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  locale = "en",
  className,
  readOnly = false,
  ...rest
}) => {
  return (
    <div className="relative flex items-center">
      <span className="absolute left-3 text-gray-500">+966</span>
      <Input
        dir={locale === "ar" ? "rtl" : "ltr"}
        type="tel"
        className={`pr-0 pl-14 ${className || ""}`}
        onChange={onChange}
        value={value}
        disabled={readOnly}
        {...rest}
      />
    </div>
  );
};

export default PhoneInput;
