"use client";

import { useState, useEffect } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import type { Message, Source } from "@/lib/types";

marked.use({ breaks: true, gfm: true });

function parseMarkdown(content: string): string {
  if (typeof window === "undefined") return "";
  let html = marked.parse(content) as string;
  html = html.replace(
    /\[Source (\d+)\]/g,
    '<sup class="rag-src-badge">$1</sup>'
  );
  return DOMPurify.sanitize(html, { ADD_ATTR: ["class"] });
}

function cleanFileName(src: Source): string {
  const name = src.file_name || src.source || "Unknown";
  return name.replace(/^.*[/\\]/, "");
}

function fileType(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    pdf: "PDF", docx: "Word", doc: "Word", txt: "Text",
    md: "Markdown", csv: "CSV", xlsx: "Excel", pptx: "PowerPoint",
  };
  return map[ext] ?? (ext.toUpperCase() || "Document");
}

function SourceCard({ source }: { source: Source }) {
  const [expanded, setExpanded] = useState(false);
  const name = cleanFileName(source);
  const type = fileType(name);
  const hasPage = source.page !== undefined && source.page !== "N/A" && source.page !== "";
  const preview = source.chunk_preview?.trim() ?? "";

  return (
    <div className="rounded-lg border border-[#22223a] bg-[#0c0c18] overflow-hidden text-xs transition-colors hover:border-[#2e2e4a]">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left"
      >
        <span className="shrink-0 w-5 h-5 rounded-md bg-[#6c5ce7]/15 text-[#6c5ce7] font-bold flex items-center justify-center text-[10px]">
          {source.index}
        </span>
        <span className="flex-1 min-w-0">
          <span className="text-[#c0c0d8] font-medium block truncate">{name}</span>
          <span className="text-[#555570]">
            {type}{hasPage ? ` · p. ${source.page}` : ""}
            {preview && (
              <span className="text-[#3e3e58] ml-1">
                — {preview.slice(0, 55)}{preview.length > 55 ? "…" : ""}
              </span>
            )}
          </span>
        </span>
        <span className="shrink-0 text-[#3e3e58] text-[10px]">{expanded ? "▲" : "▼"}</span>
      </button>
      {expanded && preview && (
        <div className="px-3 pb-3 pt-2 border-t border-[#1a1a2e]">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#3e3e58] mb-1.5">Excerpt</p>
          <p className="text-[#777790] leading-relaxed whitespace-pre-wrap">
            {preview}{preview.length >= 300 && "…"}
          </p>
        </div>
      )}
    </div>
  );
}

export default function ChatMessage({ message }: { message: Message }) {
  const { role, content, sources, isLoading, isError } = message;
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);
  const [html, setHtml] = useState("");

  useEffect(() => {
    if (!isUser && !isLoading && content) {
      setHtml(parseMarkdown(content));
    }
  }, [content, isUser, isLoading]);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(t);
  }, [copied]);

  if (isUser) {
    return (
      <div className="flex items-end justify-end gap-2.5" style={{ animation: "ragFadeIn 0.2s ease" }}>
        <div className="max-w-[70%] px-4 py-3 bg-[#6c5ce7] text-white rounded-2xl rounded-br-sm text-sm leading-relaxed whitespace-pre-wrap break-words">
          {content}
        </div>
        <span className="shrink-0 w-7 h-7 rounded-full bg-[#6c5ce7]/30 border border-[#6c5ce7]/50 text-[#a89cf7] text-xs font-bold flex items-center justify-center select-none">
          U
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2.5" style={{ animation: "ragFadeIn 0.2s ease" }}>
      {/* Avatar */}
      <span className="shrink-0 w-7 h-7 rounded-full bg-[#12121a] border border-[#2a2a3a] flex items-center justify-center mt-0.5">
        <span className="w-2 h-2 rounded-full bg-[#6c5ce7]" />
      </span>

      <div className="flex-1 min-w-0 max-w-[calc(100%-2.75rem)]">
        {/* Bubble */}
        <div className={`group relative rounded-2xl rounded-tl-sm text-sm leading-relaxed break-words ${
          isError
            ? "bg-[rgba(255,107,107,0.07)] border border-[rgba(255,107,107,0.25)] text-[#ff8a8a] px-4 py-3"
            : "bg-[#161622] border border-[#2a2a3a] text-[#e8e8f0] px-5 py-4"
        }`}>
          {isLoading ? (
            <div className="flex gap-1.5 py-0.5 items-center" aria-label="Thinking">
              {[0, 150, 300].map((delay) => (
                <span
                  key={delay}
                  className="w-2 h-2 bg-[#444460] rounded-full"
                  style={{ animation: "ragLoadingDot 1.4s ease-in-out infinite", animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          ) : isError ? (
            <p>{content.replace(/^Error:\s*/, "")}</p>
          ) : (
            <>
              <div className="prose-rag" dangerouslySetInnerHTML={{ __html: html }} />
              {/* Copy — top-right, visible on hover */}
              <button
                onClick={() => { navigator.clipboard.writeText(content); setCopied(true); }}
                aria-label="Copy response"
                title="Copy"
                className="absolute top-2.5 right-2.5 bg-[#0a0a0f] border border-[#2a2a3a] text-[#555570] w-6 h-6 rounded-md text-[11px] flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:border-[#6c5ce7] hover:text-[#6c5ce7]"
              >
                {copied ? "✓" : "⎘"}
              </button>
            </>
          )}
        </div>

        {/* Sources — outside the bubble */}
        {sources && sources.length > 0 && !isLoading && (
          <div className="mt-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#444460] mb-1.5 pl-1">
              {sources.length} Reference{sources.length > 1 ? "s" : ""}
            </p>
            <div className="flex flex-col gap-1">
              {sources.map((src) => (
                <SourceCard key={src.index} source={src} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
