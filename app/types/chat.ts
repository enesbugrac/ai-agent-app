export interface Message {
  _id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
  isLoading?: boolean;
  createdAt?: string;
}
