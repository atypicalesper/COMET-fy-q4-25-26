import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <p className="text-5xl font-semibold text-zinc-200 mb-4">404</p>
      <h1 className="text-xl font-medium text-zinc-900 mb-2">Page not found</h1>
      <p className="text-sm text-zinc-400 mb-8">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
      >
        ← go home
      </Link>
    </div>
  );
}
