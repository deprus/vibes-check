import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Background from "@/components/background";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import { InfoButton } from "@/components/info-button";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vibes-check",
  description: "Deck builder website for Vibes trading card game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-inter antialiased`}>
        <NuqsAdapter>
          <Background />
          <Toaster />
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="container flex flex-1">{children}</main>
            <Footer />
            <InfoButton />
          </div>
        </NuqsAdapter>
      </body>
    </html>
  );
}
