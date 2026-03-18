export default function DevlogLoading() {
  return (
    <div>
      <div className="h-7 w-24 bg-zinc-100 rounded mb-1 animate-pulse" />
      <div className="h-4 w-40 bg-zinc-100 rounded mb-10 animate-pulse" />
      {[...Array(4)].map((_, i) => (
        <div key={i} className="py-6 border-b border-zinc-100">
          <div className="flex justify-between mb-2">
            <div className="h-5 w-56 bg-zinc-100 rounded animate-pulse" />
            <div className="h-4 w-12 bg-zinc-100 rounded animate-pulse" />
          </div>
          <div className="h-4 w-full bg-zinc-100 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-zinc-100 rounded mt-1 animate-pulse" />
        </div>
      ))}
    </div>
  );
}
