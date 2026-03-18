import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RAG Chat",
  description:
    "Ask questions about your documents using Retrieval-Augmented Generation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
