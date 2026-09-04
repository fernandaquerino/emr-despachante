import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Base/Checkbox",
  component: Checkbox,
  args: { label: "Notificar cliente por e-mail" },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  render: (args) => {
    function Controlled() {
      const [checked, setChecked] = useState<boolean>(false);
      return <Checkbox {...args} checked={checked} onCheckedChange={(v) => setChecked(!!v)} />;
    }
    return <Controlled />;
  },
};

export const Checked: Story = {
  args: { checked: true },
};

export const Indeterminate: Story = {
  args: { checked: "indeterminate" },
};

export const Disabled: Story = {
  args: { checked: false, disabled: true },
};
