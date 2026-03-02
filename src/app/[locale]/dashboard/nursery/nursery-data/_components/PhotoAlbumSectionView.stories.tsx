import type { Meta, StoryObj } from "@storybook/nextjs";
import { PhotoAlbumSectionView } from "./PhotoAlbumSectionView";

const meta = {
  title: "Dashboard/Nursery/PhotoAlbumSectionView",
  component: PhotoAlbumSectionView,
  args: {
    items: [
      {
        image:
          "https://development.firststep-app.com/storage/images/activities/86h2cEEL8KbCzk1MXAyM6VCIvsbpIrjxmh3OLqhQ.jpg",
      },
      {
        image:
          "https://development.firststep-app.com/storage/images/activities/Q4BElPv5DTczkFNJ25aCXZfkpVJdyjbKi5i4QwMA.png",
      },
    ],
    uploadTitle: "Upload Photo",
    uploadHint: "Drag and drop your photos here, or upload from your device",
    formatsNote: "Supported formats: JPG, PNG (Max size: 10MB)",
    uploadedTitle: "Uploaded Photos (2)",
    onFilesSelected: () => undefined,
    onRemove: () => undefined,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PhotoAlbumSectionView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    items: [],
    uploadedTitle: "Uploaded Photos (0)",
  },
};
