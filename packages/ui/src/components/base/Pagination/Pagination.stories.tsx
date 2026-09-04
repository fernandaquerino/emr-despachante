import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pagination } from "./Pagination";

const meta: Meta<typeof Pagination> = {
  title: "Base/Pagination",
  component: Pagination,
};

export default meta;
type Story = StoryObj<typeof Pagination>;

function Controlled({ initialPage, pageCount }: { initialPage: number; pageCount: number }) {
  const [page, setPage] = useState(initialPage);
  return <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />;
}

export const Default: Story = {
  render: () => <Controlled initialPage={1} pageCount={5} />,
};

export const ManyPagesWithEllipsis: Story = {
  render: () => <Controlled initialPage={12} pageCount={40} />,
};

export const FirstPage: Story = {
  render: () => <Controlled initialPage={1} pageCount={8} />,
};

export const LastPage: Story = {
  render: () => <Controlled initialPage={8} pageCount={8} />,
};
