export interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  sources?: Array<{ source: string; file_name: string }>;
  isLoading?: boolean;
  isError?: boolean;
}
