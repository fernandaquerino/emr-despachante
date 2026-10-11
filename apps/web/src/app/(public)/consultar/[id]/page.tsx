import type { Metadata } from "next";
import Link from "next/link";
import { Alert, buttonVariants, cn } from "@emr/ui";
import { Container } from "../../_components/Container";

export const metadata: Metadata = {
  title: "Resultado da consulta",
};

/**
 * Casca da rota `/consultar/:id`. O conteúdo — resumo do veículo, pendências,
 * serviços elegíveis e o CTA "Resolver pendências" — é escopo de
 * `FE-PUB-003` (#152) e **não** é implementado aqui.
 *
 * Existe para que o encaminhamento do sucesso em `/consultar` não termine em
 * 404 enquanto #152 não entrar. Não usa `PlaceholderPage`: aquele componente
 * monta `PageHeader` + breadcrumb, que são chrome do app autenticado e têm
 * densidade errada na área pública.
 *
 * Não busca nem exibe nada do resultado de propósito: inventar um resumo aqui
 * seria afirmar algo sobre o veículo que não foi consultado nesta rota.
 */
export default function ConsultaResultadoPage() {
  return (
    <Container className="max-w-[640px] py-12 lg:py-20">
      <h1 className="text-h1 font-semibold tracking-tight text-text">Resultado da consulta</h1>

      <div className="mt-6 flex flex-col items-start gap-6">
        <Alert
          tone="info"
          title="Esta tela de resultado ainda está em construção."
          description="A consulta foi concluída, mas a página que detalha as pendências entra no ar na próxima etapa do produto. Enquanto isso, você pode consultar outra placa ou falar com a gente."
        />

        <Link href="/consultar" className={cn(buttonVariants({ variant: "primary", size: "lg" }))}>
          Consultar outra placa
        </Link>
      </div>
    </Container>
  );
}
