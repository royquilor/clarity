import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Agentation } from "agentation";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clarity",
  description: "Define your project before you build. Go from chaos to clarity in minutes.",
  openGraph: {
    title: "Clarity",
    description: "Define your project before you build. Go from chaos to clarity in minutes.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Clarity",
    description: "Define your project before you build. Go from chaos to clarity in minutes.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <TooltipProvider>
          {children}
          <Analytics />
          {process.env.NODE_ENV === "development" && <Agentation />}
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
