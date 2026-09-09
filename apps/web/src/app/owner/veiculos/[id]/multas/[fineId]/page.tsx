import { PlaceholderPage } from "../../../../../../components/PlaceholderPage";

export default function OwnerMultaDetailPage({
  params,
}: {
  params: { id: string; fineId: string };
}) {
  return (
    <PlaceholderPage
      title={`Multa ${params.fineId}`}
      breadcrumb={[
        { label: "Minha área", href: "/owner" },
        { label: "Meus veículos", href: "/owner/veiculos" },
        { label: params.id, href: `/owner/veiculos/${params.id}` },
        { label: `Multa ${params.fineId}` },
      ]}
    />
  );
}
