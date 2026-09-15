import { FileText, FolderClosed, LayoutDashboard, Receipt } from "lucide-react";
import type { SidebarGroup } from "@emr/ui";

/**
 * OWNER não tem sidebar (AppShell variant="minimal" — DESIGN_SYSTEM.md
 * §14). Esta lista existe para compor o PageHeader/breadcrumb e uma futura
 * navegação por abas — docs/EMR-SCREEN-MAP.md §4. Sem regra de
 * visibilidade por sessão hoje — não recebe `session` (diferente de
 * `getPartnerNavGroups`) para não carregar um parâmetro sem uso.
 */
export function getOwnerNavGroups(): SidebarGroup[] {
  return [
    {
      items: [
        { label: "Minha área", href: "/owner", icon: LayoutDashboard },
        { label: "Meus veículos", href: "/owner/veiculos", icon: FolderClosed },
        { label: "Solicitações", href: "/owner/solicitacoes", icon: FileText },
        { label: "Documentos", href: "/owner/documentos", icon: FileText },
        { label: "Pagamentos", href: "/owner/pagamentos", icon: Receipt },
      ],
    },
  ];
}
