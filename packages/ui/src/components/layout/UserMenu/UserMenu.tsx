import type { ElementType } from "react";
import type { LucideIcon } from "lucide-react";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../base/DropdownMenu";
import { Avatar } from "../../base/Avatar";

/**
 * Anatomia: docs/design-system/COMPONENTS.md §Navigation → Header (Avatar/menu).
 * Conteúdo (Minha conta/Configurações/Sair) definido em
 * docs/EMR-SCREEN-MAP.md §4 — quem monta o shell decide os itens e para
 * onde apontam; este componente não conhece rotas nem sessão real.
 */
export interface UserMenuItem {
  label: string;
  href?: string;
  onSelect?: () => void;
  icon?: LucideIcon;
  destructive?: boolean;
}

export interface UserMenuProps {
  name: string;
  avatarSrc?: string;
  items: UserMenuItem[];
  linkAs?: ElementType;
}

export function UserMenu({ name, avatarSrc, items, linkAs: Link = "a" }: UserMenuProps) {
  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger
        aria-label={`Menu do usuário ${name}`}
        className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2"
      >
        <Avatar name={name} src={avatarSrc} size="sm" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {items.map((item, index, all) => {
          const previous = all[index - 1];
          const startsDestructiveSection =
            index > 0 && Boolean(item.destructive) !== Boolean(previous?.destructive);

          const content = item.href ? (
            <Link href={item.href} className="flex flex-1 items-center gap-2">
              {item.label}
            </Link>
          ) : (
            item.label
          );

          return (
            <div key={item.label}>
              {startsDestructiveSection ? <DropdownMenuSeparator /> : null}
              <DropdownMenuItem
                icon={item.icon}
                destructive={item.destructive}
                onSelect={() => item.onSelect?.()}
              >
                {content}
              </DropdownMenuItem>
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
}
