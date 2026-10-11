"use client";

import { cn } from "@emr/ui";
import { useScrolled } from "./lib/use-scrolled";

/**
 * CTA flutuante de WhatsApp (LANDING_PAGE_SPEC.md §S10).
 *
 * Decisões que não são estéticas:
 *
 * 1. Só aparece depois da dobra. Na dobra ele competiria com o widget de
 *    consulta, que é o CTA primário da página.
 * 2. **Fundo verde de marca.** A spec §S10 pedia o contrário ("não verde
 *    WhatsApp saturado"); a decisão foi revista em 2026-10-08 — ver ADR-018.
 *    O verde entra como cor de MARCA de terceiro (`--brand-whatsapp`), não
 *    como verde semântico de sucesso, que continua proibido como cor de ação.
 * 3. A mensagem pré-preenchida é genérica e **nunca** carrega placa ou
 *    qualquer PII: deep link de WhatsApp não é canal autorizado para isso
 *    (SECURITY_AND_LGPD.md §WhatsApp outbound).
 *
 * Sem `NEXT_PUBLIC_WHATSAPP_NUMBER` configurado, não renderiza nada — um
 * botão apontando para um número placeholder é pior que nenhum botão.
 */

/**
 * Glifo oficial do WhatsApp (Simple Icons, CC0 — https://simpleicons.org).
 * Marca registrada não existe em biblioteca de ícones genérica, e redesenhar
 * logotipo à mão dá um glifo errado. Path copiado do SVG oficial, não
 * transcrito de memória.
 */
function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export function WhatsAppFab({ phoneNumber }: { phoneNumber?: string }) {
  // 600px: já passou da dobra em qualquer viewport comum sem depender de medir
  // a altura real do hero (que varia com a quebra da headline).
  const pastHero = useScrolled(600);

  if (!phoneNumber) {
    return null;
  }

  const href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    "Olá! Quero resolver a documentação do meu veículo.",
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a EMR no WhatsApp"
      className={cn(
        "fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full",
        "bg-brand-whatsapp text-white shadow-elev3",
        // A borda interna escura existe para o círculo ter contorno sobre
        // fundo claro: verde saturado sobre `bg-subtle` quase não tem aresta.
        "ring-1 ring-inset ring-black/10",
        "transition-[opacity,transform,background-color] duration-normal ease-decel",
        "hover:bg-brand-whatsapp-hover active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2",
        pastHero
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none translate-y-2 opacity-0",
      )}
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <WhatsAppGlyph className="h-7 w-7" />
    </a>
  );
}
