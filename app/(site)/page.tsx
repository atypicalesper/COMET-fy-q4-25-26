import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";

export default function Home() {
  const posts = getAllPosts();
  const recentPosts = posts.slice(0, 3);

  return (
    <div>
      <section className="mb-16">
        <h1 className="text-2xl font-semibold text-zinc-900 mb-3">
          Tarun Singh
        </h1>
        <p className="text-zinc-500 leading-relaxed max-w-lg">
          Writing about what I&apos;m learning. Currently going deep on Next.js
          — App Router, server components, data fetching, and building things
          that actually work in production.
        </p>
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-2">
          <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
            Recent posts
          </h2>
          <Link
            href="/devlog"
            className="text-sm text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            all posts →
          </Link>
        </div>
        <div>
          {recentPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
