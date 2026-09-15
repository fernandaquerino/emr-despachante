import { PlaceholderPage } from "../../../../components/PlaceholderPage";

export default function PartnerNovaSolicitacaoPage() {
  return (
    <PlaceholderPage
      title="Nova solicitação"
      breadcrumb={[
        { label: "Visão geral", href: "/partner" },
        { label: "Solicitações", href: "/partner/solicitacoes" },
        { label: "Nova" },
      ]}
    />
  );
}
