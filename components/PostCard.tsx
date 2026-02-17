import Link from "next/link";
import type { Post } from "@/lib/posts";

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="group py-6 border-b border-zinc-100 last:border-0">
      <div className="flex items-baseline justify-between gap-4 mb-2">
        <Link href={`/devlog/${post.slug}`}>
          <h2 className="font-medium text-zinc-900 group-hover:text-zinc-500 transition-colors">
            {post.title}
          </h2>
        </Link>
        <time
          dateTime={post.date}
          className="text-xs text-zinc-400 shrink-0"
        >
          {new Date(post.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </time>
      </div>
      <p className="text-sm text-zinc-500 leading-relaxed">{post.excerpt}</p>
      <div className="flex gap-2 mt-3">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 bg-zinc-100 text-zinc-500 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
