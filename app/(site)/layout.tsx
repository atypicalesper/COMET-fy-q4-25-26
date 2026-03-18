import { Nav } from "@/components/Nav";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-2xl px-4 py-12">{children}</main>
      <footer className="border-t border-zinc-100 mt-20 py-8 text-center text-sm text-zinc-400">
        <p>Built while learning Next.js</p>
      </footer>
    </>
  );
}
