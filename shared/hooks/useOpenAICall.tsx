import { useState } from "react";

type UseOpenAICallResult = {
  result: string | null;
  loading: boolean;
  error: string | null;
  callLLM: (prompt: string) => Promise<void>;
};

export function useOpenAICall(): UseOpenAICallResult {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const callLLM = async (message: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (!res.ok) throw new Error("Failed to get response from LLM");
      const data = await res.json();
      setResult(data.result || "");
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, error, callLLM };
}