import { Router } from 'express';
import { askChatbot } from '../controllers/chatController';
import { jwtMiddleware } from '../middleware/auth';
import { CHATBOT_CONFIG } from '../config/chatbot.config.js';

export const chatbotRouter = Router();

chatbotRouter.post('/ask', jwtMiddleware, askChatbot);

// Health check endpoint (no auth required for monitoring)
chatbotRouter.get('/health', async (_req, res) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2000);

  try {
    const qwenBaseUrl = CHATBOT_CONFIG.qwen_api_url.replace(/\/+$/, '');
    const qwenUrl = `${qwenBaseUrl}/health`;

    const qwenResponse = await fetch(qwenUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
    });

    type QwenHealth = { status?: string; mode?: string; model?: string; [k: string]: unknown };
    const qwenHealth: QwenHealth = qwenResponse.ok
      ? ((await qwenResponse.json()) as QwenHealth)
      : { status: 'unavailable' };

    const geminiConfigured =
      typeof CHATBOT_CONFIG.gemini_api_key === 'string' &&
      CHATBOT_CONFIG.gemini_api_key.trim().length > 0;

    const qwenOk = qwenHealth.status === 'ok' && qwenHealth.mode === 'model';
    const status = qwenOk ? (geminiConfigured ? 'ok' : 'degraded') : 'unavailable';

    return res.status(status === 'unavailable' ? 503 : 200).json({
      status,
      qwen: qwenHealth,
      gemini: { configured: geminiConfigured },
      timestamp: new Date().toISOString(),
    });
  } catch (_error) {
    const geminiConfigured =
      typeof CHATBOT_CONFIG.gemini_api_key === 'string' &&
      CHATBOT_CONFIG.gemini_api_key.trim().length > 0;

    return res.status(503).json({
      status: 'unavailable',
      qwen: { status: 'unavailable' },
      gemini: { configured: geminiConfigured },
      timestamp: new Date().toISOString(),
    });
  } finally {
    clearTimeout(timeout);
  }
});
