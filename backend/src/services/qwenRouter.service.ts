import type {
  DBCollectionType,
  DBQuerySpec,
  GeminiPayloadSpec,
  IntentType,
  QwenRouterOutput,
  TimeFrameType,
  ToolParams,
} from '../types/chatbot.types.js';
import { CHATBOT_CONFIG } from '../config/chatbot.config.js';
import { ServiceUnavailableError } from '../utils/errors.js';

type QwenHealthResponse = {
  status?: string;
  mode?: string;
  model?: string;
};

const INTENTS: ReadonlyArray<IntentType> = [
  'PERSONAL_DB_QUERY',
  'USER_INPUT_ANALYSIS',
  'GENERAL_MEDICAL_QA',
  'OPERATIONAL_ADMIN',
  'CONTEXT_FOLLOWUP',
  'OUT_OF_SCOPE',
  'EMERGENCY',
];

const ACTIONS: ReadonlyArray<QwenRouterOutput['action']> = [
  'SEARCH_DB',
  'CALL_GEMINI',
  'CALL_ADMIN_TOOL',
  'REPLY_LOCALLY',
  'EMERGENCY_RESPONSE',
];

const DB_COLLECTIONS: ReadonlyArray<DBCollectionType> = [
  'lab_results',
  'prescriptions',
  'visit_history',
  'allergies',
  'vital_signs',
  'medical_files',
  'all',
];

const TIME_FRAMES: ReadonlyArray<TimeFrameType> = [
  'latest',
  'last_week',
  'last_month',
  'last_year',
  'specific_date',
  'all',
];

const asString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const asNumber = (value: unknown): number | undefined => {
  if (typeof value !== 'number') return undefined;
  if (!Number.isFinite(value)) return undefined;
  return value;
};

const isIntent = (value: unknown): value is IntentType =>
  typeof value === 'string' && (INTENTS as ReadonlyArray<string>).includes(value);

const isAction = (value: unknown): value is QwenRouterOutput['action'] =>
  typeof value === 'string' && (ACTIONS as ReadonlyArray<string>).includes(value);

const isDBCollection = (value: unknown): value is DBCollectionType =>
  typeof value === 'string' &&
  (DB_COLLECTIONS as ReadonlyArray<string>).includes(value);

const isTimeFrame = (value: unknown): value is TimeFrameType =>
  typeof value === 'string' && (TIME_FRAMES as ReadonlyArray<string>).includes(value);

const fetchWithTimeout = async (
  url: string,
  init: RequestInit,
  timeoutMs: number
): Promise<Response> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
};

export class QwenRouterService {
  private readonly qwenApiUrl: string;
  private healthCheckPromise: Promise<void> | null = null;

  constructor() {
    this.qwenApiUrl = CHATBOT_CONFIG.qwen_api_url.replace(/\/+$/, '');
  }

  async classifyIntent(
    userInput: string,
    _conversationHistory?: Array<{ role: string; content: string }>,
    _userId?: string
  ): Promise<QwenRouterOutput> {
    const input = asString(userInput);
    if (!input) {
      throw new ServiceUnavailableError(
        'QwenRouterService: userInput must be a non-empty string'
      );
    }

    await this.ensureHealthy();

    const rawOutput = await this.callQwenRouter(input);
    return this.validateAndNormalize(rawOutput, input);
  }

  private async ensureHealthy(): Promise<void> {
    if (!this.healthCheckPromise) {
      this.healthCheckPromise = this.healthCheck().catch((error) => {
        this.healthCheckPromise = null;
        throw error;
      });
    }
    return this.healthCheckPromise;
  }

  private async healthCheck(): Promise<void> {
    const url = `${this.qwenApiUrl}/health`;

    let response: Response;
    try {
      response = await fetchWithTimeout(
        url,
        { method: 'GET', headers: { 'Content-Type': 'application/json' } },
        2500
      );
    } catch (error) {
      throw new ServiceUnavailableError('Qwen router unreachable', { url });
    }

    if (!response.ok) {
      throw new ServiceUnavailableError('Qwen router health check failed', {
        url,
        status: response.status,
      });
    }

    const data = (await response.json()) as QwenHealthResponse;
    if (data.status !== 'ok') {
      throw new ServiceUnavailableError(
        'Qwen router health check returned non-ok status',
        { url }
      );
    }

    if (data.mode !== 'model') {
      throw new ServiceUnavailableError('Qwen router must run in model mode', {
        url,
        mode: data.mode ?? 'unknown',
        model: data.model ?? 'unknown',
      });
    }
  }

