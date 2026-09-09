import { PlaceholderPage } from "../../../components/PlaceholderPage";

export default function AdminContaPage() {
  return (
    <PlaceholderPage
      title="Minha conta"
      breadcrumb={[{ label: "Visão geral", href: "/admin" }, { label: "Minha conta" }]}
    />
  );
}
