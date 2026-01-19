import type {
  PIIDetectionResult,
  PIIType,
  RedactionEntry,
} from '../types/chatbot.types.js';
import { CHATBOT_CONFIG } from '../config/chatbot.config.js';

export class PIISanitizationService {
  sanitizeText(text: string): PIIDetectionResult {
    const redactionMap: RedactionEntry[] = [];
    let sanitizedText = text;
    const detectedTypes: Set<PIIType> = new Set();

    for (const [piiType, pattern] of Object.entries(CHATBOT_CONFIG.pii_patterns)) {
      const result = this.detectAndRedact(
        sanitizedText,
        pattern,
        piiType as PIIType
      );

      if (result.found) {
        sanitizedText = result.sanitizedText;
        redactionMap.push(...result.redactions);
        detectedTypes.add(piiType as PIIType);
      }
    }

    return {
      has_pii: detectedTypes.size > 0,
      detected_types: Array.from(detectedTypes),
      sanitized_text: sanitizedText,
      redaction_map: redactionMap,
    };
  }

  private detectAndRedact(
    text: string,
    pattern: RegExp,
    piiType: PIIType
  ): { found: boolean; sanitizedText: string; redactions: RedactionEntry[] } {
    const redactions: RedactionEntry[] = [];
    let sanitizedText = text;

    const matches = Array.from(text.matchAll(pattern));
    if (matches.length === 0) {
      return { found: false, sanitizedText, redactions };
    }

    for (let index = matches.length - 1; index >= 0; index--) {
      const match = matches[index];
      if (!match) continue;

      const original = match[0];
      const startPos = match.index ?? -1;
      if (startPos < 0) continue;

      const endPos = startPos + original.length;
      const replacement = this.getReplacementToken(piiType);

      redactions.unshift({
        original,
        replacement,
        type: piiType,
        start_position: startPos,
        end_position: endPos,
      });

      sanitizedText =
        sanitizedText.substring(0, startPos) +
        replacement +
        sanitizedText.substring(endPos);
    }

    return { found: true, sanitizedText, redactions };
  }

  private getReplacementToken(piiType: PIIType): string {
    const tokens: Record<PIIType, string> = {
      PATIENT_NAME: '[TEN_BENH_NHAN]',
      PHONE_NUMBER: '[SO_DIEN_THOAI]',
      EMAIL: '[EMAIL]',
      ID_NUMBER: '[SO_CCCD/CMND]',
      ADDRESS: '[DIA_CHI]',
      DATE_OF_BIRTH: '[NGAY_SINH]',
      MEDICAL_RECORD_NUMBER: '[MA_BENH_AN]',
    };
    return tokens[piiType] ?? '[REDACTED]';
  }

  sanitizeDBResult(data: unknown): { sanitized: unknown; metadata: unknown } {
    if (!data) {
      return { sanitized: null, metadata: null };
    }

    const metadata = {
      original_record_count: Array.isArray(data) ? data.length : 1,
      fields_removed: [] as string[],
    };

    const sensitiveFields = [
      'id',
      'userId',
      'patientId',
      'email',
      'phone',
      'address',
      'fullName',
      'name',
      'identificationNumber',
      'medicalRecordNumber',
      'dateOfBirth',
      'socialSecurityNumber',
    ];

    const sanitize = (value: unknown): unknown => {
      if (Array.isArray(value)) {
        return value.map((item) => sanitize(item));
      }

      if (value && typeof value === 'object') {
        const sanitizedObject: Record<string, unknown> = {};

        for (const [key, nestedValue] of Object.entries(value)) {
          if (
            sensitiveFields.some((field) =>
              key.toLowerCase().includes(field.toLowerCase())
            )
          ) {
            metadata.fields_removed.push(key);
            continue;
          }

          sanitizedObject[key] = sanitize(nestedValue);
        }

        return sanitizedObject;
      }

      return value;
    };

    return { sanitized: sanitize(data), metadata };
  }

