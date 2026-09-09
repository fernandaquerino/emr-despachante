import { PlaceholderPage } from "../../../../components/PlaceholderPage";

export default function AdminNovoParceiroPage() {
  return (
    <PlaceholderPage
      title="Novo parceiro"
      breadcrumb={[
        { label: "Visão geral", href: "/admin" },
        { label: "Parceiros", href: "/admin/parceiros" },
        { label: "Novo" },
      ]}
    />
  );
}
