import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import PhoneInput from "./PhoneInput";

const meta = {
  title: "Forms/PhoneInput",
  component: PhoneInput,
  args: {
    value: "",
    locale: "en",
    placeholder: "5XXXXXXXX",
    onChange: () => undefined,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PhoneInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const Filled: Story = {
  args: {
    value: "501234567",
  },
};

export const ReadOnly: Story = {
  args: {
    value: "501234567",
    readOnly: true,
  },
};

export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value);

    return (
      <div className="w-[280px]">
        <PhoneInput
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value.replace(/\D/g, ""))}
        />
      </div>
    );
  },
};
