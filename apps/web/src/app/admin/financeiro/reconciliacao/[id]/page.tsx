import { PlaceholderPage } from "../../../../../components/PlaceholderPage";

export default function AdminReconciliacaoDetailPage({ params }: { params: { id: string } }) {
  return (
    <PlaceholderPage
      title={`Reconciliação ${params.id}`}
      breadcrumb={[
        { label: "Visão geral", href: "/admin" },
        { label: "Reconciliação", href: "/admin/financeiro/reconciliacao" },
        { label: params.id },
      ]}
    />
  );
}
