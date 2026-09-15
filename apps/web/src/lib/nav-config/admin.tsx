import {
  Building2,
  FileText,
  LayoutDashboard,
  ReceiptText,
  ScrollText,
  Settings,
  ShieldCheck,
  Tag,
  Users,
  Wallet,
} from "lucide-react";
import { Badge, type SidebarGroup } from "@emr/ui";

/**
 * docs/product/INFORMATION_ARCHITECTURE.md §Admin — grupos OPERAÇÃO,
 * FINANCEIRO, GESTÃO. "Cases" recebe um badge estático (contagem real é
 * fora de escopo desta issue) para satisfazer a regra de destaque visual
 * de exceções críticas (INFORMATION_ARCHITECTURE.md/DASHBOARD_SPEC.md).
 * Sem regra de visibilidade por sessão hoje — não recebe `session`
 * (diferente de `getPartnerNavGroups`) para não carregar um parâmetro
 * sem uso.
 */
export function getAdminNavGroups(): SidebarGroup[] {
  return [
    {
      items: [{ label: "Visão geral", href: "/admin", icon: LayoutDashboard }],
    },
    {
      title: "Operação",
      items: [
        { label: "Solicitações", href: "/admin/solicitacoes", icon: FileText },
        {
          label: "Casos",
          href: "/admin/casos",
          icon: ShieldCheck,
          badge: <Badge tone="neutral">3</Badge>,
        },
        { label: "Clientes", href: "/admin/clientes", icon: Users },
        { label: "Veículos", href: "/admin/veiculos", icon: FileText },
      ],
    },
    {
      title: "Financeiro",
      items: [
        { label: "Pedidos", href: "/admin/financeiro/pedidos", icon: ReceiptText },
        { label: "Pagamentos", href: "/admin/financeiro/pagamentos", icon: Wallet },
        { label: "Reconciliação", href: "/admin/financeiro/reconciliacao", icon: ScrollText },
      ],
    },
    {
      title: "Gestão",
      items: [
        { label: "Parceiros", href: "/admin/parceiros", icon: Building2 },
        { label: "Serviços e preços", href: "/admin/servicos", icon: Tag },
        { label: "Usuários", href: "/admin/usuarios", icon: Users },
        { label: "Auditoria", href: "/admin/auditoria", icon: ScrollText },
        { label: "Configurações", href: "/admin/configuracoes", icon: Settings },
      ],
    },
  ];
}
