"use client";

import { Accordion, cn, type AccordionItem } from "@emr/ui";
import { Container } from "./Container";
import { useReveal } from "./lib/use-reveal";

export interface FaqProps {
  id?: string;
  title: string;
  description: string;
  items: AccordionItem[];
}

export function Faq({ id, title, description, items }: FaqProps) {
  const reveal = useReveal<HTMLDivElement>();

  return (
    <section id={id} className="scroll-mt-20 bg-bg-subtle py-20 lg:py-28">
      <Container>
        <div ref={reveal.ref} className={cn("mx-auto max-w-2xl", reveal.className)}>
          <div className="mb-8 flex flex-col gap-3 text-center">
            <span className="text-label font-medium uppercase tracking-wide text-action-accent">
              FAQ
            </span>
            <h2 className="text-h1 text-text md:text-display">{title}</h2>
            <p className="text-lead text-text-secondary-strong">{description}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface px-6 shadow-elev1 lg:px-8">
            <Accordion items={items} size="lg" />
          </div>
        </div>
      </Container>
    </section>
  );
}
