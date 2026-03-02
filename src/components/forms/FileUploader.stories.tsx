import type { Meta, StoryObj } from "@storybook/nextjs";
import { FileUploader } from "./FileUploader";

const meta = {
  title: "Forms/FileUploader",
  component: FileUploader,
  args: {
    value: null,
    onChange: () => undefined,
    accept: ".pdf,.jpg,.png",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof FileUploader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const ExistingFile: Story = {
  args: {
    value: "https://development.firststep-app.com/storage/licenses/sample.pdf",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
