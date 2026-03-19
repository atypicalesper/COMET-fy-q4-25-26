export interface Source {
  index: number;
  source: string;
  file_name: string;
  page: string | number;
  chunk_preview: string;
}

export interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  isLoading?: boolean;
  isError?: boolean;
}
