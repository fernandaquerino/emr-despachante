import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusBadge } from "./StatusBadge";
import type {
  CaseStatus,
  FineStatus,
  GovernmentSubmissionStatus,
  LicensingStatus,
  OperatorStatus,
  PaymentStatus,
  ServiceStatus,
  VehicleOverallStatus,
} from "../../../lib/status-map";

const meta: Meta<typeof StatusBadge> = {
  title: "Domain/StatusBadge",
  component: StatusBadge,
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

const vehicleStatuses: VehicleOverallStatus[] = [
  "REGULAR",
  "ATTENTION",
  "IRREGULAR",
  "PROCESSING",
  "MANUAL_REVIEW",
  "UNKNOWN",
];
const paymentStatuses: PaymentStatus[] = [
  "PENDING",
  "PAID",
  "FAILED",
  "CANCELLED",
  "REFUND_PENDING",
  "REFUNDED",
];
const fineStatuses: FineStatus[] = [
  "OPEN",
  "PAYMENT_PENDING",
  "PAID",
  "CLEARANCE_PROCESSING",
  "CLEARED",
  "CANCELLED",
];
const licensingStatuses: LicensingStatus[] = [
  "ELIGIBLE",
  "BLOCKED",
  "PAYMENT_PENDING",
  "PAID",
  "PROCESSING",
  "DOCUMENT_READY",
  "FAILED",
];
const caseStatuses: CaseStatus[] = [
  "OPEN",
  "IN_PROGRESS",
  "WAITING_CLIENT",
  "WAITING_EXTERNAL",
  "RESOLVED",
  "CANCELLED",
];
const governmentSubmissionStatuses: GovernmentSubmissionStatus[] = [
  "NOT_REQUESTED",
  "QUEUED",
  "PROCESSING",
  "CONFIRMED",
  "FAILED",
  "MANUAL_REVIEW",
];
const operatorStatuses: OperatorStatus[] = ["INVITED", "ACTIVE", "SUSPENDED", "DISABLED"];
const serviceStatuses: ServiceStatus[] = ["ACTIVE", "INACTIVE"];

export const Vehicle: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {vehicleStatuses.map((status) => (
        <StatusBadge key={status} domain="vehicle" status={status} />
      ))}
    </div>
  ),
};

export const Payment: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {paymentStatuses.map((status) => (
        <StatusBadge key={status} domain="payment" status={status} />
      ))}
    </div>
  ),
};

export const Fine: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {fineStatuses.map((status) => (
        <StatusBadge key={status} domain="fine" status={status} />
      ))}
    </div>
  ),
};

export const Licensing: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {licensingStatuses.map((status) => (
        <StatusBadge key={status} domain="licensing" status={status} />
      ))}
    </div>
  ),
};

export const Case: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {caseStatuses.map((status) => (
        <StatusBadge key={status} domain="case" status={status} />
      ))}
    </div>
  ),
};

export const GovernmentSubmission: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {governmentSubmissionStatuses.map((status) => (
        <StatusBadge key={status} domain="governmentSubmission" status={status} />
      ))}
    </div>
  ),
};

export const Operator: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {operatorStatuses.map((status) => (
        <StatusBadge key={status} domain="operator" status={status} />
      ))}
    </div>
  ),
};

export const Service: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {serviceStatuses.map((status) => (
        <StatusBadge key={status} domain="service" status={status} />
      ))}
    </div>
  ),
};
