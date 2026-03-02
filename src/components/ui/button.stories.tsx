import type { Meta, StoryObj } from "@storybook/nextjs";
import { Button } from "./button";

const meta = {
  title: "UI/Button",
  component: Button,
  args: {
    children: "Save changes",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Secondary action",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Delete item",
  },
};

export const Long: Story = {
  args: {
    size: "long",
    children: "Continue to next step",
  },
};
