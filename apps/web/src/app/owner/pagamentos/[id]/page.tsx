import { PlaceholderPage } from "../../../../components/PlaceholderPage";

export default function OwnerPagamentoDetailPage({ params }: { params: { id: string } }) {
  return (
    <PlaceholderPage
      title={`Pagamento ${params.id}`}
      breadcrumb={[
        { label: "Minha área", href: "/owner" },
        { label: "Pagamentos", href: "/owner/pagamentos" },
        { label: params.id },
      ]}
    />
  );
}
