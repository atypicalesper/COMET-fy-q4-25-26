"use client";

import { useState, useMemo, useEffect } from "react";
import type { Message } from "./types";

function cleanSourcePath(src: string) {
  return src.replace(/^.*\/data\/documents\//, "").replace(/^.*[/\\]/, "");
}

function parseMarkdown(content: string): string {
  if (typeof window === "undefined") return "";
  // Dynamic import to avoid SSR issues
  const { marked } = require("marked");
  const DOMPurify = require("dompurify");
  marked.use({ breaks: true, gfm: true });
  return DOMPurify.sanitize(marked.parse(content) as string);
}

export default function ChatMessage({ message }: { message: Message }) {
  const { role, content, sources, isLoading } = message;
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);
  const [html, setHtml] = useState("");

  useMemo(() => {
    if (!isUser && !isLoading && content) {
      setHtml(parseMarkdown(content));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
          className={`px-[18px] py-[14px] text-sm leading-relaxed break-words min-w-0 ${
            isUser
              ? "bg-[#6c5ce7] text-white rounded-xl rounded-br-[4px] whitespace-pre-wrap"
              : "bg-[#161622] text-[#e8e8f0] border border-[#2a2a3a] rounded-xl rounded-bl-[4px]"
          }`}
        >
          {isLoading ? (
            <div className="flex gap-1 py-1" aria-label="Thinking">
              {[0, 160, 320].map((delay) => (
                <span
                  key={delay}
                  className="w-[7px] h-[7px] bg-[#555570] rounded-full"
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
                <div className="mt-2.5 pt-2.5 border-t border-[#2a2a3a]">
                  <p className="text-[11px] font-semibold text-[#555570] uppercase tracking-[0.5px] mb-1.5">
                    Sources
                  </p>
                  {sources.map((src, i) => (
                    <div
                      key={i}
                      title={src.source}
                      className="text-xs text-[#8888a0] px-2 py-1 bg-[#1a1a28] rounded mb-1 overflow-hidden text-ellipsis whitespace-nowrap"
                    >
                      {cleanSourcePath(src.source)}
                    </div>
                  ))}
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
