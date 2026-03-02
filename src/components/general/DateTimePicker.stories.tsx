import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import DateTimePicker from "./DateTimePicker";

const meta = {
  title: "General/DateTimePicker",
  component: DateTimePicker,
  args: {
    dateValue: undefined,
    timeValue: "",
    onDateChange: () => undefined,
    onTimeChange: () => undefined,
    locale: "en",
    showTime: true,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DateTimePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  render: (args) => {
    const [dateValue, setDateValue] = useState<Date | undefined>(args.dateValue);
    const [timeValue, setTimeValue] = useState(args.timeValue);

    return (
      <div className="w-[320px]">
        <DateTimePicker
          {...args}
          dateValue={dateValue}
          timeValue={timeValue}
          onDateChange={setDateValue}
          onTimeChange={setTimeValue}
        />
      </div>
    );
  },
};

export const WithDateAndTime: Story = {
  render: (args) => {
    const [dateValue, setDateValue] = useState<Date | undefined>(
      new Date("2026-03-20T09:30:00"),
    );
    const [timeValue, setTimeValue] = useState("09:30");

    return (
      <div className="w-[320px]">
        <DateTimePicker
          {...args}
          dateValue={dateValue}
          timeValue={timeValue}
          onDateChange={setDateValue}
          onTimeChange={setTimeValue}
        />
      </div>
    );
  },
};

export const ArabicLocale: Story = {
  render: (args) => {
    const [dateValue, setDateValue] = useState<Date | undefined>(
      new Date("2026-03-20T18:15:00"),
    );
    const [timeValue, setTimeValue] = useState("18:15");

    return (
      <div className="w-[320px]">
        <DateTimePicker
          {...args}
          locale="ar"
          dateValue={dateValue}
          timeValue={timeValue}
          onDateChange={setDateValue}
          onTimeChange={setTimeValue}
        />
      </div>
    );
  },
};
