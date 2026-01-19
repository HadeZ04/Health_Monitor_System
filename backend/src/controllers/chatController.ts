import type { Request, Response } from 'express';
import type { ChatbotResponse } from '../types/chatbot.types.js';
import { QwenRouterService } from '../services/qwenRouter.service';
import { PIISanitizationService } from '../services/piiSanitization.service';
import { MedicalDBService } from '../services/medicalDB.service';
import { GeminiService } from '../services/gemini.service';
import { SafetyGateService } from '../services/safetyGate.service';
import { AuditLogService } from '../services/auditLog.service';
import { LOCAL_RESPONSES } from '../config/chatbot.config.js';
import { AppError } from '../utils/errors.js';

interface ChatRequestBody {
  question: string;
  session_id?: string;
  language?: string;
  max_new_tokens?: number;
  top_k?: number;
}

const qwenRouter = new QwenRouterService();
const piiSanitizer = new PIISanitizationService();
const medicalDB = new MedicalDBService();
const geminiService = new GeminiService();
const safetyGate = new SafetyGateService();
const auditLog = new AuditLogService();

export const askChatbot = async (req: Request, res: Response) => {
  const startTime = Date.now();

  try {
    const { question, session_id } = req.body as ChatRequestBody;

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'BAD_REQUEST',
        message: 'Question is required and must be a non-empty string.',
      });
    }

    const userId = req.user?.id;
    const sessionId = session_id || `session-${Date.now()}`;
    const clientIP = req.ip || req.socket.remoteAddress;

    // STEP 1: Prompt injection detection
    const injectionCheck = piiSanitizer.detectPromptInjection(question);
    if (injectionCheck.detected) {
      await auditLog.logSafetyAlert(
        sessionId,
        userId,
        'HIGH',
        ['Prompt injection attempt detected'],
        clientIP
      );

      return res.status(400).json({
        success: false,
        error: 'INVALID_INPUT',
        message:
          'Câu hỏi có chứa mẫu không được phép xử lý. Vui lòng diễn đạt lại.',
      });
    }

    // STEP 2: Safety gate (emergency/high-risk detection)
    const safetyCheck = safetyGate.checkSafety(question);
    if (!safetyCheck.is_safe) {
      await auditLog.logSafetyAlert(
        sessionId,
        userId,
        safetyCheck.risk_level,
        safetyCheck.detected_issues,
        clientIP
      );

      if (safetyCheck.recommended_action === 'EMERGENCY') {
        const safetyResponse = safetyGate.generateSafetyResponse(safetyCheck);

        return res.json({
          success: true,
          reply: safetyResponse,
          intent: 'EMERGENCY',
          action_taken: 'EMERGENCY_RESPONSE',
          session_id: sessionId,
          metadata: {
            pii_removed: false,
            db_accessed: false,
            safety_level: safetyCheck.risk_level,
          },
        } satisfies ChatbotResponse);
      }
    }

    // STEP 3: Intent classification via local Qwen router
    const routerOutput = await qwenRouter.classifyIntent(question, undefined, userId);

    // STEP 4: Auth guard for personal data
    if (routerOutput.requires_auth && !userId) {
      await auditLog.logAuthFailure(
        sessionId,
        'Unauthenticated access to personal data',
        clientIP
      );

      return res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: LOCAL_RESPONSES.NEED_LOGIN[0] ?? 'Vui lòng đăng nhập để tiếp tục.',
      });
    }

    // STEP 5: Execute action
    let finalReply = '';
    let dbAccessed = false;
    let piiRemoved = false;
    let sources: string[] = [];
    let confidence = routerOutput.confidence;

    switch (routerOutput.action) {
      case 'REPLY_LOCALLY': {
        finalReply =
          routerOutput.local_reply_content || LOCAL_RESPONSES.GREETING[0] || '';
        break;
      }

      case 'SEARCH_DB': {
        if (!userId) {
          return res.status(401).json({
            success: false,
            error: 'UNAUTHORIZED',
            message: LOCAL_RESPONSES.NEED_LOGIN[0] ?? 'Vui lòng đăng nhập để tiếp tục.',
          });
        }

        const dbSpec = routerOutput.db_query_spec!;
        const dbResult = await medicalDB.query(dbSpec, userId);
        dbAccessed = true;

        await auditLog.logDatabaseAccess(
          sessionId,
          userId,
          dbSpec.target_collection,
          dbResult.metadata.count,
          clientIP
        );

        if (!dbResult.success || dbResult.data.length === 0) {
          finalReply = 'Không tìm thấy dữ liệu phù hợp trong hồ sơ của bạn.';
          break;
        }

        const sanitizedDB = piiSanitizer.sanitizeDBResult(dbResult.raw_data);
        const dbSummary = piiSanitizer.summarizeMedicalData(
          (sanitizedDB as any).sanitized,
          dbSpec.target_collection
        );
        piiRemoved = true;

        const geminiResponse = await geminiService.generateResponse({
          is_pii_removed: true,
          sanitized_user_prompt: question,
          system_instruction_hint: 'DATA_ANALYSIS',
          context_data: dbSummary,
        });

        await auditLog.logGeminiCall(sessionId, userId, question, true, clientIP);

        const validation = geminiService.validateResponse(geminiResponse.answer);
        finalReply = validation.isValid
          ? geminiResponse.answer
          : await geminiService.rewriteResponse(geminiResponse.answer, validation.issues);

        sources = geminiResponse.sources || [];
        confidence = geminiResponse.confidence || confidence;
        break;
      }

      case 'CALL_GEMINI': {
        const piiCheck = piiSanitizer.sanitizeText(question);
        if (piiCheck.has_pii) {
          await auditLog.logPIIDetection(
            sessionId,
            userId,
            piiCheck.detected_types,
            'User input',
            clientIP
          );
          piiRemoved = true;
        }

        const cleanedQuestion = piiCheck.has_pii ? piiCheck.sanitized_text : question;

        let systemHint =
          routerOutput.gemini_payload_spec?.system_instruction_hint ||
          'MEDICAL_CONSULTANT';

        if (routerOutput.intent === 'USER_INPUT_ANALYSIS') {
          systemHint = 'DATA_ANALYSIS';
        } else if (routerOutput.intent === 'GENERAL_MEDICAL_QA') {
          systemHint = 'GENERAL_EDUCATION';
        }

        const geminiResponse = await geminiService.generateResponse({
          is_pii_removed: piiCheck.has_pii,
          sanitized_user_prompt: cleanedQuestion,
          system_instruction_hint: systemHint,
        });

        await auditLog.logGeminiCall(
          sessionId,
          userId,
          question,
          piiCheck.has_pii,
          clientIP
        );

        const validation = geminiService.validateResponse(geminiResponse.answer);
        finalReply = validation.isValid
          ? geminiResponse.answer
          : await geminiService.rewriteResponse(geminiResponse.answer, validation.issues);

        if (safetyCheck.recommended_action === 'WARN') {
          finalReply = safetyGate.generateSafetyResponse(safetyCheck) + '\n\n' + finalReply;
        }

        sources = geminiResponse.sources || [];
        confidence = geminiResponse.confidence || confidence;
        break;
      }

      case 'CALL_ADMIN_TOOL': {
        finalReply = await handleAdminTool(routerOutput.tool_params);
        break;
      }

      case 'EMERGENCY_RESPONSE': {
        finalReply = safetyGate.generateSafetyResponse({
          ...safetyCheck,
          recommended_action: 'EMERGENCY',
          risk_level: 'CRITICAL',
          is_safe: false,
        });
        break;
      }

      default: {
        finalReply = 'Xin lỗi, mình chưa hiểu câu hỏi của bạn. Bạn có thể diễn đạt lại không?';
      }
    }

    // STEP 6: Output guard
    const outputSafety = safetyGate.validateAIResponse(finalReply);
    if (!outputSafety.isSafe) {
      finalReply =
        'Xin lỗi, mình không thể trả lời câu hỏi này một cách an toàn. Vui lòng tham khảo ý kiến bác sĩ.';
    }

    // STEP 7: Audit log
    await auditLog.logInteraction({
      session_id: sessionId,
      user_id: userId,
      action: `CHAT_${routerOutput.intent}`,
      db_accessed: dbAccessed,
      pii_detected: piiRemoved,
      safety_level: safetyCheck.risk_level,
      ip_address: clientIP,
    });

    const response: ChatbotResponse = {
      success: true,
      reply: finalReply,
      confidence,
      intent: routerOutput.intent,
      action_taken: routerOutput.action,
      sources,
      session_id: sessionId,
      metadata: {
        pii_removed: piiRemoved,
        db_accessed: dbAccessed,
        safety_level: safetyCheck.risk_level,
      },
    };

    const duration = Date.now() - startTime;
    console.log(`[CHAT] ${sessionId} completed in ${duration}ms (${routerOutput.intent})`);

    return res.json(response);
  } catch (error) {
    console.error('Chatbot error:', error);

    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const code = error instanceof AppError ? error.code : 'INTERNAL_SERVER_ERROR';

    const safeMessage =
      statusCode < 500
        ? error instanceof Error
          ? error.message
          : 'Request failed'
        : code === 'SERVICE_UNAVAILABLE'
          ? 'AI service is unavailable. Please try again later.'
          : code === 'BAD_GATEWAY'
            ? 'External AI provider is unavailable. Please try again later.'
            : 'Internal server error';

    return res.status(statusCode).json({
      success: false,
      error: code,
      message: safeMessage,
    });
  }
};

async function handleAdminTool(toolParams: any): Promise<string> {
  const toolName = toolParams?.tool_name;

  switch (toolName) {
    case 'booking_system':
      return [
        'Để đặt lịch khám, bạn có thể:',
        '1) Gọi hotline: 1900-xxxx',
        '2) Đặt online trên website bệnh viện',
        '3) Đến trực tiếp quầy tiếp nhận',
      ].join('\n');

    case 'price_list':
      return [
        'Bảng giá tham khảo:',
        '- Khám tổng quát: 200.000đ',
        '- Xét nghiệm máu: 150.000đ',
        '- Chụp X-quang: 300.000đ',
        '',
        'Vui lòng liên hệ 1900-xxxx để biết chi tiết.',
      ].join('\n');

    case 'hospital_info':
      return [
        'Thông tin bệnh viện:',
        '- Địa chỉ: 123 Đường ABC, Quận XYZ',
        '- Giờ làm việc: 7:00 - 17:00 (Thứ 2 - Thứ 7)',
        '- Hotline: 1900-xxxx',
      ].join('\n');

    default:
      return 'Xin lỗi, mình chưa thể xử lý yêu cầu này. Vui lòng liên hệ tổng đài: 1900-xxxx';
  }
}

