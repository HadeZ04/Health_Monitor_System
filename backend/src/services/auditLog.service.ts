import type { AuditLogEntry } from "../types/chatbot.types";
import { randomUUID } from "crypto";

/**
 * Audit Logging Service
 * Tracks all chatbot interactions for compliance and security
 * 
 * NOTE: In production, this should write to:
 * 1. Secure database with encryption
 * 2. Dedicated audit log service
 * 3. SIEM (Security Information and Event Management) system
 */
export class AuditLogService {
  private logs: AuditLogEntry[] = []; // In-memory for demo. Use DB in production!

  /**
   * Log a chatbot interaction
   */
  async logInteraction(entry: Omit<AuditLogEntry, "log_id" | "timestamp">): Promise<void> {
    const logEntry: AuditLogEntry = {
      log_id: randomUUID(),
      ...entry,
      timestamp: new Date(),
    };

    // In production: Save to secure database
    this.logs.push(logEntry);

    // Also log to console for development
    if (process.env.NODE_ENV === "development") {
      console.log("[AUDIT]", {
        session_id: logEntry.session_id,
        action: logEntry.action,
        db_accessed: logEntry.db_accessed,
        pii_detected: logEntry.pii_detected,
        safety_level: logEntry.safety_level,
      });
    }

    // In production: Send critical events to monitoring
    if (logEntry.safety_level === "CRITICAL" || logEntry.pii_detected) {
      await this.alertSecurityTeam(logEntry);
    }
  }

  /**
   * Log database access
   */
  async logDatabaseAccess(
    sessionId: string,
    userId: string,
    collection: string,
    recordCount: number,
    ipAddress?: string
  ): Promise<void> {
    await this.logInteraction({
      session_id: sessionId,
      user_id: userId,
      action: `DB_ACCESS: ${collection}`,
      db_accessed: true,
      db_collection: collection,
      pii_detected: true, // DB always contains PII
      pii_types: ["PATIENT_NAME", "MEDICAL_RECORD_NUMBER"], // Assume worst case
      safety_level: "MEDIUM",
      ip_address: ipAddress,
    });
  }

  /**
   * Log PII detection
   */
  async logPIIDetection(
    sessionId: string,
    userId: string | undefined,
    piiTypes: string[],
    context: string,
    ipAddress?: string
  ): Promise<void> {
    await this.logInteraction({
      session_id: sessionId,
      user_id: userId,
      action: `PII_DETECTED: ${context}`,
      db_accessed: false,
      pii_detected: true,
      pii_types: piiTypes as any[],
      safety_level: "HIGH",
      ip_address: ipAddress,
    });
  }

  /**
   * Log safety alert
   */
  async logSafetyAlert(
    sessionId: string,
    userId: string | undefined,
    riskLevel: string,
    detectedIssues: string[],
    ipAddress?: string
  ): Promise<void> {
    await this.logInteraction({
      session_id: sessionId,
      user_id: userId,
      action: `SAFETY_ALERT: ${detectedIssues.join(", ")}`,
      db_accessed: false,
      pii_detected: false,
      safety_level: riskLevel,
      ip_address: ipAddress,
    });
  }

  /**
   * Log Gemini API call
   */
  async logGeminiCall(
    sessionId: string,
    userId: string | undefined,
    prompt: string,
    piiRemoved: boolean,
    ipAddress?: string
  ): Promise<void> {
    await this.logInteraction({
      session_id: sessionId,
      user_id: userId,
      action: "GEMINI_API_CALL",
      db_accessed: false,
      pii_detected: !piiRemoved,
      safety_level: piiRemoved ? "LOW" : "HIGH",
      ip_address: ipAddress,
    });
  }

  /**
   * Log authentication failure
   */
  async logAuthFailure(
    sessionId: string,
    reason: string,
    ipAddress?: string
  ): Promise<void> {
    await this.logInteraction({
      session_id: sessionId,
      user_id: undefined,
      action: `AUTH_FAILURE: ${reason}`,
      db_accessed: false,
      pii_detected: false,
      safety_level: "MEDIUM",
      ip_address: ipAddress,
    });
  }

  /**
   * Get logs for a session (for debugging/support)
   */
  async getSessionLogs(sessionId: string): Promise<AuditLogEntry[]> {
    // In production: Query from database
    return this.logs.filter((log) => log.session_id === sessionId);
  }

