"use client";

import { useState } from "react";
import { buttonVariants, cn } from "@emr/ui";

/**
 * CTA comercial "Quero ser parceiro" (EMR-SCREEN-MAP.md §2.7: rota
 * `/parceiros/contato` é P1/futuro, sem integração hoje). Nenhum contato
 * real (e-mail/telefone) está confirmado no repositório, então o clique
 * não finge enviar nada nem aponta para um link inventado — só revela um
 * aviso neutro, localmente.
 */
export function NeutralContactCta({ className }: { className?: string }) {
  const [revealed, setRevealed] = useState(false);

  if (revealed) {
    return (
      <p role="status" className={cn("text-body-public text-text-secondary-strong", className)}>
        Em breve você poderá falar com nossa equipe comercial por aqui.
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setRevealed(true)}
      className={cn(buttonVariants({ variant: "secondary", size: "lg" }), className)}
    >
      Quero ser parceiro
    </button>
  );
}
