import type { Meta, StoryObj } from "@storybook/nextjs";
import { CitySelectorView } from "./CitySelector";

const cities = [
  { id: "1", label: "Riyadh" },
  { id: "2", label: "Jeddah" },
  { id: "3", label: "Dammam" },
];

const meta = {
  title: "Forms/CitySelector",
  component: CitySelectorView,
  args: {
    value: undefined,
    onChange: () => undefined,
    placeholder: "Select city",
    cities,
    searchPlaceholder: "Search city...",
    loadingText: "Loading...",
    errorText: "Error loading cities",
    emptyText: "No results found.",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CitySelectorView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
  args: {
    value: "2",
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    cities: [],
  },
};

export const Error: Story = {
  args: {
    hasError: true,
    cities: [],
  },
};
