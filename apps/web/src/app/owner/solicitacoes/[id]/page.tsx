import { PlaceholderPage } from "../../../../components/PlaceholderPage";

export default function OwnerSolicitacaoDetailPage({ params }: { params: { id: string } }) {
  return (
    <PlaceholderPage
      title={`Solicitação ${params.id}`}
      breadcrumb={[
        { label: "Minha área", href: "/owner" },
        { label: "Solicitações", href: "/owner/solicitacoes" },
        { label: params.id },
      ]}
    />
  );
}