  summarizeMedicalData(data: any, dataType: string): string {
    if (!data) return 'Không có dữ liệu.';

    try {
      switch (dataType) {
        case 'lab_results':
          return this.summarizeLabResults(data);
        case 'prescriptions':
          return this.summarizePrescriptions(data);
        case 'vital_signs':
          return this.summarizeVitalSigns(data);
        case 'visit_history':
          return this.summarizeVisitHistory(data);
        case 'medical_files':
          return this.summarizeMedicalFiles(data);
        case 'allergies':
          return this.summarizeAllergies(data);
        case 'all':
          return this.summarizeAll(data);
        default:
          return JSON.stringify(data, null, 2);
      }
    } catch (error) {
      console.error('Error summarizing medical data:', error);
      return 'Lỗi khi xử lý dữ liệu y tế.';
    }
  }

  private summarizeLabResults(results: any[]): string {
    if (!Array.isArray(results) || results.length === 0) {
      return 'Không tìm thấy kết quả xét nghiệm.';
    }

    const latest = results[0] ?? {};
    const lines: string[] = ['Kết quả xét nghiệm gần nhất:'];

    const testName = latest.testName || latest.type;
    if (testName) lines.push(`- Loại xét nghiệm: ${testName}`);

    const value = latest.value ?? latest.resultSummary;
    if (value !== undefined && value !== null) {
      lines.push(`- Giá trị: ${value}${latest.unit ? ` ${latest.unit}` : ''}`);
    }

    const normalRange = latest.normalRange || latest.referenceRange;
    if (normalRange) lines.push(`- Ngưỡng bình thường: ${normalRange}`);

    const dateValue = latest.performedAt || latest.recordedAt || latest.createdAt;
    if (dateValue) {
      const date = new Date(dateValue);
      lines.push(`- Ngày xét nghiệm: ${date.toLocaleDateString('vi-VN')}`);
    }

    if (latest.status) lines.push(`- Trạng thái: ${latest.status}`);

    return lines.join('\n');
  }

  private summarizePrescriptions(prescriptions: any[]): string {
    if (!Array.isArray(prescriptions) || prescriptions.length === 0) {
      return 'Không tìm thấy đơn thuốc.';
    }

    const lines: string[] = ['Đơn thuốc gần nhất:'];

    prescriptions.slice(0, 5).forEach((rx, index) => {
      const name = rx.medication || rx.name || 'Thuốc';
      lines.push(`\n${index + 1}. ${name}`);

      if (rx.dosage) lines.push(`   - Liều dùng: ${rx.dosage}`);
      if (rx.frequency) lines.push(`   - Tần suất: ${rx.frequency}`);
      if (rx.duration) lines.push(`   - Thời gian: ${rx.duration}`);
      if (rx.instructions) lines.push(`   - Hướng dẫn: ${rx.instructions}`);

      const consultDate = rx.consultation?.createdAt;
      if (consultDate) {
        const date = new Date(consultDate);
        lines.push(`   - Ngày kê đơn: ${date.toLocaleDateString('vi-VN')}`);
      }
    });

    return lines.join('\n');
  }

  private summarizeVitalSigns(vitals: any[]): string {
    if (!Array.isArray(vitals) || vitals.length === 0) {
      return 'Không tìm thấy chỉ số sinh hiệu.';
    }

    const latest = vitals[0] ?? {};
    const lines: string[] = ['Chỉ số sinh hiệu gần nhất:'];

    if (latest.type) lines.push(`- Loại: ${latest.type}`);

    const value =
      latest.systolic !== undefined && latest.diastolic !== undefined
        ? `${latest.systolic}/${latest.diastolic}`
        : latest.heartRate !== undefined
          ? `${latest.heartRate}`
          : latest.glucose !== undefined
            ? `${latest.glucose}`
            : latest.spo2 !== undefined
              ? `${latest.spo2}`
              : latest.temperature !== undefined
                ? `${latest.temperature}`
                : latest.weight !== undefined
                  ? `${latest.weight}`
                  : latest.value ?? latest.values;

    if (value !== undefined) {
      const valueStr = typeof value === 'string' ? value : JSON.stringify(value);
      lines.push(`- Giá trị: ${valueStr}${latest.unit ? ` ${latest.unit}` : ''}`);
    }

    const dateValue = latest.timestamp || latest.recordedAt || latest.createdAt;
    if (dateValue) {
      const date = new Date(dateValue);
      lines.push(`- Ngày đo: ${date.toLocaleDateString('vi-VN')}`);
    }

    if (latest.status) lines.push(`- Trạng thái: ${latest.status}`);

    return lines.join('\n');
  }

