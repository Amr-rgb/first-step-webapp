import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  EnrollmentNotificationToastView,
  type EnrollmentData,
} from "./EnrollmentNotificationToast";

const enrollment: EnrollmentData = {
  id: 42,
  user_id: 7,
  center_id: 3,
  center_branch_id: 9,
  branch_price_id: 15,
  reservation_number: "RSV-2026-0042",
  status: "pending",
  enrollment_date: "2026-03-20T09:30:00.000Z",
  enrollment_type: "monthly",
  parent_phone: "501234567",
  price_amount: 1800,
};

const meta = {
  title: "Notifications/EnrollmentNotificationToast",
  component: EnrollmentNotificationToastView,
  args: {
    title: "New enrollment request",
    description: "A parent submitted a new booking request that needs review.",
    enrollment,
    onView: () => undefined,
    onDismiss: () => undefined,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof EnrollmentNotificationToastView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
