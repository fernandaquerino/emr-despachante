import type { CSSProperties } from "react";

/**
 * Máscara que dissolve a fotografia da dobra no bloco de cor.
 *
 * Máscara, e não um véu colorido por cima: um véu precisaria começar
 * exatamente na cor do fundo naquele ponto, e o fundo ali é um gradiente com
 * luz, então sobra uma emenda vertical visível (testado e descartado na
 * dobra da `/`). Mascarando, a própria foto perde opacidade e o gradiente
 * aparece através dela, sem emenda, seja qual for a cor atrás.
 *
 * Some à esquerda, onde a foto encontra a coluna de texto, e na base, para
 * não terminar numa linha reta contra a próxima seção.
 * Preto = opaco, transparente = invisível.
 */
const MASK_LAYERS = [
  "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.2) 14%, rgba(0,0,0,0.85) 38%, #000 56%)",
  "linear-gradient(180deg, #000 62%, transparent 100%)",
].join(", ");

/**
 * `mask-composite: intersect` é obrigatório: sem ele as duas camadas se somam
 * (união) e cada uma anula o fade da outra. O prefixo `-webkit-` é necessário
 * para o Safari.
 */
export const heroPhotoMaskStyle: CSSProperties = {
  maskImage: MASK_LAYERS,
  WebkitMaskImage: MASK_LAYERS,
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
};
