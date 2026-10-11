import type { Metadata } from "next";
import { PublicHeader } from "./_components/PublicHeader";
import { Footer } from "./_components/Footer";

export const metadata: Metadata = {
  title: {
    default: "EMR Despachantes",
    template: "%s | EMR Despachantes",
  },
  description:
    "Consulte a situação do seu veículo e resolva multas, licenciamento e demais pendências veiculares em um só lugar.",
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
