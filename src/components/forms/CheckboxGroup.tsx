import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";

interface CheckboxGroupProbs<T extends FieldValues> {
  items: { id: string; label: string }[];
  control: Control<T>;
  name: FieldPath<T>;
  className?: string;
  readOnly?: boolean;
}

const CheckboxGroup = <T extends FieldValues>({
  items,
  control,
  name,
  className,
  readOnly = false,
}: CheckboxGroupProbs<T>) => {
  return (
    <div
      className={cn(
        "flex flex-wrap justify-center gap-x-4 md:gap-x-10 gap-y-4",
        className
      )}
    >
      {items.map((item) => (
        <FormField
          key={item.id}
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem className="flex items-center space-x-1 space-x-reverse">
              <FormControl>
                <Checkbox
                  checked={field.value?.includes(item.id)}
                  onCheckedChange={(checked) => {
                    const updatedValue = checked
                      ? [...(field.value || []), item.id]
                      : (field.value || []).filter(
                          (value: string) => value !== item.id
                        );
                    field.onChange(updatedValue);
                  }}
                  disabled={readOnly}
                />
              </FormControl>
              <FormLabel
                className={`${
                  readOnly ? "text-foreground" : ""
                } cursor-pointer min-w-[max-content]`}
              >
                {item.label}
              </FormLabel>
            </FormItem>
          )}
        />
      ))}
    </div>
  );
};

export default CheckboxGroup;
