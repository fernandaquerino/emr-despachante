import { PlaceholderPage } from "../../../components/PlaceholderPage";

/**
 * FUTURO — depende de billing B2B ainda não decidido
 * (docs/EMR-SCREEN-MAP.md). Rota existe (a issue já lista a URL) mas o
 * item fica oculto do menu (ver lib/nav-config/partner.ts) até a feature
 * ser habilitada.
 */
export default function PartnerFinanceiroPage() {
  return (
    <PlaceholderPage
      title="Financeiro"
      breadcrumb={[{ label: "Visão geral", href: "/partner" }, { label: "Financeiro" }]}
    />
  );
}
