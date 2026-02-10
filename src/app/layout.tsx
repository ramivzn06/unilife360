import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/shared/theme-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | UniLife 360",
    default: "UniLife 360 — L'OS de Vie Étudiant",
  },
  description:
    "Ton assistant de vie étudiant : budget intelligent, emploi du temps optimisé, cours collaboratifs et vie sociale. Tout en un, propulsé par l'IA.",
  keywords: ["étudiant", "budget", "emploi du temps", "université", "IA", "planning", "vie étudiante"],
  authors: [{ name: "UniLife 360" }],
  openGraph: {
    title: "UniLife 360 — L'OS de Vie Étudiant",
    description:
      "Budget intelligent, emploi du temps optimisé, cours collaboratifs et vie sociale — tout dans une seule app conçue pour les étudiants.",
    type: "website",
    locale: "fr_FR",
    siteName: "UniLife 360",
  },
  twitter: {
    card: "summary_large_image",
    title: "UniLife 360 — L'OS de Vie Étudiant",
    description:
      "Budget intelligent, emploi du temps optimisé, cours collaboratifs et vie sociale — tout dans une seule app conçue pour les étudiants.",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="light" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${dmSans.variable} antialiased`}
        style={{ fontFamily: "var(--font-body)" }}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
