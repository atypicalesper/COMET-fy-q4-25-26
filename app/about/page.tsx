import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About Tarun Singh",
};

export default function AboutPage() {
  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-semibold text-zinc-900 mb-8">About</h1>

      <div className="space-y-4 text-zinc-500 leading-relaxed text-sm">
        <p>
          I&apos;m Tarun, a full-stack developer. I write here to solidify what
          I&apos;m learning — mostly Next.js, TypeScript, and whatever rabbit
          hole I&apos;m in that week.
        </p>
        <p>
          This devlog started as part of a structured 7-week Next.js upskilling
          plan (COMET Q4 FY25-26). The goal was to go from Pages Router
          familiarity to being comfortable building production-grade apps with
          the App Router.
        </p>
        <p>
          Writing things down forces me to understand them. If it&apos;s useful
          to you too, that&apos;s a bonus.
        </p>
      </div>

      <div className="mt-10 pt-8 border-t border-zinc-100">
        <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">
          Links
        </h2>
        <div className="space-y-2 text-sm">
          <a
            href="https://github.com/atypicalesper"
            className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub →
          </a>
        </div>
      </div>
    </div>
  );
}
