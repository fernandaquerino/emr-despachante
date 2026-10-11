import type { Metadata } from "next";
import { HomeHero } from "./_components/HomeHero";
import { GarageShowcase } from "./_components/GarageShowcase";
import { PainSolution } from "./_components/PainSolution";
import { HumanBand } from "./_components/HumanBand";
import { ServicesGrid } from "./_components/ServicesGrid";
import { PaymentTerms } from "./_components/PaymentTerms";
import { ProcessSteps } from "./_components/ProcessSteps";
import { TrustSection } from "./_components/TrustSection";
import { Testimonials } from "./_components/Testimonials";
import { Faq } from "./_components/Faq";
import { FinalCta } from "./_components/FinalCta";
import { WhatsAppFab } from "./_components/WhatsAppFab";

export const metadata: Metadata = {
  title: "Consulte e resolva a documentação do seu veículo",
  description:
    "Consulte multas, licenciamento e IPVA do seu veículo pela placa e acompanhe cada solicitação até a conclusão.",
  openGraph: {
    title: "EMR Despachantes",
    description:
      "Consulte multas, licenciamento e IPVA do seu veículo pela placa e acompanhe cada solicitação até a conclusão.",
    type: "website",
  },
};

// Catálogo real (docs/product/PRODUCT_DESCRIPTION.md §5) — multas e
// licenciamento têm implementação profunda; IPVA/transferência/dívida
// ativa são implementação estrutural. Nenhum preço/prazo é exibido aqui
// porque nenhum está confirmado no repositório (RF-048 ainda é requisito,
// não dado). "Gravame" não entra: não está no catálogo documentado.
const servicos = [
  {
    icon: "scroll-text",
    title: "Multas",
    description: "Consulte multas em aberto, pague e acompanhe a baixa junto ao órgão.",
  },
  {
    icon: "file-check",
    title: "Licenciamento",
    description: "Veja pendências, libere o licenciamento e acompanhe a emissão.",
  },
  {
    icon: "landmark",
    title: "IPVA",
    description: "Acompanhe a situação do IPVA, incluindo exercícios anteriores.",
  },
  {
    icon: "arrow-left-right",
    title: "Transferência",
    description: "Organize a documentação necessária para transferência de propriedade.",
  },
  {
    icon: "receipt",
    title: "Dívida ativa",
    description: "Identifique débitos inscritos em dívida ativa vinculados ao veículo.",
  },
] as const;

// Etapas refletem ServiceRequestStatus (STATUS_MODEL.md): NEW → IN_PROGRESS
// → WAITING_CUSTOMER/PARTNER/EXTERNAL → COMPLETED.
const comoFunciona = [
  {
    icon: "car-front",
    title: "Consulte a placa",
    description: "Sem cadastro. Você vê o que está em aberto na hora.",
  },
  {
    icon: "clipboard",
    title: "Escolha o que resolver",
    description: "Selecione os serviços a partir do que encontramos.",
  },
  {
    icon: "credit-card",
    title: "Pague com segurança",
    description: "Valor da pendência, taxa e total visíveis antes de confirmar.",
  },
  {
    icon: "check-circle",
    title: "Acompanhe até o fim",
    description: "Cada etapa fica visível no painel, sem depender de mensagens soltas.",
  },
] as const;

const doresESolucoes = [
  {
    pain: "Fila no Detran, senha, e voltar outro dia porque faltava um documento.",
    solution: "Você resolve pelo celular e só é chamado se faltar algo de verdade.",
  },
  {
    pain: "Descobrir a multa quando o licenciamento já está bloqueado.",
    solution: "Aviso quando a multa aparece — antes de virar bloqueio.",
  },
  {
    pain: "Ligar para o despachante para saber “como está”.",
    solution: "Status visível a qualquer hora, com a etapa exata do seu pedido.",
  },
] as const;

