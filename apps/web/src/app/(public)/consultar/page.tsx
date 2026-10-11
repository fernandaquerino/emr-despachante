import type { Metadata } from "next";
import { Container } from "../_components/Container";
import { ConsultarForm } from "./ConsultarForm";

export const metadata: Metadata = {
  title: "Consultar veículo",
  description:
    "Informe a placa para iniciar sua consulta e verificar as informações disponíveis sobre o veículo.",
};

/**
 * Rota `/consultar` — `FE-PUB-002` (#151), especificada em
 * `EMR-SCREEN-MAP.md` §2.2. Entrada pública dedicada da consulta por placa,
 * sem autenticação ("não obrigatória para a consulta inicial segura").
 *
 * Server Component: só o formulário precisa de interatividade, então só ele é
 * cliente (CLAUDE.md §8). Header e footer vêm de `(public)/layout.tsx`.
 */
export default function ConsultarPage() {
  return (
    <Container className="max-w-[640px] py-12 lg:py-20">
      {/* Coluna estreita e medida de leitura controlada: é uma tarefa de um
          campo, não uma página de conteúdo. Nada de card decorativo em volta
          — o formulário já é o conteúdo da rota. */}
      <h1 className="text-display-marketing font-semibold tracking-tight text-text">
        Consulte a situação do seu veículo
      </h1>
      <p className="mt-4 max-w-[48ch] text-lead text-text-secondary-strong">
        Informe a placa para iniciar sua consulta e verificar as informações disponíveis sobre o
        veículo.
      </p>

      <div className="mt-10">
        <ConsultarForm />
      </div>
    </Container>
  );
}
