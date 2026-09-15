import { PlaceholderPage } from "../../../../components/PlaceholderPage";

export default function AdminParceiroDetailPage({ params }: { params: { id: string } }) {
  return (
    <PlaceholderPage
      title={`Parceiro ${params.id}`}
      breadcrumb={[
        { label: "Visão geral", href: "/admin" },
        { label: "Parceiros", href: "/admin/parceiros" },
        { label: params.id },
      ]}
    />
  );
}
