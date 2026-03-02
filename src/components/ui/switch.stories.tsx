import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import { Switch } from "./switch";
import { Label } from "./label";

const meta = {
  title: "UI/Switch",
  component: Switch,
  tags: ["autodocs"],
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Off: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Switch id="notifications-off" />
      <Label htmlFor="notifications-off">Notification toasts</Label>
    </div>
  ),
};

export const On: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Switch id="notifications-on" checked />
      <Label htmlFor="notifications-on">Notification toasts</Label>
    </div>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [enabled, setEnabled] = useState(true);

    return (
      <div className="flex items-center gap-3">
        <Switch
          id="notifications-interactive"
          checked={enabled}
          onCheckedChange={setEnabled}
        />
        <Label htmlFor="notifications-interactive">
          {enabled ? "Enabled" : "Disabled"}
        </Label>
      </div>
    );
  },
};
