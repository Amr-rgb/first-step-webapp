import type { Meta, StoryObj } from "@storybook/nextjs";
import { Inbox, SearchX } from "lucide-react";
import EmptyState from "./EmptyState";

const meta = {
  title: "Common/EmptyState",
  component: EmptyState,
  args: {
    translationKey: "common.emptyState",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof EmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: Inbox,
  },
};

export const WithActions: Story = {
  args: {
    icon: SearchX,
    primaryAction: {
      label: "Add item",
      onClick: () => undefined,
    },
    secondaryAction: {
      label: "Refresh",
      onClick: () => undefined,
    },
  },
};