  /**
   * Get logs for a user (for compliance/audit)
   */
  async getUserLogs(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<AuditLogEntry[]> {
    let filtered = this.logs.filter((log) => log.user_id === userId);

    if (startDate) {
      filtered = filtered.filter((log) => log.timestamp >= startDate);
    }

    if (endDate) {
      filtered = filtered.filter((log) => log.timestamp <= endDate);
    }

    return filtered;
  }

  /**
   * Get high-risk logs (for security monitoring)
   */
  async getHighRiskLogs(limit: number = 100): Promise<AuditLogEntry[]> {
    return this.logs
      .filter(
        (log) =>
          log.safety_level === "CRITICAL" ||
          log.safety_level === "HIGH" ||
          (log.pii_detected && !log.db_accessed)
      )
      .slice(-limit);
  }

  /**
   * Generate compliance report
   */
  async generateComplianceReport(
    startDate: Date,
    endDate: Date
  ): Promise<{
    total_interactions: number;
    db_accesses: number;
    pii_detections: number;
    safety_alerts: number;
    unique_users: number;
    gemini_calls: number;
  }> {
    const filtered = this.logs.filter(
      (log) => log.timestamp >= startDate && log.timestamp <= endDate
    );

    const uniqueUsers = new Set(
      filtered.filter((log) => log.user_id).map((log) => log.user_id)
    ).size;

    return {
      total_interactions: filtered.length,
      db_accesses: filtered.filter((log) => log.db_accessed).length,
      pii_detections: filtered.filter((log) => log.pii_detected).length,
      safety_alerts: filtered.filter(
        (log) =>
          log.safety_level === "CRITICAL" || log.safety_level === "HIGH"
      ).length,
      unique_users: uniqueUsers,
      gemini_calls: filtered.filter((log) => log.action === "GEMINI_API_CALL")
        .length,
    };
  }

  /**
   * Alert security team about critical events
   */
  private async alertSecurityTeam(entry: AuditLogEntry): Promise<void> {
    // In production: Send to Slack/Email/PagerDuty/etc.
    console.warn("[SECURITY ALERT]", {
      log_id: entry.log_id,
      session_id: entry.session_id,
      user_id: entry.user_id,
      action: entry.action,
      safety_level: entry.safety_level,
      pii_detected: entry.pii_detected,
      pii_types: entry.pii_types,
      timestamp: entry.timestamp,
    });

    // TODO: Implement actual alerting
    // - Send to security team via email
    // - Post to Slack security channel
    // - Trigger PagerDuty if CRITICAL
    // - Log to SIEM system
  }

  /**
   * Anonymize old logs (for GDPR compliance)
   */
  async anonymizeOldLogs(olderThanDays: number): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    let anonymizedCount = 0;

    for (const log of this.logs) {
      if (log.timestamp < cutoffDate && log.user_id) {
        log.user_id = "[ANONYMIZED]";
        log.ip_address = "[ANONYMIZED]";
        anonymizedCount++;
      }
    }

    return anonymizedCount;
  }

  /**
   * Delete old logs (for data retention policy)
   */
  async deleteOldLogs(olderThanDays: number): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const beforeCount = this.logs.length;
    this.logs = this.logs.filter((log) => log.timestamp >= cutoffDate);
    const afterCount = this.logs.length;

    return beforeCount - afterCount;
  }

  /**
   * Export logs for compliance/audit
   */
  async exportLogs(
    startDate: Date,
    endDate: Date,
    format: "json" | "csv" = "json"
  ): Promise<string> {
    const filtered = this.logs.filter(
      (log) => log.timestamp >= startDate && log.timestamp <= endDate
    );

    if (format === "json") {
      return JSON.stringify(filtered, null, 2);
    }

    // CSV format
    const headers = [
      "log_id",
      "session_id",
      "user_id",
      "action",
      "db_accessed",
      "db_collection",
      "pii_detected",
      "pii_types",
      "safety_level",
      "timestamp",
      "ip_address",
    ];

    const rows = filtered.map((log) => [
      log.log_id,
      log.session_id,
      log.user_id || "",
      log.action,
      log.db_accessed ? "YES" : "NO",
      log.db_collection || "",
      log.pii_detected ? "YES" : "NO",
      log.pii_types?.join(";") || "",
      log.safety_level,
      log.timestamp.toISOString(),
      log.ip_address || "",
    ]);

    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join(
      "\n"
    );

    return csv;
  }
}
