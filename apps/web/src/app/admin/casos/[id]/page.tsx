import { PlaceholderPage } from "../../../../components/PlaceholderPage";

export default function AdminCasoDetailPage({ params }: { params: { id: string } }) {
  return (
    <PlaceholderPage
      title={`Caso ${params.id}`}
      breadcrumb={[
        { label: "Visão geral", href: "/admin" },
        { label: "Casos", href: "/admin/casos" },
        { label: params.id },
      ]}
    />
  );
}