  private summarizeVisitHistory(visits: any[]): string {
    if (!Array.isArray(visits) || visits.length === 0) {
      return 'Không tìm thấy lịch sử khám bệnh.';
    }

    const lines: string[] = [`Lịch sử khám bệnh (${visits.length} lần):`];

    visits.slice(0, 3).forEach((visit, index) => {
      const dateValue = visit.visitDate || visit.createdAt || visit.date;
      const dateLabel = dateValue
        ? new Date(dateValue).toLocaleDateString('vi-VN')
        : '';

      lines.push(`\n${index + 1}. Lần khám ${dateLabel}`);
      if (visit.diagnosis) lines.push(`   - Chẩn đoán: ${visit.diagnosis}`);
      if (visit.notes) lines.push(`   - Ghi chú: ${visit.notes}`);
      if (visit.status) lines.push(`   - Trạng thái: ${visit.status}`);
    });

    return lines.join('\n');
  }

  private summarizeMedicalFiles(files: any[]): string {
    if (!Array.isArray(files) || files.length === 0) {
      return 'Không tìm thấy hồ sơ/tệp y tế.';
    }

    const lines: string[] = ['Tệp y tế gần nhất:'];
    files.slice(0, 5).forEach((file, index) => {
      const name = file.name || 'Tệp';
      const type = file.type ? ` (${file.type})` : '';
      lines.push(`- ${index + 1}. ${name}${type}`);
    });
    return lines.join('\n');
  }

  private summarizeAllergies(items: any[]): string {
    if (!Array.isArray(items) || items.length === 0) {
      return 'Không có thông tin dị ứng/tiền sử trong hồ sơ.';
    }

    const lines: string[] = ['Thông tin trong hồ sơ (có thể gồm dị ứng/tiền sử):'];
    items.slice(0, 10).forEach((item) => {
      if (item?.value) lines.push(`- ${item.value}`);
    });
    return lines.join('\n');
  }

  private summarizeAll(data: any): string {
    const lines: string[] = ['Tóm tắt hồ sơ (đã loại bỏ định danh):'];

    const labResults = data?.lab_results;
    const prescriptions = data?.prescriptions;
    const vitalSigns = data?.vital_signs;

    if (labResults) {
      lines.push('\n--- Xét nghiệm ---');
      lines.push(this.summarizeLabResults(labResults));
    }

    if (prescriptions) {
      lines.push('\n--- Đơn thuốc ---');
      lines.push(this.summarizePrescriptions(prescriptions));
    }

    if (vitalSigns) {
      lines.push('\n--- Sinh hiệu ---');
      lines.push(this.summarizeVitalSigns(vitalSigns));
    }

    return lines.join('\n');
  }

  detectPromptInjection(text: string): { detected: boolean; reasons: string[] } {
    const patterns: RegExp[] = [
      /ignore (previous|above|all)/i,
      /forget (everything|previous|instructions)/i,
      /system prompt/i,
      /you are now/i,
      /act as/i,
      /pretend (to be|you are)/i,
      /role.{0,10}play/i,
      /(print|show|display|reveal).{0,20}(all|entire|full).{0,20}(database|records|patients|data)/i,
      /select \* from/i,
      /drop table/i,
      /delete from/i,
      /<script>/i,
      /javascript:/i,
    ];

    const reasons: string[] = [];
    for (const pattern of patterns) {
      if (pattern.test(text)) reasons.push(`Matched pattern: ${pattern.source}`);
    }

    return { detected: reasons.length > 0, reasons };
  }

  validateSanitization(_originalText: string, sanitizedText: string): boolean {
    for (const [piiType, pattern] of Object.entries(CHATBOT_CONFIG.pii_patterns)) {
      if (pattern.test(sanitizedText)) {
        console.warn(
          `PII leakage detected: ${piiType} still present in sanitized text`
        );
        return false;
      }
    }
    return true;
  }
}

