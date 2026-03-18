import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RAG Chat",
  description:
    "Ask questions about your documents using Retrieval-Augmented Generation",
};

export default function RagLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
