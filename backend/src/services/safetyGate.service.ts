import type { SafetyCheckResult } from '../types/chatbot.types.js';
import { CHATBOT_CONFIG, SAFETY_WARNINGS } from '../config/chatbot.config.js';

export class SafetyGateService {
  checkSafety(userInput: string): SafetyCheckResult {
    const input = userInput.toLowerCase();

    // Priority 1: Emergency keywords
    const emergencyCheck = this.checkEmergencyKeywords(input);
    if (emergencyCheck.detected) {
      return {
        is_safe: false,
        risk_level: 'CRITICAL',
        detected_issues: emergencyCheck.keywords,
        recommended_action: 'EMERGENCY',
        emergency_keywords: emergencyCheck.keywords,
      };
    }

    // Priority 2: Self-harm / suicide indicators
    if (this.checkSelfHarm(input)) {
      return {
        is_safe: false,
        risk_level: 'CRITICAL',
        detected_issues: ['Self-harm indicators'],
        recommended_action: 'EMERGENCY',
      };
    }

    // Priority 3: High-risk symptoms
    const highRisk = this.checkHighRiskSymptoms(input);
    if (highRisk.detected) {
      return {
        is_safe: false,
        risk_level: 'HIGH',
        detected_issues: highRisk.symptoms,
        recommended_action: 'WARN',
      };
    }

    // Priority 4: Drug safety
    const drugRisk = this.checkDrugSafety(input);
    if (drugRisk.detected) {
      return {
        is_safe: false,
        risk_level: 'MEDIUM',
        detected_issues: drugRisk.concerns,
        recommended_action: 'WARN',
      };
    }

    // Priority 5: Special populations
    const specialPop = this.checkSpecialPopulations(input);
    if (specialPop.detected) {
      return {
        is_safe: false,
        risk_level: 'MEDIUM',
        detected_issues: specialPop.concerns,
        recommended_action: 'WARN',
      };
    }

    return {
      is_safe: true,
      risk_level: 'LOW',
      detected_issues: [],
      recommended_action: 'PROCEED',
    };
  }

  private checkEmergencyKeywords(input: string): { detected: boolean; keywords: string[] } {
    const detected: string[] = [];

    for (const keyword of CHATBOT_CONFIG.emergency_keywords) {
      if (input.includes(keyword.toLowerCase())) detected.push(keyword);
    }

    return { detected: detected.length > 0, keywords: detected };
  }

  private checkSelfHarm(input: string): boolean {
    const keywords = [
      // Vietnamese
      'tự tử',
      'muốn chết',
      'kết thúc cuộc đời',
      'không muốn sống',
      'tự làm hại',
      'cắt tay',
      // English
      'suicide',
      'kill myself',
      'end my life',
      'want to die',
      'self harm',
    ];

    return keywords.some((k) => input.includes(k));
  }

  private checkHighRiskSymptoms(input: string): { detected: boolean; symptoms: string[] } {
    const patterns: Array<{ pattern: RegExp; symptom: string }> = [
      { pattern: /(đau|pain).{0,20}(ngực|chest)/i, symptom: 'Chest pain / Đau ngực' },
      { pattern: /(khó thở|difficulty).{0,10}(thở|breathing)?/i, symptom: 'Shortness of breath / Khó thở' },
      { pattern: /(ho).{0,10}(ra máu|máu|blood)/i, symptom: 'Coughing blood / Ho ra máu' },
      { pattern: /(đau đầu).{0,15}(dữ dội|severe)/i, symptom: 'Severe headache / Đau đầu dữ dội' },
      { pattern: /(liệt|paralysis|numb).{0,20}(nửa người|half|tay|chân)/i, symptom: 'Stroke-like symptoms / Dấu hiệu đột quỵ' },
      { pattern: /(nói).{0,10}(khó|không rõ)|slurred speech/i, symptom: 'Speech difficulty / Nói khó' },
      { pattern: /(mất ý thức|unconscious|ngất)/i, symptom: 'Loss of consciousness / Mất ý thức' },
      { pattern: /(co giật|seizure|convulsion)/i, symptom: 'Seizure / Co giật' },
      { pattern: /(chảy máu|xuất huyết|bleeding).{0,10}(nhiều|ồ ạt|severe)?/i, symptom: 'Severe bleeding / Chảy máu nhiều' },
    ];

    const symptoms: string[] = [];
    for (const entry of patterns) {
      if (entry.pattern.test(input)) symptoms.push(entry.symptom);
    }

    return { detected: symptoms.length > 0, symptoms };
  }

