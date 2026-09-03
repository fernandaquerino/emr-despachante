import { validateWebEnv } from "../config/env";

validateWebEnv(process.env);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
