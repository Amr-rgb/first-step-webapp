import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  StatusNumbersView,
  type StatusNumbersData,
} from "./StatusNumbers";

const sampleNumbers: StatusNumbersData = {
  rejected: {
    title: "Rejected",
    value: 8,
    color: "#F6D6D5",
  },
  waitingForConfirmation: {
    title: "Waiting for confirmation",
    value: 12,
    color: "#FFECC5",
  },
  waitingForPayment: {
    title: "Waiting for payment",
    value: 5,
    color: "#F87070",
  },
  confirmed: {
    title: "Confirmed",
    value: 27,
    color: "#B1CDFB",
  },
};

const meta = {
  title: "Shared/StatusNumbers",
  component: StatusNumbersView,
  args: {
    numbers: sampleNumbers,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof StatusNumbersView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    numbers: {
      rejected: { title: "Rejected", value: 0, color: "#F6D6D5" },
      waitingForConfirmation: {
        title: "Waiting for confirmation",
        value: 0,
        color: "#FFECC5",
      },
      waitingForPayment: {
        title: "Waiting for payment",
        value: 0,
        color: "#F87070",
      },
      confirmed: { title: "Confirmed", value: 0, color: "#B1CDFB" },
    },
  },
};
