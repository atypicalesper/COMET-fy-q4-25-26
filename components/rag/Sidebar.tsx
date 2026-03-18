"use client";

import { useState, useEffect } from "react";
import { getStats } from "@/lib/ragApi";
import type { StatsResult } from "@/lib/ragApi";
import { useAuth } from "./AuthContext";
import FileUpload from "./FileUpload";

export default function Sidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<StatsResult | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = () => {
    setLoading(true);
    getStats()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const docCount = stats?.vectorstore?.total_documents ?? 0;
  const isLoaded =
    !!stats &&
    stats.vectorstore?.status !== "no vector store loaded" &&
    docCount > 0;

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[49] md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        role="complementary"
        aria-label="Sidebar"
        className={`w-[340px] min-w-[340px] bg-[#12121a] border-r border-[#2a2a3a] flex flex-col overflow-hidden transition-transform duration-[250ms] fixed md:static top-0 left-0 bottom-0 z-50 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="px-5 py-4 border-b border-[#2a2a3a]">
          <h1 className="text-xl font-bold text-[#e8e8f0] mb-3">
            RAG <span className="text-[#6c5ce7]">Chat</span>
          </h1>
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#e8e8f0] truncate">
                {user?.name}
              </p>
              <p className="text-xs text-[#555570] truncate">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="shrink-0 text-xs text-[#555570] border border-[#2a2a3a] px-2.5 py-1.5 rounded-lg hover:text-[#ff6b6b] hover:border-[rgba(255,107,107,0.4)] transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[1px] text-[#555570] mb-3">
              Upload Documents
            </h3>
            <FileUpload onUploadComplete={fetchStats} />
          </div>

          <div>
            <div className="flex items-center mb-3">
              <h3 className="text-[11px] font-semibold uppercase tracking-[1px] text-[#555570] flex-1">
                Knowledge Base
              </h3>
              <button
                onClick={fetchStats}
                aria-label="Refresh stats"
                className="bg-transparent border-none text-[#555570] cursor-pointer text-sm px-1.5 py-0.5 rounded transition-colors hover:text-[#6c5ce7]"
              >
                {loading ? "…" : "↻"}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: loading ? "–" : docCount, label: "Chunks indexed" },
                {
                  value: loading ? "–" : (stats?.cache?.hits ?? 0),
                  label: "Cache hits",
                },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="p-3 bg-[#0a0a0f] border border-[#2a2a3a] rounded-lg"
                >
                  <p className="text-xl font-bold text-[#6c5ce7]">{value}</p>
                  <p className="text-[11px] text-[#555570] mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[1px] text-[#555570] mb-3">
              Status
            </h3>
            <div className="space-y-1.5 text-[13px] text-[#8888a0]">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${isLoaded ? "bg-[#00d68f]" : "bg-[#ff6b6b]"}`}
                  aria-hidden
                />
                {isLoaded ? "Vector store loaded" : "No documents indexed"}
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${stats ? "bg-[#00d68f]" : "bg-[#ff6b6b]"}`}
                  aria-hidden
                />
                {stats
                  ? `Model: ${stats.vectorstore?.model || "connected"}`
                  : "Backend offline"}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