const faqItems = [
  {
    id: "cadastro",
    question: "Preciso criar uma conta para consultar meu veículo?",
    answer:
      "Não. A consulta inicial pela placa não exige cadastro. Uma conta é necessária apenas para acompanhar e concluir solicitações.",
  },
  {
    id: "app-preco",
    question: "Preciso pagar para usar o app?",
    answer:
      "Não. Criar a conta, cadastrar veículos, consultar pendências e receber alertas não têm custo. Você paga apenas o serviço que solicitar, com o valor visível antes de confirmar.",
  },
  {
    id: "documentos-depois",
    question: "Como acesso meus documentos depois?",
    answer:
      "Pelo seu painel, em Documentos. Os arquivos ficam vinculados ao veículo e ao pedido, e o download é autorizado somente para você.",
  },
  {
    id: "alertas",
    question: "Como funcionam os alertas de vencimento?",
    answer:
      "Depois de cadastrar o veículo, avisamos quando aparece multa nova, quando um prazo está perto de vencer e quando há pagamento aguardando confirmação.",
  },
  {
    id: "pagamento",
    question: "Quando meu pagamento é considerado confirmado?",
    answer:
      "Somente após a confirmação oficial do provedor de pagamento — o início do checkout não é, por si só, uma confirmação.",
  },
  {
    id: "cobertura",
    question: "O EMR resolve qualquer serviço em qualquer estado?",
    answer:
      "A disponibilidade varia por serviço e por estado. As condições específicas são mostradas ao iniciar cada solicitação.",
  },
  {
    id: "acompanhamento",
    question: "Como acompanho uma solicitação em andamento?",
    answer: "Pelo seu painel, com o status atualizado a cada etapa do processo.",
  },
  {
    id: "dados",
    question: "O que vocês fazem com os meus dados?",
    answer:
      "Coletamos o mínimo necessário para executar o serviço. A consulta pela placa não exige CPF, e os avisos só são enviados com a sua autorização.",
  },
];

/**
 * JSON-LD derivado do MESMO array renderizado no accordion — fonte única.
 * Duplicar as perguntas num bloco separado é como o rich result e a página
 * passam a divergir sem ninguém perceber.
 */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function HomePage() {
  return (
    <>
      <HomeHero />

      <GarageShowcase id="garagem" />

      <PainSolution id="por-que" pairs={doresESolucoes} />

      <HumanBand />

      <ServicesGrid
        id="servicos"
        eyebrow="Serviços"
        title="O que você resolve aqui"
        description="Os serviços organizados por quem precisa resolver — não por nome de formulário do órgão."
        items={servicos}
        actionHref="#consulta"
        actionLabel="Consultar"
      />

      <PaymentTerms id="pagamento" />

      <ProcessSteps
        id="como-funciona"
        eyebrow="Como funciona"
        title="Quatro passos, do pedido à conclusão"
        description="Um processo com etapas claras, visíveis do início ao fim."
        steps={comoFunciona}
      />

      <TrustSection
        id="seguranca"
        eyebrow="Segurança"
        title="Por que confiar o documento do seu carro à EMR"
        description="Princípios que guiam como tratamos seus dados e seu pagamento."
        points={[
          {
            icon: "shield-check",
            text: "Seu pagamento só é confirmado após retorno oficial do provedor — nunca por redirecionamento.",
          },
          {
            icon: "file-check",
            text: "Cada solicitação tem um status explícito, visível para você a qualquer momento.",
          },
          {
            icon: "landmark",
            text: "Integrações com órgãos oficiais são tratadas com fila e nova tentativa em caso de instabilidade.",
          },
          {
            icon: "lock",
            text: "Seus dados pessoais são tratados com minimização e acesso restrito.",
          },
        ]}
      />

      {/* Conteúdo pendente de depoimentos reais — ver Testimonials.tsx. */}
      <Testimonials id="depoimentos" />

      <Faq
        id="faq"
        title="Perguntas frequentes"
        description="Respostas objetivas para as dúvidas mais comuns."
        items={faqItems}
      />

      <FinalCta
        title="Comece pela placa. O resto é com a gente."
        description="Consulta gratuita e sem cadastro. Em poucos segundos você sabe o que está em aberto."
        primaryCta={{ label: "Consultar meu veículo", href: "#consulta" }}
        secondaryCta={{ label: "Soluções para empresas", href: "/parceiros" }}
      />

      <WhatsAppFab phoneNumber={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER} />

      <script
        type="application/ld+json"
        // Conteúdo é 100% estático e derivado de `faqItems` — nenhuma entrada
        // do usuário atravessa este ponto.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
