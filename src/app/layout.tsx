import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Four Service | Soluciones integrales",
  description:
    "Soluciones técnicas y operativas para empresas e instituciones públicas y privadas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={sora.className}>{children}</body>
    </html>
  );
}