import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Devlog",
    default: "Devlog — Tarun Singh",
  },
  description: "Weekly notes on what I'm learning and building.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Nav />
        <main className="mx-auto max-w-2xl px-4 py-12">{children}</main>
        <footer className="border-t border-zinc-100 mt-20 py-8 text-center text-sm text-zinc-400">
          <p>Built while learning Next.js</p>
        </footer>
      </body>
    </html>
  );
}
