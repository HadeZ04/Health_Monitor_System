import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { Urbanist, Space_Grotesk, Be_Vietnam_Pro } from "next/font/google";

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TechXen Health Intelligence",
  description: "AI medical monitoring suite with dashboards, alerts, and patient care tools."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
      </head>
      <body className={`${urbanist.variable} ${spaceGrotesk.variable} ${beVietnamPro.variable} bg-slate-950 text-slate-100`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
