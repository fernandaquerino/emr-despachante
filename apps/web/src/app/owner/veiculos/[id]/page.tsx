import { PlaceholderPage } from "../../../../components/PlaceholderPage";

export default function OwnerVeiculoDetailPage({ params }: { params: { id: string } }) {
  return (
    <PlaceholderPage
      title={`Veículo ${params.id}`}
      breadcrumb={[
        { label: "Minha área", href: "/owner" },
        { label: "Meus veículos", href: "/owner/veiculos" },
        { label: params.id },
      ]}
    />
  );
}
