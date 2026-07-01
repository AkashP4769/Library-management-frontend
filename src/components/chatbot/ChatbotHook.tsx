import { useCallback, useRef, useState } from "react";
import { streamChatResponse } from "./ChatbotUtils";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

export function useSSE() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (prompt: string) => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setError(null);
    setIsStreaming(true);

    setMessages((prev) => [
      ...prev,
      { role: "user", text: prompt },
      { role: "assistant", text: "" },
    ]);

    try {
      await streamChatResponse(
        prompt,
        (accumulated) => {
          setMessages((prev) => {
            const next = [...prev];
            next[next.length - 1] = { role: "assistant", text: accumulated };
            return next;
          });
        },
        abortRef.current.signal,
      );
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setError((e as Error).message);
      }
    } finally {
      setIsStreaming(false);
    }
  }, []);

  return { messages, error, isStreaming, sendMessage };
}
