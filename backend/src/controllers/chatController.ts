import type { Request, Response } from "express";
import { callInferenceAPI } from "../services/inferenceService.js";

interface ChatRequest {
  question: string;
  session_id?: string;
  max_new_tokens?: number;
  top_k?: number;
}

export const askChatbot = async (req: Request, res: Response) => {
  try {
    const { question, session_id, max_new_tokens, top_k } =
      req.body as ChatRequest;

    if (!question || typeof question !== "string" || question.trim().length === 0) {
      return res.status(400).json({
        error: "Question is required and must be a non-empty string",
      });
    }

    // Get user ID from JWT middleware for session tracking
    const userId = req.user?.id || "anonymous";
    const sessionId = session_id || `user-${userId}`;

    const result = await callInferenceAPI({
      question: question.trim(),
      session_id: sessionId,
      max_new_tokens: max_new_tokens,
      top_k: top_k,
    });

    res.json({
      success: true,
      reply: result.answer,
      confidence: result.confidence,
      verdict: result.verdict,
      citations: result.citations || [],
      sources: result.context_docs || [],
      warning: result.warning,
      session_id: sessionId,
    });
  } catch (error) {
    console.error("Chatbot error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";

    res.status(500).json({
      error: "Failed to get response from AI assistant",
      message: errorMessage,
    });
  }
};