  private checkDrugSafety(input: string): { detected: boolean; concerns: string[] } {
    const patterns: Array<{ pattern: RegExp; concern: string }> = [
      { pattern: /(quá liều|overdose|uống quá liều)/i, concern: 'Possible overdose / Nghi quá liều' },
      { pattern: /(uống nhầm|accidental ingestion)/i, concern: 'Accidental ingestion / Uống nhầm' },
      { pattern: /(tăng liều|double dose|gấp đôi liều)/i, concern: 'Dose escalation / Tăng liều' },
      { pattern: /(dị ứng thuốc|allergic reaction|phản ứng dị ứng)/i, concern: 'Possible drug allergy / Nghi dị ứng thuốc' },
    ];

    const concerns: string[] = [];
    for (const entry of patterns) {
      if (entry.pattern.test(input)) concerns.push(entry.concern);
    }
    return { detected: concerns.length > 0, concerns };
  }

  private checkSpecialPopulations(input: string): { detected: boolean; concerns: string[] } {
    const concerns: string[] = [];

    if (/(thai|pregnant|pregnancy|mang thai|có bầu)/i.test(input)) {
      concerns.push('Pregnancy / Mang thai: cần tư vấn chuyên khoa');
    }

    if (/(trẻ em|child|children|em bé|sơ sinh|newborn|infant)/i.test(input)) {
      concerns.push('Pediatric / Trẻ em: cần tư vấn nhi khoa');
    }

    if (/(người già|elderly|senior|ông bà)/i.test(input)) {
      concerns.push('Elderly / Người cao tuổi: cần đánh giá trực tiếp');
    }

    return { detected: concerns.length > 0, concerns };
  }

  generateSafetyResponse(checkResult: SafetyCheckResult): string {
    if (checkResult.recommended_action === 'EMERGENCY') {
      return this.getEmergencyResponse(checkResult);
    }

    if (checkResult.recommended_action === 'WARN') {
      return this.getWarningResponse(checkResult);
    }

    return '';
  }

  private getEmergencyResponse(checkResult: SafetyCheckResult): string {
    const lines: string[] = [
      '**CẢNH BÁO KHẨN CẤP**',
      '',
      SAFETY_WARNINGS.EMERGENCY_DETECTED,
      '',
      '- Gọi **115** ngay (cấp cứu) hoặc đến cơ sở y tế gần nhất.',
      '- Nếu có người bên cạnh: nhờ hỗ trợ và theo dõi tình trạng.',
      '- Không trì hoãn hoặc tự điều trị tại nhà.',
    ];

    if (checkResult.emergency_keywords?.length) {
      lines.push('');
      lines.push(`Triệu chứng phát hiện: ${checkResult.emergency_keywords.join(', ')}`);
    }

    return lines.join('\n');
  }

  private getWarningResponse(checkResult: SafetyCheckResult): string {
    const lines: string[] = [
      '**CẢNH BÁO Y TẾ**',
      '',
      SAFETY_WARNINGS.HIGH_RISK,
      '',
    ];

    if (checkResult.detected_issues.length > 0) {
      lines.push('Dấu hiệu phát hiện:');
      for (const issue of checkResult.detected_issues) lines.push(`- ${issue}`);
      lines.push('');
    }

    lines.push('Khuyến nghị:');
    lines.push('- Đi khám/bác sĩ để được đánh giá trực tiếp.');
    lines.push('- Không tự ý dùng thuốc hoặc thay đổi liều khi chưa có chỉ định.');
    lines.push('');
    lines.push(SAFETY_WARNINGS.GENERAL_DISCLAIMER);

    return lines.join('\n');
  }

  validateAIResponse(response: string): { isSafe: boolean; issues: string[] } {
    const issues: string[] = [];

    const dangerousPatterns: RegExp[] = [
      /bạn (chắc chắn|definitely) (bị|have)/i,
      /chẩn đoán (chính xác|definitely)/i,
      /(hãy|should) (tự )?điều trị/i,
      /không cần (gặp|đi khám) bác sĩ/i,
      /don't need (to see|a) doctor/i,
    ];

    if (dangerousPatterns.some((p) => p.test(response))) {
      issues.push('Overly confident diagnosis or unsafe medical advice');
    }

    // Medication prescription-style advice without doctor disclaimer
    const mentionsMedication =
      /(uống|dùng|take).{0,20}(thuốc|medication|drug)/i.test(response);
    const hasDoctorDisclaimer =
      /(tham khảo|bác sĩ|consult (a )?doctor)/i.test(response);

    if (mentionsMedication && !hasDoctorDisclaimer) {
      issues.push('Medication advice without recommending professional consultation');
    }

    return { isSafe: issues.length === 0, issues };
  }
}

