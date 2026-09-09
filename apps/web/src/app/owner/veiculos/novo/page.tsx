import { PlaceholderPage } from "../../../../components/PlaceholderPage";

export default function OwnerNovoVeiculoPage() {
  return (
    <PlaceholderPage
      title="Cadastrar veículo"
      breadcrumb={[
        { label: "Minha área", href: "/owner" },
        { label: "Meus veículos", href: "/owner/veiculos" },
        { label: "Cadastrar" },
      ]}
    />
  );
}
