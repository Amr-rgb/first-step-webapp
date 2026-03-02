import type { Meta, StoryObj } from "@storybook/nextjs";
import { SuccessStoriesSectionView } from "./SuccessStoriesSectionView";

const meta = {
  title: "Dashboard/Center/SuccessStoriesSectionView",
  component: SuccessStoriesSectionView,
  args: {
    title: "Success Stories",
    description: "Share success and improvement stories for children at your center",
    addLabel: "Add Success Story",
    storyImageLabel: "Case Image",
    imageHint: "Upload a photo illustrating the activity or case",
    caseTypeLabel: "Case Type",
    caseTypePlaceholder: "e.g., Speech Delay / Autism",
    summaryLabel: "Improvement Summary",
    summaryPlaceholder: "Talk about the level of improvement the child has reached...",
    activities: [
      {
        id: 1,
        image:
          "https://development.firststep-app.com/storage/images/activities/86h2cEEL8KbCzk1MXAyM6VCIvsbpIrjxmh3OLqhQ.jpg",
        kind: "Speech Delay",
        summary: "The child improved verbal repetition and short sentence formation.",
      },
    ],
    onAdd: () => undefined,
    onRemove: () => undefined,
    onChange: () => undefined,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SuccessStoriesSectionView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    activities: [],
  },
};
