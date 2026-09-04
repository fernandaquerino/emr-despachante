import type { Meta, StoryObj } from "@storybook/react-vite";
import { VehicleSummary } from "./VehicleSummary";

const vehicle = {
  plate: "ABC1D23",
  model: "Chevrolet Onix",
  year: 2022,
  overallStatus: "REGULAR" as const,
};

const meta: Meta<typeof VehicleSummary> = {
  title: "Domain/VehicleSummary",
  component: VehicleSummary,
  args: {
    vehicle,
    lastUpdatedAt: new Date(),
    onOpen: () => console.log("open"),
  },
};

export default meta;
type Story = StoryObj<typeof VehicleSummary>;

export const Default: Story = {};

export const WithFinesAndLicensing: Story = {
  args: {
    fines: { openCount: 2 },
    licensing: { status: "ELIGIBLE" },
  },
};

export const LicensingBlocked: Story = {
  args: {
    licensing: { status: "BLOCKED", reason: "Existem 2 multas em aberto." },
  },
};

export const StaleData: Story = {
  args: {
    lastUpdatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    onRefresh: async () => new Promise((resolve) => setTimeout(resolve, 800)),
  },
};

export const IrregularVehicle: Story = {
  args: {
    vehicle: { ...vehicle, overallStatus: "IRREGULAR" },
    fines: { openCount: 4 },
  },
};
