import { PlaceholderPage } from "../../../../components/PlaceholderPage";

export default function AdminServicoDetailPage({ params }: { params: { id: string } }) {
  return (
    <PlaceholderPage
      title={`Serviço ${params.id}`}
      breadcrumb={[
        { label: "Visão geral", href: "/admin" },
        { label: "Serviços e preços", href: "/admin/servicos" },
        { label: params.id },
      ]}
    />
  );
}
