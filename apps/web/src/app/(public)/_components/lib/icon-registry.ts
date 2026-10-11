import {
  ArrowLeftRight,
  CarFront,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  FileCheck2,
  FileClock,
  Landmark,
  Lock,
  MessageCircleWarning,
  ReceiptText,
  ScrollText,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

/**
 * Componentes de ícone (funções) não podem atravessar o limite Server → Client
 * Component como prop (RSC serializa apenas dados). `page.tsx`/`parceiros/page.tsx`
 * são Server Components (precisam de `export const metadata`); por isso passam
 * a *chave* do ícone, e os Client Components resolvem o componente real aqui.
 */
export const iconRegistry = {
  "scroll-text": ScrollText,
  "file-check": FileCheck2,
  landmark: Landmark,
  "arrow-left-right": ArrowLeftRight,
  receipt: ReceiptText,
  "shield-check": ShieldCheck,
  lock: Lock,
  clipboard: ClipboardList,
  users: Users,
  "message-warning": MessageCircleWarning,
  "car-front": CarFront,
  "file-clock": FileClock,
  "check-circle": CheckCircle2,
  "credit-card": CreditCard,
} as const satisfies Record<string, LucideIcon>;

export type IconKey = keyof typeof iconRegistry;
