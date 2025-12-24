// Types and Interfaces for Medical Chatbot System

export type IntentType =
  | "PERSONAL_DB_QUERY"      // Case 1: Query patient records
  | "USER_INPUT_ANALYSIS"     // Case 2: Analyze real-time data
  | "GENERAL_MEDICAL_QA"      // Case 3: General medical knowledge
  | "OPERATIONAL_ADMIN"       // Case 4: Booking, pricing, info
  | "CONTEXT_FOLLOWUP"        // Case 5: Follow-up questions
  | "OUT_OF_SCOPE"            // Case 6: Social or off-topic
  | "EMERGENCY";              // Critical health situations

export type ActionType =
  | "SEARCH_DB"               // Query local database
  | "CALL_GEMINI"             // Call Gemini API directly
  | "CALL_ADMIN_TOOL"         // Call administrative tools
  | "REPLY_LOCALLY"           // Use predefined responses
  | "EMERGENCY_RESPONSE";     // Priority safety response

export type DBCollectionType =
  | "lab_results"
  | "prescriptions"
  | "visit_history"
  | "allergies"
  | "vital_signs"
  | "medical_files"
  | "all";

export type TimeFrameType =
  | "latest"
  | "last_week"
  | "last_month"
  | "last_year"
  | "specific_date"
  | "all";

export type ToolNameType =
  | "booking_system"
  | "price_list"
  | "hospital_info"
  | "department_lookup";

// Request from user
export interface ChatRequest {
  question: string;
  session_id?: string;
  user_id?: string;
  language?: string;
  max_new_tokens?: number;
  top_k?: number;
}

// Qwen Router Output
export interface QwenRouterOutput {
  intent: IntentType;
  confidence: number;
  action: ActionType;
  
  // For SEARCH_DB action
  db_query_spec?: DBQuerySpec;
  
  // For CALL_GEMINI action
  gemini_payload_spec?: GeminiPayloadSpec;
  
  // For CALL_ADMIN_TOOL action
  tool_params?: ToolParams;
  
  // For REPLY_LOCALLY action
  local_reply_content?: string;
  
  // Metadata
  detected_pii?: string[];
  safety_flags?: string[];
  requires_auth?: boolean;
}

// Database Query Specification
export interface DBQuerySpec {
  target_collection: DBCollectionType;
  time_frame: TimeFrameType;
  keywords: string[];
  specific_date?: string;
  limit?: number;
}

// Gemini Payload Specification
export interface GeminiPayloadSpec {
  is_pii_removed: boolean;
  sanitized_user_prompt: string;
  system_instruction_hint: string;
  context_data?: string;
  temperature?: number;
}

// Tool Parameters
export interface ToolParams {
  tool_name: ToolNameType;
  tool_args: Record<string, any>;
}

// PII/PHI Detection Result
export interface PIIDetectionResult {
  has_pii: boolean;
  detected_types: PIIType[];
  sanitized_text: string;
  redaction_map: RedactionEntry[];
}

export type PIIType =
  | "PATIENT_NAME"
  | "PHONE_NUMBER"
  | "EMAIL"
  | "ID_NUMBER"
  | "ADDRESS"
  | "DATE_OF_BIRTH"
  | "MEDICAL_RECORD_NUMBER";

export interface RedactionEntry {
  original: string;
  replacement: string;
  type: PIIType;
  start_position: number;
  end_position: number;
}

// Database Query Result
export interface DBQueryResult {
  success: boolean;
  data: any[];
  metadata: {
    collection: string;
    count: number;
    time_range?: string;
  };
  raw_data?: any; // For sanitization step
}

// Safety Check Result
export interface SafetyCheckResult {
  is_safe: boolean;
  risk_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  detected_issues: string[];
  recommended_action: "PROCEED" | "WARN" | "BLOCK" | "EMERGENCY";
  emergency_keywords?: string[];
}

// Gemini API Response
export interface GeminiResponse {
  answer: string;
  confidence?: number;
  sources?: string[];
  warning?: string;
}

// Final Chatbot Response
export interface ChatbotResponse {
  success: boolean;
  reply: string;
  confidence?: number;
  intent: IntentType;
  action_taken: ActionType;
  sources?: string[];
  warning?: string;
  session_id: string;
  metadata?: {
    pii_removed: boolean;
    db_accessed: boolean;
    safety_level: string;
  };
}

// Session Context
export interface SessionContext {
  session_id: string;
  user_id?: string;
  conversation_history: ConversationTurn[];
  language: string;
  created_at: Date;
  last_accessed: Date;
}

export interface ConversationTurn {
  turn_id: number;
  user_message: string;
  bot_response: string;
  intent: IntentType;
  timestamp: Date;
}

// Audit Log Entry
export interface AuditLogEntry {
  log_id: string;
  session_id: string;
  user_id?: string;
  action: string;
  db_accessed?: boolean;
  db_collection?: string;
  pii_detected: boolean;
  pii_types?: PIIType[];
  safety_level: string;
  timestamp: Date;
  ip_address?: string;
}

// Configuration
export interface ChatbotConfig {
  qwen_api_url: string;
  gemini_api_key: string;
  enable_pii_detection: boolean;
  enable_safety_gate: boolean;
  enable_audit_logging: boolean;
  max_context_length: number;
  session_timeout_minutes: number;
  emergency_keywords: string[];
  pii_patterns: Record<PIIType, RegExp>;
}
