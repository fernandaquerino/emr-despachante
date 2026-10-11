"use client";

import { cn } from "@emr/ui";
import { Container } from "./Container";
import { useReveal } from "./lib/use-reveal";

/**
 * ⚠️ SEÇÃO COM CONTEÚDO PENDENTE — NÃO PUBLICAR COMO ESTÁ.
 *
 * Estrutura de depoimentos (LANDING_PAGE_SPEC.md §S8) montada e pronta, com o
 * conteúdo deliberadamente **não** preenchido. Depoimento inventado em landing
 * é publicidade enganosa (CDC art. 37) — e é checável por qualquer cliente
 * desconfiado, que é exatamente o público desta página.
 *
 * Para publicar, cada depoimento precisa de:
 *   - nome real (ou primeiro nome + inicial), com autorização registrada;
 *   - cidade/UF;
 *   - serviço efetivamente utilizado;
 *   - autorização de uso de imagem/depoimento arquivada.
 *
 * Avatar fica em **iniciais**, não em foto de banco de imagem: rosto de
 * desconhecido ao lado de citação é cliente fabricado. Foto só se for a
 * pessoa real, com autorização (LANDING_PAGE_SPEC.md §S8).
 *
 * Quando o conteúdo real chegar: preencher `depoimentos`, apagar o bloco de
 * aviso e remover `CONTEUDO_PENDENTE`.
 */
const CONTEUDO_PENDENTE = true;

interface Depoimento {
  iniciais: string;
  nome: string;
  local: string;
  servico: string;
  texto: string;
}

const depoimentos: Depoimento[] = [];

export function Testimonials({ id }: { id?: string }) {
  const reveal = useReveal<HTMLDivElement>();

  if (CONTEUDO_PENDENTE && depoimentos.length === 0) {
    return (
      <section id={id} className="scroll-mt-20 py-20 lg:py-28">
        <Container>
          <div
            ref={reveal.ref}
            className={cn(
              "mx-auto flex max-w-2xl flex-col gap-3 rounded-xl border border-dashed border-border-strong bg-bg-subtle p-8 text-center",
              reveal.className,
            )}
          >
            <p className="text-label font-semibold uppercase tracking-wide text-text-secondary-strong">
              Conteúdo pendente
            </p>
            <h2 className="text-h1 text-text md:text-display">
              Depoimentos entram aqui quando forem reais
            </h2>
            <p className="text-body-public text-text-secondary-strong">
              A estrutura está pronta. Falta o conteúdo do negócio: nome, cidade, serviço utilizado
              e autorização de uso registrada. Depoimento inventado é publicidade enganosa (CDC art.
              37), então esta seção fica visivelmente vazia até lá.
            </p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section id={id} className="scroll-mt-20 py-20 lg:py-28">
      <Container>
        <div className="mb-10 flex max-w-2xl flex-col gap-3">
          <h2 className="text-h1 text-text md:text-display">Quem já resolveu por aqui</h2>
        </div>

        <div
          ref={reveal.ref}
          className={cn("grid gap-6 md:grid-cols-2 lg:grid-cols-3", reveal.className)}
        >
          {depoimentos.map((item) => (
            <figure
              key={item.nome}
              className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6 shadow-elev1"
            >
              <blockquote className="text-lead text-text">{item.texto}</blockquote>
              <figcaption className="mt-auto flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-selected font-semibold text-action-accent"
                >
                  {item.iniciais}
                </span>
                <span className="flex flex-col">
                  <span className="text-body-public font-semibold text-text">{item.nome}</span>
                  <span className="text-body text-text-secondary-strong">
                    {item.local} · {item.servico}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
