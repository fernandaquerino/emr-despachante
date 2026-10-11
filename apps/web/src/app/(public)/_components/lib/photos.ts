/**
 * Manifesto de fotografia da área pública.
 *
 * Existe para que uma foto que ainda não chegou não vire nem `<img>` quebrada
 * nem ilustração vetorial inventada: enquanto `available` for `false`, o
 * componente `Photo` renderiza um bloco provisório **visivelmente marcado**,
 * com o briefing da foto que falta. Quando o arquivo entrar em
 * `apps/web/public/images/`, basta virar a flag.
 *
 * As fotos atuais foram geradas por IA (Higgsfield, modelo `z_image`) a partir
 * dos briefings abaixo. São JPEG de propósito: a máquina de build não tem
 * encoder WebP, e o `next/image` converte para AVIF/WebP no servidor de
 * qualquer forma (`next.config.mjs` → `images.formats`).
 *
 * Regra de conteúdo (ADR-017): estas fotos são **ilustrativas**. Nenhuma delas
 * pode aparecer ao lado de citação, nome ou afirmação de que a pessoa é
 * cliente da EMR — isso seria prova social fabricada (CDC art. 37).
 */
export interface PublicPhoto {
  src: string;
  /** Descritivo e factual. Nunca "cliente satisfeito": não é verificável. */
  alt: string;
  width: number;
  height: number;
  /** `false` enquanto o arquivo não existir em `public/images/`. */
  available: boolean;
  /** Briefing para quem for produzir/substituir a foto. */
  briefing: string;
}

export const publicPhotos = {
  heroConsulta: {
    src: "/images/hero-consulta.jpg",
    alt: "Homem de cabelos grisalhos consultando o celular ao lado do próprio carro",
    width: 1400,
    height: 1050,
    available: true,
    briefing:
      "Pessoa 50+, luz natural, celular na mão, carro desfocado ao fundo. Enquadramento 4:3, espaço livre na base para o cartão de consulta sobrepor.",
  },
  humanizacao: {
    src: "/images/papelada-resolvida.jpg",
    alt: "Mulher sorrindo ao consultar o celular à mesa de casa, com um documento do veículo ao lado",
    width: 1600,
    height: 900,
    available: true,
    briefing:
      "Pessoa 50+ em casa, documentos de veículo sobre a mesa, expressão de alívio e não de esforço. Enquadramento 16:9, luz de manhã.",
  },
  parceirosHero: {
    src: "/images/parceiros-hero.jpg",
    alt: "Dois executivos apertando as mãos no salão de uma concessionária",
    width: 1299,
    height: 1400,
    available: true,
    briefing:
      "Aperto de mão entre gestor de concessionária e representante, salão amplo e claro. Enquadramento retrato, pessoas à esquerda do centro.",
  },
} satisfies Record<string, PublicPhoto>;

export type PublicPhotoKey = keyof typeof publicPhotos;
