import { useState, useCallback } from "react";
import { Message } from "@/types/chat";

interface UseWeatherAgentOptions {
  threadId: string;
}

export function useWeatherAgent({ threadId }: UseWeatherAgentOptions) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (
    messages: Array<{ role: string; content: string }>,
    onChunk: (chunk: string) => void,
    onComplete: (fullResponse: string) => void
  ) => {
    setIsStreaming(true);
    setError(null);
    let fullResponse = "";

    try {
      const response = await fetch("/api/weather-agent/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages,
          threadId,
          runId: "weatherAgent",
          maxRetries: 2,
          maxSteps: 5,
          temperature: 0.5,
          topP: 1,
          runtimeContext: {},
          resourceId: "weatherAgent"
        }),
      });

      if (!response.ok) {
        throw new Error(`Weather agent API responded with ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body available");
      }

      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;
        onChunk(chunk);
      }

      onComplete(fullResponse);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to communicate with weather agent";
      setError(errorMessage);
      console.error("Weather agent error:", err);
    } finally {
      setIsStreaming(false);
    }
  }, [threadId]);

  return {
    sendMessage,
    isStreaming,
    error,
  };
}
