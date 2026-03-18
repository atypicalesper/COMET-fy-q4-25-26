import Link from "next/link";

export function Nav() {
  return (
    <header className="border-b border-zinc-100">
      <div className="mx-auto max-w-2xl px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-semibold text-zinc-900 hover:text-zinc-600 transition-colors"
        >
          devlog
        </Link>
        <nav className="flex gap-6 text-sm text-zinc-500">
          <Link href="/devlog" className="hover:text-zinc-900 transition-colors">
            posts
          </Link>
          <Link href="/about" className="hover:text-zinc-900 transition-colors">
            about
          </Link>
          <Link
            href="/rag"
            className="text-violet-500 hover:text-violet-700 transition-colors font-medium"
          >
            rag chat →
          </Link>
        </nav>
      </div>
    </header>
  );
}
