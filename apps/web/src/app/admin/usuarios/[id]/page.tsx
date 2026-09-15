import { PlaceholderPage } from "../../../../components/PlaceholderPage";

export default function AdminUsuarioDetailPage({ params }: { params: { id: string } }) {
  return (
    <PlaceholderPage
      title={`Usuário ${params.id}`}
      breadcrumb={[
        { label: "Visão geral", href: "/admin" },
        { label: "Usuários", href: "/admin/usuarios" },
        { label: params.id },
      ]}
    />
  );
}
