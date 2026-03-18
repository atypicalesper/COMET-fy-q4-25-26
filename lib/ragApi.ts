const BASE =
  process.env.NEXT_PUBLIC_RAG_API_URL ?? "http://localhost:8000";

async function checkOk(res: Response, label: string): Promise<Response> {
  if (!res.ok) {
    let detail = "";
    try {
      detail = (await res.json()).error;
    } catch {
      /* no json body */
    }
    throw new Error(detail || `${label} failed (${res.status})`);
  }
  return res;
}

export interface UploadResult {
  file: string;
  status: "success" | "error" | "skipped";
  reason?: string;
  chunks_added?: number;
}

export interface QueryResult {
  answer: string;
  sources: Source[];
  model: string;
  latency_seconds: number;
  cached?: boolean;
}

export interface Source {
  index: number;
  source: string;
  file_name: string;
  page: string | number;
  chunk_preview: string;
}

export interface StatsResult {
  vectorstore: {
    total_documents: number;
    status?: string;
    model?: string;
  };
  cache: {
    hits: number;
    misses: number;
  };
}

export async function uploadFiles(
  files: File[]
): Promise<{ results: UploadResult[] }> {
  const formData = new FormData();
  for (const file of files) formData.append("files", file);
  const res = await checkOk(
    await fetch(`${BASE}/upload`, { method: "POST", body: formData }),
    "Upload"
  );
  return res.json();
}

export function queryRAGStream(
  question: string,
  strategy = "similarity",
  onToken: (token: string) => void
): { promise: Promise<void>; abort: () => void } {
  const controller = new AbortController();

  const promise = (async () => {
    const res = await checkOk(
      await fetch(`${BASE}/query/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, strategy }),
        signal: controller.signal,
      }),
      "Stream query"
    );

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let buf = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6);
        if (data === "[DONE]") return;
        if (data.startsWith("[ERROR]")) throw new Error(data.slice(8));
        onToken(data);
      }
    }
  })();

  return { promise, abort: () => controller.abort() };
}

export async function getStats(): Promise<StatsResult> {
  const res = await checkOk(await fetch(`${BASE}/stats`), "Stats");
  return res.json();
}
