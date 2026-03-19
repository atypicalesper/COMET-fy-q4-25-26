"use client";

import { useState, useRef, useCallback } from "react";
import { uploadFiles } from "@/lib/ragApi";
import type { UploadResult } from "@/lib/ragApi";

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ["pdf", "md", "txt", "csv", "html", "docx"];

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function validateFile(file: File): string | null {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!ext || !ALLOWED_EXTENSIONS.includes(ext))
    return `Unsupported type: .${ext}`;
  if (file.size > MAX_FILE_SIZE)
    return `Too large (${formatSize(file.size)}, max 50 MB)`;
  return null;
}

export default function FileUpload({
  onUploadComplete,
  collection,
}: {
  onUploadComplete?: () => void;
  collection?: string;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [labels, setLabels] = useState<Record<string, string>>({});
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<{
    isError: boolean;
    message: string;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;
    const fileArray = Array.from(newFiles);
    const errors: string[] = [];
    const valid = fileArray.filter((f) => {
      const err = validateFile(f);
      if (err) {
        errors.push(`${f.name}: ${err}`);
        return false;
      }
      return true;
    });
    if (errors.length)
      setStatus({ isError: true, message: errors.join(". ") });
    else setStatus(null);
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name));
      return [...prev, ...valid.filter((f) => !existing.has(f.name))];
    });
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const handleUpload = async () => {
    if (!files.length) return;
    setUploading(true);
    setStatus(null);
    try {
      const result = await uploadFiles(files, { labels, collection });
      const successCount = result.results.filter(
        (r: UploadResult) => r.status === "success"
      ).length;
      setStatus({
        isError: false,
        message: `${successCount} file${successCount !== 1 ? "s" : ""} uploaded and indexed`,
      });
      setFiles([]);
      setLabels({});
      onUploadComplete?.();
    } catch (err: unknown) {
      setStatus({
        isError: true,
        message: err instanceof Error ? err.message : "Upload failed",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.md,.txt,.csv,.html,.docx"
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = "";
        }}
        className="hidden"
        aria-hidden
        tabIndex={-1}
      />

      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        role="button"
        tabIndex={0}
        aria-label="Upload documents. Drop files here or click to browse."
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ")
            inputRef.current?.click();
        }}
        className={`border-2 border-dashed rounded-xl py-8 px-5 text-center cursor-pointer transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[#6c5ce7] focus-visible:outline-offset-2 ${
          isDragOver
            ? "border-[#6c5ce7] bg-[rgba(108,92,231,0.2)]"
            : "border-[#2a2a3a] hover:border-[#6c5ce7] hover:bg-[rgba(108,92,231,0.08)]"
        }`}
      >
        <div className="text-4xl mb-3 opacity-70 text-[#e8e8f0]">+</div>
        <p className="text-sm font-semibold text-[#e8e8f0] mb-1.5">
          Drop files or click to browse
        </p>
        <p className="text-xs text-[#8888a0]">PDF, MD, TXT, CSV, HTML, DOCX</p>
      </div>

      {files.length > 0 && (
        <ul
          role="list"
          aria-label="Selected files"
          className="mt-3 flex flex-col gap-2"
        >
          {files.map((file, i) => (
            <li
              key={file.name + i}
              role="listitem"
              className="px-3 py-2.5 bg-[#0a0a0f] border border-[#2a2a3a] rounded-lg text-[13px] flex flex-col gap-2"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <span className="text-[#e8e8f0] font-medium block truncate max-w-40">
                    {file.name}
                  </span>
                  <span className="text-[#555570] text-xs">{formatSize(file.size)}</span>
                </div>
                <button
                  onClick={() => {
                    setFiles((prev) => prev.filter((_, j) => j !== i));
                    setLabels((prev) => {
                      const next = { ...prev };
                      delete next[file.name];
                      return next;
                    });
                  }}
                  aria-label={`Remove ${file.name}`}
                  className="shrink-0 bg-transparent border-none text-[#555570] cursor-pointer text-lg leading-none px-1.5 py-0.5 rounded transition-all hover:text-[#ff6b6b] hover:bg-[rgba(255,107,107,0.1)]"
                >
                  ×
                </button>
              </div>
              <input
                type="text"
                placeholder="Label this document (optional)"
                value={labels[file.name] ?? ""}
                onChange={(e) =>
                  setLabels((prev) => ({ ...prev, [file.name]: e.target.value }))
                }
                className="w-full bg-[#12121a] border border-[#2a2a3a] rounded-md px-2.5 py-1.5 text-xs text-[#c0c0d8] placeholder-[#444460] outline-none focus:border-[#6c5ce7] transition-colors"
              />
            </li>
          ))}
        </ul>
      )}

      {files.length > 0 && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-3 w-full py-2.5 bg-[#6c5ce7] text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-all hover:bg-[#7c6ff7] hover:shadow-[0_0_20px_rgba(108,92,231,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading
            ? "Uploading & indexing..."
            : `Upload ${files.length} file${files.length !== 1 ? "s" : ""}`}
        </button>
      )}

      {status && (
        <div
          role="alert"
          className={`mt-2.5 px-3 py-2 rounded-lg text-[13px] border ${
            status.isError
              ? "bg-[rgba(255,107,107,0.1)] text-[#ff6b6b] border-[rgba(255,107,107,0.2)]"
              : "bg-[rgba(0,214,143,0.1)] text-[#00d68f] border-[rgba(0,214,143,0.2)]"
          }`}
        >
          {status.message}
        </div>
      )}
    </div>
  );
}
