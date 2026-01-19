import type { ChatbotConfig } from '../types/chatbot.types.js';

export const CHATBOT_CONFIG: ChatbotConfig = {
  qwen_api_url: process.env.QWEN_API_URL || 'http://localhost:8081',
  gemini_api_key: process.env.GEMINI_API_KEY || '',
  enable_pii_detection: true,
  enable_safety_gate: true,
  enable_audit_logging: true,
  max_context_length: 4000,
  session_timeout_minutes: 30,

  // Emergency keywords that trigger immediate safety response
  emergency_keywords: [
    // Vietnamese
    'đau ngực dữ dội',
    'khó thở',
    'ho ra máu',
    'đau đầu dữ dội',
    'liệt nửa người',
    'tê nửa người',
    'nói khó',
    'mất ý thức',
    'ngất',
    'co giật',
    'xuất huyết',
    'chảy máu nhiều',
    'tự tử',
    'muốn chết',
    'uống thuốc quá liều',
    // English (fallback)
    'chest pain',
    "can't breathe",
    'shortness of breath',
    'coughing blood',
    'suicide',
    'overdose',
    'seizure',
    'unconscious',
  ],

  // PII detection patterns (Vietnamese context)
  pii_patterns: {
    // 2-4 words, each starts with uppercase letter (Unicode-aware)
    PATIENT_NAME:
      /\b(?:[\p{Lu}][\p{L}]+(?:\s+[\p{Lu}][\p{L}]+){1,3})\b/gu,
    PHONE_NUMBER:
      /(?:\+84|84|0)(?:3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}\b/g,
    EMAIL: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    ID_NUMBER: /\b(?:\d{9}|\d{12})\b/g, // CCCD/CMND
    ADDRESS:
      /(?:số\s+\d+|đường|phường|quận|huyện|tỉnh|thành phố)\s+[\p{L}\d\s,./-]+/giu,
    DATE_OF_BIRTH:
      /\b(?:\d{1,2}[-/]\d{1,2}[-/]\d{4}|\d{1,2}\s+tháng\s+\d{1,2}\s+năm\s+\d{4})\b/gi,
    MEDICAL_RECORD_NUMBER: /\b(?:MRN|BN|HS)[-:]?\d{6,10}\b/gi,
  },
};

export const SYSTEM_PROMPTS = {
  MEDICAL_CONSULTANT: `Bạn là trợ lý y tế AI. Nhiệm vụ:
- Trả lời ngắn gọn, dễ hiểu, bằng tiếng Việt
- Không chẩn đoán xác định; chỉ cung cấp thông tin tham khảo
- Nếu thiếu dữ liệu hoặc có dấu hiệu nguy hiểm: khuyên đi khám/bác sĩ ngay
- Không bịa đặt thông tin; nếu không chắc hãy nói rõ`,

  EMERGENCY_RESPONSE: `Đây có thể là tình huống khẩn cấp. Nhiệm vụ:
- Ưu tiên an toàn người bệnh
- Hướng dẫn gọi cấp cứu 115 hoặc đến cơ sở y tế gần nhất
- Nêu các bước sơ cứu cơ bản nếu phù hợp
- Giọng nghiêm túc, trấn an`,

  DATA_ANALYSIS: `Phân tích dữ liệu y tế do người dùng cung cấp:
- So sánh với ngưỡng bình thường (nếu biết)
- Giải thích ý nghĩa lâm sàng
- Nêu khuyến nghị theo dõi/tái khám
- Không đưa ra chẩn đoán xác định`,

  GENERAL_EDUCATION: `Giải thích kiến thức y học phổ thông:
- Dùng ngôn ngữ đơn giản
- Nêu ví dụ, cảnh báo khi cần
- Khuyến khích phòng bệnh và đi khám khi có triệu chứng kéo dài/nặng`,
};

export const LOCAL_RESPONSES = {
  GREETING: [
    'Chào bạn! Mình là trợ lý y tế AI. Bạn muốn hỏi gì về sức khỏe?',
  ],

  GOODBYE: ['Tạm biệt! Chúc bạn nhiều sức khỏe.'],

  THANK_YOU: ['Rất vui được hỗ trợ bạn!'],

  OFF_TOPIC: [
    'Mình chỉ hỗ trợ các câu hỏi liên quan đến sức khỏe/y tế. Bạn đang quan tâm vấn đề gì?',
  ],

  NEED_LOGIN: [
    'Để xem thông tin cá nhân/hồ sơ y tế, bạn cần đăng nhập.',
  ],

  INSUFFICIENT_PERMISSION: [
    'Bạn không có quyền truy cập dữ liệu này. Vui lòng liên hệ quản trị viên.',
  ],
};

export const SAFETY_WARNINGS = {
  EMERGENCY_DETECTED: `CẢNH BÁO: Triệu chứng của bạn có thể nghiêm trọng.\nVui lòng gọi 115 hoặc đến cơ sở y tế gần nhất ngay.`,

  HIGH_RISK: `Khuyến cáo: Tình trạng có dấu hiệu nguy cơ.\nVui lòng đi khám/bác sĩ để được đánh giá trực tiếp.`,

  GENERAL_DISCLAIMER:
    'Lưu ý: Thông tin chỉ mang tính tham khảo, không thay thế tư vấn của bác sĩ.',
};

