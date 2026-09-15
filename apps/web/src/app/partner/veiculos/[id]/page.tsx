import { PlaceholderPage } from "../../../../components/PlaceholderPage";

export default function PartnerVeiculoDetailPage({ params }: { params: { id: string } }) {
  return (
    <PlaceholderPage
      title={`Veículo ${params.id}`}
      breadcrumb={[
        { label: "Visão geral", href: "/partner" },
        { label: "Veículos", href: "/partner/veiculos" },
        { label: params.id },
      ]}
    />
  );
}
