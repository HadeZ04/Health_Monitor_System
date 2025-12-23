from __future__ import annotations

import json
import logging
import re
from typing import Iterable, List, Sequence

logger = logging.getLogger(__name__)

EMERGENCY_KEYWORDS = [
    "đau ngực dữ dội",
    "đau ngực nặng",
    "khó thở",
    "thở không được",
    "bất tỉnh",
    "ngất xỉu",
    "co giật",
    "sùi bọt mép",
    "chảy máu nhiều",
    "máu chảy không cầm",
    "phản vệ",
    "sưng lưỡi",
    "sưng mặt đột ngột",
    "tai nạn giao thông",
    "tai nạn nghiêm trọng",
]

SENSITIVE_KEYWORDS = [
    "muốn tự tử",
    "tự tử",
    "kết thúc cuộc đời",
    "uống thuốc gì để chết",
    "cách chết nhanh",
    "đánh bạn gái",
    "đánh vợ",
    "bạo lực gia đình",
    "mua ma túy",
    "sử dụng ma túy",
    "chơi ma túy",
    "phá thai ở nhà",
    "tự phá thai",
]

STOP_MARKERS = [
    "The original post",
    "### Question:",
    "### Answer:",
    "Please answer",
    "```python",
    "```",
    "Note:",
    "(Note:",
    "Translation:",
    "Thời gian xử lý",
]


def safety_guard(question: str) -> str | None:
    q = question.lower().strip()

    if any(keyword in q for keyword in EMERGENCY_KEYWORDS):
        return (
            "⚠️ CẢNH BÁO: Triệu chứng bạn mô tả có thể nguy hiểm. "
            "Hãy đến cơ sở y tế gần nhất hoặc gọi 115 ngay lập tức. "
            "Thông tin dưới đây chỉ mang tính tham khảo."
        )

    if any(keyword in q for keyword in SENSITIVE_KEYWORDS):
        return (
            "⚠️ CẢNH BÁO: Bạn đang nhắc đến vấn đề nhạy cảm/nguy hiểm. "
            "Vui lòng tìm sự hỗ trợ khẩn cấp từ chuyên gia y tế, gia đình hoặc cơ quan chức năng."
        )

    return None


def remove_emoji(text: str) -> str:
    emoji_pattern = re.compile(
        "["
        "\U0001F300-\U0001FAFF"
        "\U00002700-\U000027BF"
        "\U0001F900-\U0001F9FF"
        "]+",
        flags=re.UNICODE,
    )
    return emoji_pattern.sub("", text)


