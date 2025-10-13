import { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";

interface PhoneInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  locale?: string;
  className?: string;
  readOnly?: boolean;
  placeholder?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  locale = "en",
  className,
  readOnly = false,
  placeholder,
  ...rest
}) => {
  return (
    <Input
      dir={locale === "ar" ? "rtl" : "ltr"}
      type="tel"
      className={className || ""}
      onChange={onChange}
      value={value}
      disabled={readOnly}
      placeholder={placeholder}
      {...rest}
    />
  );
};

export default PhoneInput;
