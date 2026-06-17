import type { Metadata, Viewport } from "next";
import { Inter, Bebas_Neue, Playfair_Display, Great_Vibes } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

const greatVibes = Great_Vibes({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Rizos de Oro — Análisis Capilar",
  description:
    "Entiende los ingredientes de tus productos capilares y obtén rutinas personalizadas para cabello rizado, afro y ondulado.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#32244d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${bebas.variable} ${playfair.variable} ${greatVibes.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
