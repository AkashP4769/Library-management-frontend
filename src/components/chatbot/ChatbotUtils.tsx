export async function streamChatResponse(
  prompt: string,
  onStreamData: (text: string, type?: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  const response = await fetch("http://127.0.0.1:8001/chat/stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: prompt }),
    signal,
  });

  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  if (!response.body) throw new Error("No response body");

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let done = false;
  let buffer = "";
  let accumulatedText = "";

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;
    buffer += decoder.decode(value, { stream: true });
    // parse lines from buffer (see next slide)
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (trimmed === "data:[DONE]") {
        break;
      }
      console.log(buffer);
      if (trimmed.startsWith("data:")) {
        try {
          const json = JSON.parse(trimmed.replace("data:", ""));
          if (json.content) {
            accumulatedText += json.content;
            onStreamData(accumulatedText, json.type);
          }
        } catch (err) {}
      }
    }
  }

  console.log(accumulatedText);
  return accumulatedText;
}
