import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";

const meta = {
  title: "UI/Accordion",
  component: Accordion,
  args: {
    type: "single",
    collapsible: true,
    defaultValue: "item-1",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[420px]">
      <Accordion {...args}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Basic Information</AccordionTrigger>
          <AccordionContent>
            Edit your logo, title, and short description.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Services</AccordionTrigger>
          <AccordionContent>
            Add, price, and organize your public service list.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};
