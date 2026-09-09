import { PlaceholderPage } from "../../../../components/PlaceholderPage";

export default function AdminSolicitacaoDetailPage({ params }: { params: { id: string } }) {
  return (
    <PlaceholderPage
      title={`Solicitação ${params.id}`}
      breadcrumb={[
        { label: "Visão geral", href: "/admin" },
        { label: "Solicitações", href: "/admin/solicitacoes" },
        { label: params.id },
      ]}
    />
  );
}
