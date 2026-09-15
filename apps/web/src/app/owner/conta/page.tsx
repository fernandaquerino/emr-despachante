import { PlaceholderPage } from "../../../components/PlaceholderPage";

export default function OwnerContaPage() {
  return (
    <PlaceholderPage
      title="Minha conta"
      breadcrumb={[{ label: "Minha área", href: "/owner" }, { label: "Minha conta" }]}
    />
  );
}
