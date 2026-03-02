import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import DatePicker from "./DatePicker";

const meta = {
  title: "General/DatePicker",
  component: DatePicker,
  args: {
    value: undefined,
    onChange: () => undefined,
    standalone: true,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DatePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  render: (args) => {
    const [value, setValue] = useState<Date | undefined>(args.value);

    return (
      <div className="w-[280px]">
        <DatePicker {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};

export const Selected: Story = {
  render: (args) => {
    const [value, setValue] = useState<Date | undefined>(
      new Date("2026-03-15"),
    );

    return (
      <div className="w-[280px]">
        <DatePicker {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};

export const NoFutureDates: Story = {
  render: (args) => {
    const [value, setValue] = useState<Date | undefined>(undefined);

    return (
      <div className="w-[280px]">
        <DatePicker
          {...args}
          value={value}
          onChange={setValue}
          allowFuture={false}
        />
      </div>
    );
  },
};
