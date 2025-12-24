import type { GeminiPayloadSpec, GeminiResponse } from '../types/chatbot.types.js';
import { CHATBOT_CONFIG, SYSTEM_PROMPTS } from '../config/chatbot.config.js';
import { BadGatewayError, ServiceUnavailableError } from '../utils/errors.js';

type GeminiRawResponse = any;

export class GeminiService {
  private readonly apiKey: string;
  private readonly apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
  private readonly model = 'gemini-1.5-flash-latest';

  constructor() {
    this.apiKey = CHATBOT_CONFIG.gemini_api_key;
  }

  async generateResponse(spec: GeminiPayloadSpec): Promise<GeminiResponse> {
    if (!this.apiKey || this.apiKey.trim().length === 0) {
      throw new ServiceUnavailableError('Gemini API key not configured');
    }

    const systemInstruction = this.getSystemInstruction(spec.system_instruction_hint);
    const userPrompt = this.buildUserPrompt(spec);

    const response = await this.callGeminiAPI(
      systemInstruction,
      userPrompt,
      spec.temperature
    );

    return {
      answer: response.text,
      confidence: response.confidence,
      sources: response.sources,
      warning: this.getWarning(spec),
    };
  }

  private async callGeminiAPI(
    systemInstruction: string,
    userPrompt: string,
    temperature: number = 0.7
  ): Promise<{ text: string; confidence?: number; sources?: string[] }> {
    const url = `${this.apiUrl}/${this.model}:generateContent?key=${this.apiKey}`;

    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemInstruction}\n\n${userPrompt}` }],
            },
          ],
          generationConfig: {
            temperature,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          ],
        }),
      });
    } catch (error) {
      throw new BadGatewayError('Gemini API call failed');
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new BadGatewayError('Gemini API error', {
        status: response.status,
        detail: errorText.length > 500 ? `${errorText.slice(0, 500)}…` : errorText,
      });
    }

    const data = (await response.json()) as GeminiRawResponse;
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!text) {
      throw new BadGatewayError('Empty response from Gemini');
    }

    return {
      text,
      confidence: this.calculateConfidence(data),
      sources: this.extractSources(text),
    };
  }

  private getSystemInstruction(hint: string): string {
    const normalized = (hint || '').toUpperCase();

    if (normalized.includes('EMERGENCY')) return SYSTEM_PROMPTS.EMERGENCY_RESPONSE;
    if (normalized.includes('DATA_ANALYSIS')) return SYSTEM_PROMPTS.DATA_ANALYSIS;
    if (normalized.includes('GENERAL_EDUCATION')) return SYSTEM_PROMPTS.GENERAL_EDUCATION;

    return SYSTEM_PROMPTS.MEDICAL_CONSULTANT;
  }

  private buildUserPrompt(spec: GeminiPayloadSpec): string {
    const parts: string[] = [];

    if (spec.context_data) {
      parts.push('**Dữ liệu y tế có sẵn (đã được làm sạch):**');
      parts.push(spec.context_data);
      parts.push('');
    }

    parts.push('**Câu hỏi:**');
    parts.push(spec.sanitized_user_prompt);

    if (spec.is_pii_removed) {
      parts.push('');
      parts.push(
        '*Lưu ý: Dữ liệu ở trên đã được ẩn thông tin định danh. Không được suy đoán hoặc thêm thông tin cá nhân.*'
      );
    }

    return parts.join('\n');
  }

  private calculateConfidence(data: GeminiRawResponse): number {
    const safetyRatings = data?.candidates?.[0]?.safetyRatings || [];
    const hasConcerns = Array.isArray(safetyRatings)
      ? safetyRatings.some((rating: any) => rating?.probability && rating.probability !== 'NEGLIGIBLE')
      : false;

    if (hasConcerns) return 0.7;
    if (data?.candidates?.[0]?.finishReason === 'SAFETY') return 0.5;
    return 0.9;
  }

  private extractSources(text: string): string[] {
    const sources: string[] = [];
    const citationPattern = /\[(\d+)\]/g;

    for (const match of text.matchAll(citationPattern)) {
      const citation = match[1];
      if (citation && !sources.includes(citation)) sources.push(citation);
    }

    return sources;
  }

  private getWarning(spec: GeminiPayloadSpec): string {
    const hint = (spec.system_instruction_hint || '').toUpperCase();

    if (hint.includes('EMERGENCY')) {
      return 'CẢNH BÁO: Nếu đây là tình huống khẩn cấp, vui lòng gọi 115 hoặc đến cơ sở y tế gần nhất ngay.';
    }

    if (hint.includes('DATA_ANALYSIS')) {
      return 'Lưu ý: Phân tích dựa trên dữ liệu bạn cung cấp, chỉ mang tính tham khảo. Hãy tham khảo ý kiến bác sĩ.';
    }

    return 'Lưu ý: Thông tin chỉ mang tính tham khảo, không thay thế tư vấn của bác sĩ.';
  }

  validateResponse(response: string): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];

    const piiPatterns = [
      /\b\d{9,12}\b/, // ID numbers
      /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/, // Phone numbers
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Emails
    ];

    if (piiPatterns.some((pattern) => pattern.test(response))) {
      issues.push('Potential PII detected in response');
    }

    const dangerousPhrases = [
      /bạn chắc chắn bị/i,
      /you definitely have/i,
      /chẩn đoán chính xác là/i,
      /diagnosis is definitely/i,
    ];

    if (dangerousPhrases.some((pattern) => pattern.test(response))) {
      issues.push('Overly confident diagnostic statement');
    }

    return { isValid: issues.length === 0, issues };
  }

  async rewriteResponse(originalResponse: string, issues: string[]): Promise<string> {
    const rewritePrompt = [
      `Câu trả lời sau có vấn đề: ${issues.join(', ')}`,
      '',
      'Câu trả lời gốc:',
      originalResponse,
      '',
      'Hãy viết lại câu trả lời để:',
      '1) Không chứa thông tin định danh cá nhân',
      '2) Không chẩn đoán xác định',
      '3) Nhắc người dùng tham khảo ý kiến bác sĩ khi cần',
      '4) Giữ nội dung y khoa an toàn và đúng',
      '',
      'Câu trả lời mới:',
    ].join('\n');

    try {
      const response = await this.callGeminiAPI(
        SYSTEM_PROMPTS.MEDICAL_CONSULTANT,
        rewritePrompt,
        0.5
      );
      return response.text;
    } catch (_error) {
      return 'Mình không thể trả lời câu hỏi này một cách an toàn/chính xác. Vui lòng tham khảo ý kiến bác sĩ.';
    }
  }

  async healthCheck(): Promise<boolean> {
    if (!this.apiKey || this.apiKey.trim().length === 0) return false;

    try {
      const response = await this.callGeminiAPI(
        'You are a test assistant.',
        "Say 'OK' if you're working.",
        0.1
      );
      return response.text.toLowerCase().includes('ok');
    } catch (_error) {
      return false;
    }
  }
}

