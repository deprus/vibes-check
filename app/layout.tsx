import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Background from "@/components/background";

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
        <Background />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 flex container">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
