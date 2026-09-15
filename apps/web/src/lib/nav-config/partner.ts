import { FileText, FolderClosed, LayoutDashboard, Receipt, Users } from "lucide-react";
import type { SidebarGroup } from "@emr/ui";
import type { MockSession } from "../mock-session";

/**
 * docs/product/INFORMATION_ARCHITECTURE.md §Parceiro. "Equipe" só é visível
 * para PARTNER_ADMIN/gestor (EMR-SCREEN-MAP.md §21). "Financeiro" é FUTURO
 * — depende de billing B2B ainda não decidido; a rota existe (a issue já
 * lista a URL) mas fica oculta do menu até a feature ser habilitada.
 */
const FEATURE_PARTNER_BILLING = false;

export function getPartnerNavGroups(session: MockSession): SidebarGroup[] {
  return [
    {
      items: [
        { label: "Visão geral", href: "/partner", icon: LayoutDashboard },
        { label: "Solicitações", href: "/partner/solicitacoes", icon: FileText },
        { label: "Veículos", href: "/partner/veiculos", icon: FolderClosed },
        { label: "Documentos", href: "/partner/documentos", icon: FileText },
        {
          label: "Equipe",
          href: "/partner/equipe",
          icon: Users,
          hidden: session.role !== "PARTNER_ADMIN",
        },
        {
          label: "Financeiro",
          href: "/partner/financeiro",
          icon: Receipt,
          hidden: !FEATURE_PARTNER_BILLING,
        },
      ],
    },
  ];
}
