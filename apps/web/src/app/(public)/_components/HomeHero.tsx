"use client";

import { Badge, cn } from "@emr/ui";
import { Container } from "./Container";
import { Photo } from "./Photo";
import { PlateConsultWidget } from "./PlateConsultWidget";
import { heroPhotoMaskStyle } from "./lib/hero-photo-mask";
import { useReveal } from "./lib/use-reveal";

/**
 * Dobra principal: bloco de cor cheio da marca em split assimétrico — texto à
 * esquerda, foto + widget de consulta à direita.
 *
 * Histórico: em FE-PUB-001 o campo de placa foi tirado do hero porque,
 * embutido na coluna da headline, as duas coisas competiam pelo mesmo eixo
 * vertical. A consulta voltou para a dobra (é o ponto de conversão) mas como
 * coluna própria. Ver LANDING_PAGE_SPEC.md §0.4.
 *
 * O fundo era um grid de linhas + marca d'água do logo. Saiu: lia como
 * ferramenta de desenvolvedor, não como serviço. O que veio no lugar tem três
 * camadas, e nenhuma delas é um padrão decorativo:
 *   1. gradiente da marca com faixa real de luz (`bg-hero-public`);
 *   2. a fotografia sangrando pela direita, mascarada;
 *   3. o cartão de consulta por cima, que continua sendo o assunto da dobra.
 *
 * Um bloco de cor chapado foi testado e reprovado: sem faixa entre claro e
 * escuro, navy puro lê como fundo de formulário.
 *
 * `min-h-[100dvh]` e não `h-screen`: `vh` no iOS Safari conta a barra de
 * endereço e provoca salto de layout no primeiro scroll.
 */
const socialProof = [
  "Consulta direto na base dos órgãos",
  "Pagamento confirmado só por retorno oficial",
  "Acompanhamento em tempo real",
] as const;

export function HomeHero() {
  const eyebrow = useReveal<HTMLSpanElement>({ mode: "onMount", delayMs: 0 });
  const heading = useReveal<HTMLHeadingElement>({ mode: "onMount", delayMs: 120 });
  const lead = useReveal<HTMLParagraphElement>({ mode: "onMount", delayMs: 220 });
  const trustRow = useReveal<HTMLDivElement>({ mode: "onMount", delayMs: 380 });
  const widget = useReveal<HTMLDivElement>({ mode: "onMount", delayMs: 260 });

  return (
    <section
      id="consulta"
      className="relative isolate flex min-h-[100dvh] items-center overflow-hidden bg-hero-public py-16 lg:py-20"
    >
      {/* Camada fotográfica: sangra até a borda direita e ocupa a altura
          inteira da dobra. É o que tira a dobra da condição de "retângulo
          azul com uma foto colada no canto".
          Só a partir de `lg`: abaixo disso não há largura para a foto sem
          empurrar o campo de placa para fora da primeira tela. */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 hidden w-[62%] lg:block"
        style={heroPhotoMaskStyle}
      >
        <Photo name="heroConsulta" fill priority objectPosition="64% 42%" sizes="62vw" />
        {/* Tingimento navy: puxa a foto para a paleta da marca e segura o
            contraste do cartão branco. Dentro da máscara, some junto. */}
        <div className="absolute inset-0 bg-surface-inverse-tint" />
      </div>

      <Container className="relative grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
        <div className="flex flex-col gap-6">
          <span
            ref={eyebrow.ref}
            className={cn(
              "text-label font-semibold uppercase tracking-wide text-text-inverse-highlight",
              eyebrow.className,
            )}
          >
            Despachante 100% digital
          </span>
          <h1
            ref={heading.ref}
            className={cn(
              "max-w-[14ch] text-display text-text-inverse sm:max-w-none md:text-display-marketing",
              heading.className,
            )}
          >
            Descubra o que o seu carro deve. Sem cadastro.
          </h1>
          <p
            ref={lead.ref}
            className={cn("max-w-xl text-lead text-text-inverse-secondary", lead.className)}
          >
            Digite a placa e veja multas, licenciamento e IPVA num só lugar.{" "}
            <strong className="font-semibold text-text-inverse-highlight">Parcele no cartão</strong>{" "}
            e acompanhe cada etapa pelo painel.
          </p>

          <div ref={trustRow.ref} className={cn("flex flex-wrap gap-2", trustRow.className)}>
            {socialProof.map((item) => (
              <Badge
                key={item}
                tone="neutral"
                className="border-border-inverse bg-surface-on-inverse text-body text-text-inverse-secondary"
              >
                {item}
              </Badge>
            ))}
          </div>
        </div>

        <div
          ref={widget.ref}
          className={cn("mx-auto w-full max-w-md lg:mx-0 lg:max-w-none", widget.className)}
        >
          {/* `relative z-10`: a camada da foto é posicionada e pintaria por
              cima de um irmão estático. */}
          <div className="relative z-10">
            <PlateConsultWidget />
          </div>
        </div>
      </Container>
    </section>
  );
}
