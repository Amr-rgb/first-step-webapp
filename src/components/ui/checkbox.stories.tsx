import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import { Checkbox } from "./checkbox";
import { Label } from "./label";

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms-unchecked" />
      <Label htmlFor="terms-unchecked">Accept terms and conditions</Label>
    </div>
  ),
};

export const Checked: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms-checked" checked />
      <Label htmlFor="terms-checked">Accept terms and conditions</Label>
    </div>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);

    return (
      <div className="flex items-center gap-2">
        <Checkbox
          id="terms-interactive"
          checked={checked}
          onCheckedChange={(value) => setChecked(value === true)}
        />
        <Label htmlFor="terms-interactive">
          {checked ? "Accepted" : "Accept terms and conditions"}
        </Label>
      </div>
    );
  },
};