  private async callQwenRouter(userInput: string): Promise<unknown> {
    const url = `${this.qwenApiUrl}/classify`;

    let response: Response;
    try {
      response = await fetchWithTimeout(
        url,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: userInput }),
        },
        15000
      );
    } catch (error) {
      throw new ServiceUnavailableError('Qwen router classify request failed', {
        url,
      });
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      const detail = errorText.length > 500 ? `${errorText.slice(0, 500)}…` : errorText;
      throw new ServiceUnavailableError('Qwen router classify failed', {
        url,
        status: response.status,
        detail: detail || undefined,
      });
    }

    return (await response.json()) as unknown;
  }

  private validateAndNormalize(raw: unknown, fallbackPrompt: string): QwenRouterOutput {
    if (!raw || typeof raw !== 'object') {
      throw new ServiceUnavailableError(
        'Qwen router returned invalid JSON (expected object)'
      );
    }

    const rawObj = raw as Record<string, unknown>;

    const intent = rawObj.intent;
    if (!isIntent(intent)) {
      throw new ServiceUnavailableError('Qwen router returned invalid intent');
    }

    const action = rawObj.action;
    if (!isAction(action)) {
      throw new ServiceUnavailableError('Qwen router returned invalid action');
    }

    const confidenceRaw = asNumber(rawObj.confidence);
    const confidence = confidenceRaw === undefined ? 0.5 : Math.max(0, Math.min(1, confidenceRaw));

    const detectedPii = Array.isArray(rawObj.detected_pii)
      ? rawObj.detected_pii.filter((x): x is string => typeof x === 'string')
      : [];

    const safetyFlags = Array.isArray(rawObj.safety_flags)
      ? rawObj.safety_flags.filter((x): x is string => typeof x === 'string')
      : [];

    const requiresAuth =
      action === 'SEARCH_DB' ? true : typeof rawObj.requires_auth === 'boolean' ? rawObj.requires_auth : false;

    const output: QwenRouterOutput = {
      intent,
      action,
      confidence,
      detected_pii: detectedPii,
      safety_flags: safetyFlags,
      requires_auth: requiresAuth,
    };

    if (action === 'SEARCH_DB') {
      output.db_query_spec = this.parseDBQuerySpec(rawObj.db_query_spec);
    }

    if (action === 'CALL_GEMINI') {
      output.gemini_payload_spec = this.parseGeminiSpec(rawObj.gemini_payload_spec, fallbackPrompt);
    }

    if (action === 'CALL_ADMIN_TOOL') {
      output.tool_params = this.parseToolParams(rawObj.tool_params);
    }

    if (action === 'REPLY_LOCALLY') {
      output.local_reply_content = asString(rawObj.local_reply_content);
    }

    return output;
  }

  private parseDBQuerySpec(value: unknown): DBQuerySpec {
    if (!value || typeof value !== 'object') {
      throw new ServiceUnavailableError(
        'Qwen router returned SEARCH_DB without db_query_spec'
      );
    }

    const obj = value as Record<string, unknown>;
    const targetCollection = obj.target_collection;
    if (!isDBCollection(targetCollection)) {
      throw new ServiceUnavailableError(
        'Qwen router returned invalid db_query_spec.target_collection'
      );
    }

    const timeFrame = obj.time_frame;
    if (!isTimeFrame(timeFrame)) {
      throw new ServiceUnavailableError(
        'Qwen router returned invalid db_query_spec.time_frame'
      );
    }

    const keywords = Array.isArray(obj.keywords)
      ? obj.keywords.filter((x): x is string => typeof x === 'string' && x.trim().length > 0)
      : [];

    const specificDate = asString(obj.specific_date);
    const limitRaw = asNumber(obj.limit);
    const limit = limitRaw !== undefined ? Math.max(1, Math.min(50, Math.floor(limitRaw))) : undefined;

    return {
      target_collection: targetCollection,
      time_frame: timeFrame,
      keywords,
      ...(specificDate ? { specific_date: specificDate } : {}),
      ...(limit ? { limit } : {}),
    };
  }

  private parseGeminiSpec(value: unknown, fallbackPrompt: string): GeminiPayloadSpec {
    if (!value || typeof value !== 'object') {
      return {
        is_pii_removed: false,
        sanitized_user_prompt: fallbackPrompt,
        system_instruction_hint: 'MEDICAL_CONSULTANT',
      };
    }

    const obj = value as Record<string, unknown>;
    const isPiiRemoved =
      typeof obj.is_pii_removed === 'boolean' ? obj.is_pii_removed : false;
    const sanitizedUserPrompt = asString(obj.sanitized_user_prompt) ?? fallbackPrompt;
    const systemHint = asString(obj.system_instruction_hint) ?? 'MEDICAL_CONSULTANT';
    const contextData = asString(obj.context_data);
    const temperature = asNumber(obj.temperature);

    return {
      is_pii_removed: isPiiRemoved,
      sanitized_user_prompt: sanitizedUserPrompt,
      system_instruction_hint: systemHint,
      ...(contextData ? { context_data: contextData } : {}),
      ...(temperature !== undefined ? { temperature } : {}),
    };
  }

  private parseToolParams(value: unknown): ToolParams {
    if (!value || typeof value !== 'object') {
      throw new ServiceUnavailableError(
        'Qwen router returned CALL_ADMIN_TOOL without tool_params'
      );
    }

    const obj = value as Record<string, unknown>;
    const toolName = asString(obj.tool_name);
    if (!toolName) {
      throw new ServiceUnavailableError(
        'Qwen router returned invalid tool_params.tool_name'
      );
    }

    const toolArgs =
      obj.tool_args && typeof obj.tool_args === 'object'
        ? (obj.tool_args as Record<string, any>)
        : {};

    return {
      tool_name: toolName as ToolParams['tool_name'],
      tool_args: toolArgs,
    };
  }
}
