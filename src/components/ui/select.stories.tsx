import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

const meta = {
  title: "UI/Select",
  component: Select,
  tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[280px]">
      <Select defaultValue="riyadh">
        <SelectTrigger>
          <SelectValue placeholder="Select city" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="riyadh">Riyadh</SelectItem>
          <SelectItem value="jeddah">Jeddah</SelectItem>
          <SelectItem value="dammam">Dammam</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Placeholder: Story = {
  render: () => (
    <div className="w-[280px]">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select city" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="riyadh">Riyadh</SelectItem>
          <SelectItem value="jeddah">Jeddah</SelectItem>
          <SelectItem value="dammam">Dammam</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};