def postprocess_answer(raw_answer: str) -> str:
    txt = raw_answer or ""

    # Loại bỏ các phần lặp lại "Kết quả đánh giá", "Kế hoạch đề xuất" sau lần đầu
    # Chỉ giữ phần trước "Kết quả đánh giá" đầu tiên nếu có
    if "Kết quả đánh giá" in txt:
        # Tìm vị trí "Kết quả đánh giá" đầu tiên
        idx = txt.find("Kết quả đánh giá")
        if idx > 0:
            # Chỉ giữ phần trước đó, nhưng kiểm tra xem có phải là phần chính không
            # Nếu "Kết quả đánh giá" xuất hiện ở cuối, có thể là phần đánh giá không cần thiết
            # Chỉ loại bỏ nếu nó xuất hiện sau phần trả lời chính (sau 50% text)
            if idx > len(txt) * 0.5:
                txt = txt[:idx].strip()
    
    # Loại bỏ các phần JSON còn sót lại
    txt = re.sub(r'\{[^{}]*"verdict"[^{}]*\}', '', txt)
    txt = re.sub(r'\{[^{}]*"final_answer"[^{}]*\}', '', txt)
    
    # Loại bỏ các phần lặp lại "Kế hoạch đề xuất" và "Tài liệu tham khảo"
    # Chỉ giữ lần đầu tiên của mỗi phần
    if txt.count("Kế hoạch đề xuất:") > 1:
        # Tìm vị trí lần xuất hiện thứ 2
        first_idx = txt.find("Kế hoạch đề xuất:")
        second_idx = txt.find("Kế hoạch đề xuất:", first_idx + 1)
        if second_idx > 0:
            # Loại bỏ từ lần xuất hiện thứ 2 trở đi
            txt = txt[:second_idx].strip()
    
    if txt.count("Tài liệu tham khảo:") > 1:
        # Tìm vị trí lần xuất hiện thứ 2
        first_idx = txt.find("Tài liệu tham khảo:")
        second_idx = txt.find("Tài liệu tham khảo:", first_idx + 1)
        if second_idx > 0:
            # Loại bỏ từ lần xuất hiện thứ 2 trở đi
            txt = txt[:second_idx].strip()
    
    # Loại bỏ các dòng đánh giá không cần thiết
    lines_to_remove = []
    lines = txt.splitlines()
    for i, line in enumerate(lines):
        # Loại bỏ dòng "X. [N]: Không liên quan..."
        if re.match(r'^\d+\.\s*\[.*\]:\s*(Không|không).*', line):
            lines_to_remove.append(i)
        # Loại bỏ dòng "Tài liệu tham khảo: None"
        if re.match(r'^Tài liệu tham khảo:\s*None\s*$', line, re.IGNORECASE):
            lines_to_remove.append(i)
    
    # Xóa các dòng từ cuối lên để không ảnh hưởng index
    for i in reversed(lines_to_remove):
        lines.pop(i)
    txt = "\n".join(lines)

    for marker in STOP_MARKERS:
        idx = txt.find(marker)
        if idx != -1:
            txt = txt[:idx]

    lines = [line.strip() for line in txt.splitlines()]

    meta_patterns = [
        r"^\[Câu trả lời\]$",
        r"^\[None\]$",
        r"^\[CÓ THỂ.*\]$",
        r"^\[CÓ CHÚ Ý.*\]$",
        r"^\[CÓ TÀI LIỆU THAM KHẢO.*\]$",
        r"^\[CÓ THỂ CHÍNH XÁC NHƯ SAU\]:?$",
        r"^\[CÓ THỂ NHƯ SAU\]:?$",
        r"^- *Trả lời phải ngắn gọn.*",
        r"^Trả lời phải ngắn gọn.*",
        r"^Nếu cần thiết, hãy từ chối.*",
        r"^\(Các bước sau sẽ giúp bạn hoàn thiện hơn\).*$",
        r"^Lưu ý[:：].*$",
        r"^Please .*",
        r"^Kết quả đánh giá:?\s*$",  # Loại bỏ dòng "Kết quả đánh giá:" trống
        r"^\d+\.\s*\[.*\]:\s*(Không|không).*",  # Loại bỏ "[1]: Không liên quan"
    ]
    compiled_meta = [re.compile(p, re.IGNORECASE) for p in meta_patterns]

    garbage_substrings = [
        "Chúc mừng! Bạn đã trả lời thành công!",
        "[Câu trả lời]",
        "Không sử dụng thông tin trong [CONTEXT]",
        "Trả lời phải ngắn gọn, rõ ràng, khoa học và dễ hiểu",
        "Nếu cần thiết, hãy từ chối trả lời",
        "[CÓ THỂ NHƯ SAU]:",
        "Tài liệu tham khảo: None",
    ]

    cleaned_lines = []
    for line in lines:
        if not line:
            continue
        if any(pattern.search(line) for pattern in compiled_meta):
            continue
        if any(substr in line for substr in garbage_substrings):
            continue
        cleaned_lines.append(line)

    txt = "\n".join(cleaned_lines)
    txt = remove_emoji(txt)
    txt = re.sub(r"\n\s*\n+", "\n\n", txt)  # Loại bỏ nhiều dòng trống liên tiếp
    txt = txt.strip()
    if txt.endswith("("):
        txt = txt[:-1].strip()
    
    return txt


def suppress_unmentioned_terms(
    answer: str,
    source_text: str,
    sensitive_terms: Sequence[str],
) -> str:
    """Loại bỏ các dòng chứa chẩn đoán nhạy cảm nếu người dùng/context không đề cập."""
    if not answer or not sensitive_terms:
        return answer

    source = (source_text or "").lower()
    blocked_terms = [
        term.lower()
        for term in sensitive_terms
        if term and term.lower() not in source
    ]
    if not blocked_terms:
        return answer

    filtered_lines: List[str] = []
    removed = False
    for line in answer.splitlines():
        normalized = line.lower()
        if any(term in normalized for term in blocked_terms):
            removed = True
            continue
        filtered_lines.append(line)

    if not removed:
        return answer

    cleaned = "\n".join(filtered_lines)
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned).strip()
    return cleaned or answer


def format_history(messages: Sequence) -> str:
    if not messages:
        return "Chưa có hội thoại trước đó."

    formatted: List[str] = []
    for msg in messages:
        role = getattr(msg, "type", getattr(msg, "role", ""))
        if role in ("human", "user"):
            prefix = "Bệnh nhân"
        elif role in ("ai", "assistant"):
            prefix = "Bác sĩ AI"
        else:
            prefix = "Khác"
        formatted.append(f"{prefix}: {msg.content}")
    return "\n".join(formatted)


