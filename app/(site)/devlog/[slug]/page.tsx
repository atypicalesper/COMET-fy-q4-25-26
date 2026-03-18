import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getPostSlugs } from "@/lib/posts";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not Found" };

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  return (
    <article>
      <Link
        href="/devlog"
        className="text-sm text-zinc-400 hover:text-zinc-900 transition-colors mb-8 inline-block"
      >
        ← back
      </Link>

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs px-2 py-0.5 bg-zinc-100 text-zinc-500 rounded-full">
            Week {post.week}
          </span>
          <time dateTime={post.date} className="text-sm text-zinc-400">
            {new Date(post.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </time>
        </div>
        <h1 className="text-2xl font-semibold text-zinc-900 mb-3">
          {post.title}
        </h1>
        <p className="text-zinc-500">{post.excerpt}</p>
        <div className="flex gap-2 mt-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 bg-zinc-100 text-zinc-500 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div
        className="prose prose-zinc prose-sm max-w-none
          prose-headings:font-semibold prose-headings:text-zinc-900
          prose-a:text-zinc-900 prose-a:underline
          prose-code:bg-zinc-100 prose-code:px-1 prose-code:rounded
          prose-pre:bg-zinc-950 prose-pre:text-zinc-100"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
      />
    </article>
  );
}

// Simple markdown renderer — no extra deps
function renderMarkdown(md: string): string {
  return md
    .trim()
    .replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
      const escaped = code
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      return `<pre><code class="language-${lang}">${escaped}</code></pre>`;
    })
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^\*\*(.+)\*\*$/gm, "<strong>$1</strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^\| (.+) \|$/gm, (_, row) => {
      const cells = row.split(" | ");
      return `<tr>${cells.map((c: string) => `<td>${c}</td>`).join("")}</tr>`;
    })
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[hpuolt])/gm, "")
    .replace(/^(.+)$/gm, (line) => {
      if (/^<[hpuolpret]/.test(line)) return line;
      return `<p>${line}</p>`;
    });
}
