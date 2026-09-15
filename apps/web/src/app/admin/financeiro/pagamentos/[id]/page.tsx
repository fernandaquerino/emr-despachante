import { PlaceholderPage } from "../../../../../components/PlaceholderPage";

export default function AdminPagamentoDetailPage({ params }: { params: { id: string } }) {
  return (
    <PlaceholderPage
      title={`Pagamento ${params.id}`}
      breadcrumb={[
        { label: "Visão geral", href: "/admin" },
        { label: "Pagamentos", href: "/admin/financeiro/pagamentos" },
        { label: params.id },
      ]}
    />
  );
}
