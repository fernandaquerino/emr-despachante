import { PlaceholderPage } from "../../../../../components/PlaceholderPage";

export default function AdminPedidoDetailPage({ params }: { params: { id: string } }) {
  return (
    <PlaceholderPage
      title={`Pedido ${params.id}`}
      breadcrumb={[
        { label: "Visão geral", href: "/admin" },
        { label: "Pedidos", href: "/admin/financeiro/pedidos" },
        { label: params.id },
      ]}
    />
  );
}
