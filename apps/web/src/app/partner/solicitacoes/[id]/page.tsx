import { PlaceholderPage } from "../../../../components/PlaceholderPage";

export default function PartnerSolicitacaoDetailPage({ params }: { params: { id: string } }) {
  return (
    <PlaceholderPage
      title={`Solicitação ${params.id}`}
      breadcrumb={[
        { label: "Visão geral", href: "/partner" },
        { label: "Solicitações", href: "/partner/solicitacoes" },
        { label: params.id },
      ]}
    />
  );
}
