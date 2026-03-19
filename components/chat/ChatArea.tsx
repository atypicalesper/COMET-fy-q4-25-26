"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { queryRAGStream } from "@/lib/ragApi";
import type { Message } from "@/lib/types";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

const SUGGESTIONS = [
  "What is the refund policy?",
  "Summarize the key topics",
  "What services are offered?",
];

export default function ChatArea({ userId, collection }: { userId: string; collection?: string }) {
  const storageKey = `rag_chat_${userId}`;
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState("similarity");
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<(() => void) | null>(null);

  // Load this user's history from localStorage after mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved).filter((m: Message) => !m.isLoading);
        if (parsed.length > 0) setMessages(parsed);
      }
    } catch {
      /* ignore */
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(messages));
      } catch {
        /* ignore */
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [messages, storageKey]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      const streamId = Date.now();
      const userMsg: Message = { id: streamId - 1, role: "user", content: text };
      const aiMsg: Message = {
        id: streamId,
        role: "assistant",
        content: "",
        isLoading: true,
      };
      setMessages((prev) => [...prev, userMsg, aiMsg]);
      setLoading(true);

      const { promise, abort } = queryRAGStream(
        text,
        strategy,
        (token) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === streamId
                ? { ...m, content: m.content + token, isLoading: false }
                : m
            )
          );
        },
        (sources) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === streamId ? { ...m, sources } : m))
          );
        },
        collection || undefined
      );
      abortRef.current = abort;

      try {
        await promise;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamId
              ? {
                  ...m,
                  isLoading: false,
                  content: m.content || "No answer returned.",
                }
              : m
          )
        );
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamId
              ? {
                  ...m,
                  isLoading: false,
                  content: `Error: ${err instanceof Error ? err.message : "Unknown error"}`,
                  isError: true,
                }
              : m
          )
        );
      } finally {
        setLoading(false);
        abortRef.current = null;
      }
    },
    [strategy, collection]
  );

  const clearChat = () => setMessages([]);

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <div className="px-6 py-4 border-b border-[#2a2a3a] bg-[#12121a] flex items-center justify-between gap-3 md:px-6 pl-18 md:pl-6">
        <h2 className="text-[15px] font-semibold text-[#e8e8f0]">Chat</h2>
        <div className="flex items-center gap-2">
          <select
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
            aria-label="Search strategy"
            className="bg-[#0a0a0f] text-[#8888a0] border border-[#2a2a3a] rounded-lg px-2 py-1.25 text-xs cursor-pointer outline-none focus-visible:border-[#6c5ce7]"
          >
            <option value="similarity">Similarity</option>
            <option value="mmr">MMR (diverse)</option>
          </select>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              aria-label="Clear chat"
              className="border border-[#2a2a3a] text-[#8888a0] px-3 py-1.25 rounded-lg text-xs cursor-pointer transition-all hover:border-[#555570] hover:text-[#e8e8f0]"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
          <p className="text-lg font-semibold text-[#8888a0] mb-2">
            Ask anything about your documents
          </p>
          <p className="text-sm text-[#555570] max-w-75 leading-relaxed">
            Upload files in the sidebar, then ask questions. Answers are
            grounded in your uploaded content.
          </p>
          <div className="flex flex-wrap gap-2 mt-5 justify-center">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="bg-[#12121a] border border-[#2a2a3a] text-[#8888a0] px-4 py-2 rounded-full text-sm cursor-pointer transition-all hover:border-[#6c5ce7] hover:text-[#6c5ce7] hover:bg-[rgba(108,92,231,0.15)]"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div
          role="log"
          aria-label="Chat messages"
          aria-live="polite"
          className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4"
        >
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          <div ref={bottomRef} />
        </div>
      )}

      <ChatInput onSend={sendMessage} disabled={loading} />
    </div>
  );
}
