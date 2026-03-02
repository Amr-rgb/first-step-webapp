import type { Meta, StoryObj } from "@storybook/nextjs";
import { Button } from "./button";
import { Toaster } from "./sonner";
import {
  toastError,
  toastInfo,
  toastSuccess,
  toastWarning,
} from "@/lib/toast";

const meta = {
  title: "UI/Toasts",
  component: Toaster,
  tags: ["autodocs"],
} satisfies Meta<typeof Toaster>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3">
      <Toaster />
      <Button
        onClick={() =>
          toastSuccess("Saved successfully", "Your changes were updated.")
        }
      >
        Success Toast
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toastInfo("Heads up", "This action will affect all branches.")
        }
      >
        Info Toast
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toastWarning("Check this field", "A required value is still missing.")
        }
      >
        Warning Toast
      </Button>
      <Button
        variant="destructive"
        onClick={() =>
          toastError("Request failed", "The server could not process the request.")
        }
      >
        Error Toast
      </Button>
    </div>
  ),
};
