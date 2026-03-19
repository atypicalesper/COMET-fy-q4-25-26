"use client";

import { useState, useEffect } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import type { Message, Source } from "@/lib/types";

marked.use({ breaks: true, gfm: true });

function parseMarkdown(content: string): string {
  if (typeof window === "undefined") return "";
  let html = marked.parse(content) as string;
  // Replace [Source N] with styled superscript badges
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
  return map[ext] ?? ext.toUpperCase() || "Document";
}

function SourceCard({ source }: { source: Source }) {
  const [expanded, setExpanded] = useState(false);
  const name = cleanFileName(source);
  const type = fileType(name);
  const hasPage = source.page !== undefined && source.page !== "N/A" && source.page !== "";
  const preview = source.chunk_preview?.trim() ?? "";

  return (
    <div className="rounded-lg border border-[#2a2a3a] bg-[#0e0e1a] overflow-hidden text-xs">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-start gap-2.5 px-3 py-2.5 text-left hover:bg-[#161622] transition-colors"
      >
        <span className="shrink-0 w-5 h-5 rounded bg-[#6c5ce7]/20 text-[#6c5ce7] font-bold flex items-center justify-center text-[10px] mt-0.5">
          {source.index}
        </span>
        <span className="flex-1 min-w-0 flex flex-col gap-0.5">
          <span className="text-[#c0c0d8] font-semibold truncate leading-tight">{name}</span>
          <span className="text-[#555570] leading-tight">
            {type}{hasPage ? ` · page ${source.page}` : ""}
            {preview && (
              <span className="ml-1 text-[#444460]">— {preview.slice(0, 60)}{preview.length > 60 ? "…" : ""}</span>
            )}
          </span>
        </span>
        <span className="shrink-0 text-[#444460] ml-1 mt-0.5">{expanded ? "▲" : "▼"}</span>
      </button>
      {expanded && preview && (
        <div className="px-3 pb-3 pt-2 border-t border-[#1e1e2e]">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#444460] mb-1.5">Excerpt</p>
          <p className="text-[#8888a0] leading-relaxed">
            {preview}{preview.length >= 300 && "…"}
          </p>
        </div>
      )}
    </div>
  );
}

export default function ChatMessage({ message }: { message: Message }) {
  const { role, content, sources, isLoading } = message;
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

  return (
    <div
      className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
      style={{ animation: "ragFadeIn 0.25s ease" }}
    >
      <div className="group flex items-end gap-2 max-w-[75%] md:max-w-[90%]">
        <div
          className={`px-4.5 py-3.5 text-sm leading-relaxed wrap-break-word min-w-0 ${
            isUser
              ? "bg-[#6c5ce7] text-white rounded-xl rounded-br-sm whitespace-pre-wrap"
              : "bg-[#161622] text-[#e8e8f0] border border-[#2a2a3a] rounded-xl rounded-bl-sm"
          }`}
        >
          {isLoading ? (
            <div className="flex gap-1 py-1" aria-label="Thinking">
              {[0, 160, 320].map((delay) => (
                <span
                  key={delay}
                  className="w-1.75 h-1.75 bg-[#555570] rounded-full"
                  style={{
                    animation: "ragLoadingDot 1.4s ease-in-out infinite",
                    animationDelay: `${delay}ms`,
                  }}
                />
              ))}
            </div>
          ) : isUser ? (
            content
          ) : (
            <>
              <div
                className="prose-rag"
                dangerouslySetInnerHTML={{ __html: html }}
              />
              {sources && sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[#2a2a3a]">
                  <p className="text-[11px] font-semibold text-[#555570] uppercase tracking-[0.5px] mb-2">
                    {sources.length} Source{sources.length > 1 ? "s" : ""}
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {sources.map((src) => (
                      <SourceCard key={src.index} source={src} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        {!isUser && !isLoading && (
          <button
            onClick={() => {
              navigator.clipboard.writeText(content);
              setCopied(true);
            }}
            aria-label="Copy response"
            title="Copy"
            className="flex-shrink-0 bg-transparent border border-[#2a2a3a] text-[#555570] w-7 h-7 rounded-[6px] text-[13px] flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:border-[#6c5ce7] hover:text-[#6c5ce7]"
          >
            {copied ? "✓" : "⎘"}
          </button>
        )}
      </div>
    </div>
  );
}
