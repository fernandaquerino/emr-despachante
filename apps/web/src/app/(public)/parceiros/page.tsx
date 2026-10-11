import type { Metadata } from "next";
import { PartnersHero } from "../_components/PartnersHero";
import { BeforeAfter } from "../_components/BeforeAfter";
import { PortalPreview } from "../_components/PortalPreview";
import { ServicesGrid } from "../_components/ServicesGrid";
import { ProcessSteps } from "../_components/ProcessSteps";
import { TrustSection } from "../_components/TrustSection";
import { Faq } from "../_components/Faq";
import { FinalCta } from "../_components/FinalCta";
import { NeutralContactCta } from "../_components/NeutralContactCta";

export const metadata: Metadata = {
  title: "Para empresas — Portal do parceiro",
  description:
    "Concessionárias, revendas, locadoras e lojas de seminovos organizam solicitações, documentos e acompanhamento de frota em um portal único.",
  openGraph: {
    title: "EMR Despachantes para empresas",
    description: "Organize solicitações, documentos e acompanhamento de frota em um portal único.",
    type: "website",
  },
};

/**
 * Quatro claims do briefing comercial ficaram **fora** desta página por não
 * terem lastro no repositório. Registrado em LANDING_PAGE_SPEC.md §S11:
 *
 * 1. "baixa de gravame" — zero ocorrências em `docs/`; gravame não está no
 *    catálogo de serviços documentado.
 * 2. "sem mensalidade fixa" — zero ocorrências; o modelo de cobrança é
 *    definido comercialmente, como o próprio FAQ abaixo diz.
 * 3. "EMR Copilot" — é o milestone M12 do ROADMAP, não existe hoje.
 * 4. "PDF do CRLV-e" — RF-023 é "CRLV **simulado**". A copy fala em
 *    comprovantes e documentos, não no documento oficial.
 *
 * Cada um destrava em uma linha quando o negócio confirmar.
 */

// Recursos: só o que o Portal do Parceiro realmente organiza
// (EMR-SCREEN-MAP.md §2.6, PRODUCT_DESCRIPTION.md).
const recursos = [
  {
    icon: "clipboard",
    title: "Solicitação estruturada, não mensagem",
    description:
      "Sua equipe abre o pedido com veículo, serviço e documentos no mesmo lugar. O registro oficial fica no EMR.",
  },
  {
    icon: "file-clock",
    title: "Status explícito a cada etapa",
    description:
      "Dá para ver quando a espera é do órgão e quando a pendência é sua, sem ligar para perguntar.",
  },
  {
    icon: "file-check",
    title: "Documentos e comprovantes centralizados",
    description:
      "Anexos ficam vinculados à solicitação e ao veículo, com download autorizado apenas para a sua organização.",
  },
] as const;

const comoFunciona = [
  {
    icon: "users",
    title: "Cadastre sua organização",
    description: "Nossa equipe comercial cria o acesso e convida quem vai operar.",
  },
  {
    icon: "clipboard",
    title: "Abra a primeira solicitação",
    description: "Veículo, serviço e observação. A solicitação nasce com número.",
  },
  {
    icon: "file-check",
    title: "Envie os documentos",
    description: "O portal diz exatamente o que falta para cada serviço.",
  },
  {
    icon: "check-circle",
    title: "Acompanhe até a conclusão",
    description: "Toda a equipe autorizada vê o andamento e recebe os documentos.",
  },
] as const;

const faqItems = [
  {
    id: "custo",
    question: "Existe custo para cadastrar minha concessionária ou loja?",
    answer:
      "O cadastro da organização não tem custo. O modelo de cobrança dos serviços é definido junto com nossa equipe comercial, conforme o volume da sua operação.",
  },
  {
    id: "documentos",
    question: "Como minha equipe envia os documentos no portal?",
    answer:
      "Cada solicitação lista os documentos exigidos pelo serviço. O upload é feito na própria solicitação, e o arquivo fica vinculado a ela e ao veículo.",
  },
  {
    id: "prazos",
    question: "Como acompanho os prazos de emissão?",
    answer:
      "Pela linha do tempo da solicitação, que mostra a etapa atual. Quando a espera depende de um órgão, o status diz isso de forma explícita em vez de estimar uma data.",
  },
  {
    id: "permissoes",
    question: "O portal permite vários usuários da minha empresa com permissões diferentes?",
    answer:
      "Sim. Sua organização tem administradores e operadores, e o acesso de cada pessoa é escopado à sua empresa.",
  },
];

export default function PartnersPage() {
  return (
    <>
      <PartnersHero phoneNumber={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER} />

      <BeforeAfter id="por-que" />

      <PortalPreview id="portal" />

      {/* Sem eyebrow: a regra de ritmo da área pública limita a 1 a cada 3
          seções, e a dobra já gastou uma. */}
      <ServicesGrid
        id="recursos"
        title="O que sua equipe ganha no portal"
        description="Três mudanças concretas em relação a resolver tudo por mensagem."
        items={recursos}
      />

      <ProcessSteps
        id="como-funciona"
        eyebrow="Como começar"
        title="Quatro passos para virar parceiro"
        description="Do cadastro da organização à primeira solicitação concluída."
        steps={comoFunciona}
      />

      <TrustSection
        id="seguranca"
        title="Confiável para operar em escala"
        description="Princípios que se aplicam a cada solicitação da sua empresa."
        points={[
          {
            icon: "shield-check",
            text: "Pagamentos só são confirmados após retorno oficial do provedor.",
          },
          {
            icon: "file-check",
            text: "Cada solicitação tem um status explícito, visível para sua equipe.",
          },
          {
            icon: "landmark",
            text: "Integrações com órgãos oficiais são tratadas com fila e nova tentativa em caso de instabilidade.",
          },
          {
            icon: "lock",
            text: "Acesso da sua equipe é escopado à sua organização parceira.",
          },
        ]}
      />

      <Faq
        id="faq"
        title="Perguntas frequentes"
        description="Dúvidas comuns de quem avalia o Portal do Parceiro."
        items={faqItems}
      />

      <FinalCta
        title="Pronto para organizar a operação da sua empresa?"
        description="Fale com nossa equipe ou acesse, se já for parceiro."
        primaryCta={{ label: "Já sou parceiro", href: "/login" }}
        secondarySlot={
          <NeutralContactCta className="border-border-inverse-strong bg-transparent text-text-inverse hover:bg-surface-on-inverse" />
        }
        tertiaryCta={{ label: "Voltar para pessoa física", href: "/" }}
      />
    </>
  );
}
