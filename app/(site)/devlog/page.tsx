import { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";

export const metadata: Metadata = {
  title: "Devlog",
  description: "All posts — weekly notes on learning and building.",
};

export default function DevlogPage() {
  const posts = getAllPosts();

  return (
    <div>
      <h1 className="text-xl font-semibold text-zinc-900 mb-1">Devlog</h1>
      <p className="text-sm text-zinc-400 mb-10">
        {posts.length} posts · weekly learning notes
      </p>
      <div>
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
