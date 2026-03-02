import type { Meta, StoryObj } from "@storybook/nextjs";
import { ReservationStatusBadge } from "./ReservationStatusBadge";

const meta = {
  title: "Shared/ReservationStatusBadge",
  component: ReservationStatusBadge,
  args: {
    status: "confirmed",
  },
  argTypes: {
    status: {
      control: "select",
      options: [
        "confirmed",
        "waitingForPayment",
        "waitingForConfirmation",
        "rejected",
        "cancelled",
        "paid",
        "existing",
        "expired",
        "pending",
        "accepted",
      ],
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ReservationStatusBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {[
        "confirmed",
        "waitingForPayment",
        "waitingForConfirmation",
        "rejected",
        "cancelled",
        "paid",
        "existing",
        "expired",
        "pending",
        "accepted",
      ].map((status) => (
        <ReservationStatusBadge key={status} status={status} />
      ))}
    </div>
  ),
};
