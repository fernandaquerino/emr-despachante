import { PlaceholderPage } from "../../../../components/PlaceholderPage";

export default function AdminClienteDetailPage({ params }: { params: { id: string } }) {
  return (
    <PlaceholderPage
      title={`Cliente ${params.id}`}
      breadcrumb={[
        { label: "Visão geral", href: "/admin" },
        { label: "Clientes", href: "/admin/clientes" },
        { label: params.id },
      ]}
    />
  );
}
