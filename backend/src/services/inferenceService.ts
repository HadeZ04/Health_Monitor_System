interface InferenceRequest {
  question: string;
  session_id?: string;
  max_new_tokens?: number;
  top_k?: number;
}

interface InferenceResponse {
  answer: string;
  draft?: string;
  confidence?: number;
  verdict?: string;
  citations?: string[];
  context_docs?: Array<{
    title: string;
    abstract: string;
    pmid: string;
    score: number;
    rank: number;
  }>;
  warning?: string | null;
}

const INFERENCE_API_URL =
  process.env.INFERENCE_API_URL ?? "http://localhost:8080";

export async function callInferenceAPI(
  request: InferenceRequest
): Promise<InferenceResponse> {
  const url = `${INFERENCE_API_URL}/v1/chat/completions`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: request.question,
        session_id: request.session_id || "default",
        max_new_tokens: request.max_new_tokens,
        top_k: request.top_k,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Inference API error: ${response.status} - ${errorText}`
      );
    }

    const data = (await response.json()) as InferenceResponse;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to call inference API: ${error.message}`);
    }
    throw new Error("Failed to call inference API: Unknown error");
  }
}

export async function checkInferenceHealth(): Promise<{
  status: string;
  model_id?: string;
}> {
  const url = `${INFERENCE_API_URL}/health`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return { status: "unavailable" };
    }

    const data = (await response.json()) as {
      status: string;
      model_id?: string;
    };
    return data;
  } catch (error) {
    return { status: "unavailable" };
  }
}

