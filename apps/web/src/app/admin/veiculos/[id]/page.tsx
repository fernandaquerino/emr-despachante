import { PlaceholderPage } from "../../../../components/PlaceholderPage";

export default function AdminVeiculoDetailPage({ params }: { params: { id: string } }) {
  return (
    <PlaceholderPage
      title={`Veículo ${params.id}`}
      breadcrumb={[
        { label: "Visão geral", href: "/admin" },
        { label: "Veículos", href: "/admin/veiculos" },
        { label: params.id },
      ]}
    />
  );
}