def safe_json_loads(payload: str) -> dict[str, str] | None:
    """Extract và parse JSON từ text có thể chứa JSON."""
    if not payload:
        return None
    
    # Thử parse trực tiếp
    try:
        return json.loads(payload.strip())
    except json.JSONDecodeError:
        pass
    
    # Tìm JSON block trong text (giữa { và })
    try:
        # Tìm block JSON đầu tiên
        start = payload.find('{')
        if start == -1:
            logger.debug(f"Không tìm thấy JSON block trong: {payload[:200]}")
            return None
        
        # Tìm closing brace tương ứng
        brace_count = 0
        end = start
        for i in range(start, len(payload)):
            if payload[i] == '{':
                brace_count += 1
            elif payload[i] == '}':
                brace_count -= 1
                if brace_count == 0:
                    end = i + 1
                    break
        
        if brace_count == 0:
            json_str = payload[start:end]
            return json.loads(json_str)
    except (json.JSONDecodeError, ValueError) as e:
        logger.debug(f"Lỗi khi parse JSON block: {e}, payload: {payload[:300]}")
    
    # Thử extract JSON với regex (fallback)
    try:
        json_match = re.search(r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}', payload, re.DOTALL)
        if json_match:
            json_str = json_match.group(0)
            return json.loads(json_str)
    except (json.JSONDecodeError, ValueError):
        pass
    
    logger.warning(f"Không thể parse JSON từ self-correction output. Payload: {payload[:300]}")
    return None


def enforce_stop_tokens(text: str, stop: Iterable[str] | None) -> str:
    if not stop:
        return text
    pattern = "|".join(re.escape(token) for token in stop)
    split_text = re.split(pattern, text, maxsplit=1)
    return split_text[0]


# --- PII and safety helpers for routing and Gemini calls ---
PII_PATTERNS = [
    (re.compile(r"\b([A-Z][a-z]{1,30}\s){1,3}[A-Z][a-z]{1,30}\b"), "[PATIENT_NAME]"),
    (re.compile(r"\b\+?\d[\d\-\s]{7,}\b"), "[REDACTED_ID]"),
    (re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"), "[REDACTED_ID]"),
    (re.compile(r"\b\d{8,}\b"), "[REDACTED_ID]"),
]
DOB_PATTERN = re.compile(r"\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b")
ADDRESS_PATTERN = re.compile(
    r"\b(\d{1,4}\s+[A-Za-z0-9\s]+(?:street|st|ward|quan|phuong|district|thanh pho))\b",
    flags=re.IGNORECASE,
)
EXFIL_PATTERNS = [
    "in toan bo ho so",
    "xuat toan bo ho so",
    "in toan bo benh an",
    "liet ke cccd",
    "liet ke so cccd",
    "liet ke so dien thoai",
    "xuat tat ca ho so",
]
RISKY_PHRASES = [
    "100%",
    "chac chan",
    "khong can di kham",
    "khong can gap bac si",
]
SAFETY_DISCLAIMER = (
    "Thong tin chi mang tinh tham khao, khong thay the tu van chan doan cua bac si."
)

def strip_prompt_injection(text: str) -> str:
    """Remove common prompt-injection markers and fences while keeping user content."""
    if not text:
        return ""
    cleaned_lines: List[str] = []
    for line in text.splitlines():
        trimmed = line.strip()
        lowered = trimmed.lower()
        if lowered.startswith(("system:", "assistant:", "#!", "### instruction", "<", "</", "{system", "[system")):
            continue
        trimmed = trimmed.replace("```", "")
        cleaned_lines.append(trimmed)
    cleaned = "\n".join(cleaned_lines)
    return cleaned.strip()


def has_data_exfil_request(text: str) -> bool:
    if not text:
        return False
    lowered = text.lower()
    return any(trigger in lowered for trigger in EXFIL_PATTERNS)


def sanitize_text_for_gemini(text: str) -> tuple[str, bool]:
    if not text:
        return "", False
    sanitized = strip_prompt_injection(remove_emoji(text))
    redacted = False
    for pattern, repl in PII_PATTERNS:
        sanitized, count = pattern.subn(repl, sanitized)
        redacted = redacted or count > 0
    sanitized, count = DOB_PATTERN.subn("[REDACTED_DOB]", sanitized)
    redacted = redacted or count > 0
    sanitized, count = ADDRESS_PATTERN.subn("[REDACTED_ADDRESS]", sanitized)
    redacted = redacted or count > 0
    sanitized = re.sub(r"\s{2,}", " ", sanitized).strip()
    return sanitized, redacted


def sanitize_context_payload(text: str) -> tuple[str, bool]:
    return sanitize_text_for_gemini(text)


def output_guard(answer: str) -> tuple[str, bool]:
    if not answer:
        return "", False
    sanitized, redacted = sanitize_text_for_gemini(answer)
    flagged = redacted
    lowered = sanitized.lower()
    if any(phrase in lowered for phrase in RISKY_PHRASES):
        flagged = True
        sanitized = sanitized + "\n\nLuu y: Neu trieu chung keo dai hoac nang len, hay gap bac si de duoc kham truc tiep."
    if SAFETY_DISCLAIMER.lower() not in lowered:
        sanitized = sanitized + "\n\n" + SAFETY_DISCLAIMER
    sanitized = re.sub(r"\n{3,}", "\n\n", sanitized).strip()
    return sanitized, flagged
