import type { Meta, StoryObj } from "@storybook/nextjs";
import { NotificationToast } from "./NotificationToast";

const meta = {
  title: "Notifications/NotificationToast",
  component: NotificationToast,
  args: {
    title: "New notification",
    description: "A new enrollment requires your review.",
    type: "admin",
    onView: () => undefined,
    onDismiss: () => undefined,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof NotificationToast>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Admin: Story = {};

export const DailyReport: Story = {
  args: {
    title: "Daily report available",
    description: "A new daily report has been posted for a child in your branch.",
    type: "daily_report",
  },
};

export const Reminder: Story = {
  args: {
    title: "Reminder",
    description: "Tomorrow's parent meeting starts at 9:00 AM.",
    type: "reminder",
  },
};

export const Enrollment: Story = {
  args: {
    title: "Enrollment update",
    description: "A new booking was submitted and is waiting for confirmation.",
    type: "enrollment",
  },
};
