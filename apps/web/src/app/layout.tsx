import { Inter, IBM_Plex_Mono } from "next/font/google";
import { validateWebEnv } from "../config/env";
import "./globals.css";

validateWebEnv(process.env);

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${plexMono.variable}`}>{children}</body>
    </html>
  );
}
