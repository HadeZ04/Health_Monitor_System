import { getSession, clearSession } from "./session";

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data?: T;
  error?: { message?: string };
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export async function apiFetch<T = unknown>(path: string, options?: RequestInit): Promise<T> {
  const session = typeof window !== "undefined" ? getSession() : null;
  const token = session?.token;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options?.headers as Record<string, string> | undefined) ?? {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    let message = `API error ${response.status}`;
    if (isRecord(data)) {
      const errorObj = isRecord(data.error) ? data.error : null;
      const maybeMessage =
        (typeof errorObj?.message === "string" && errorObj.message) ||
        (typeof data.message === "string" && data.message);
      if (maybeMessage) message = maybeMessage;
    }

    if (response.status === 401) {
      if (typeof window !== "undefined") {
        clearSession();
      }

      const errorMsg = message.toLowerCase();
      if (
        errorMsg.includes("expired") ||
        errorMsg.includes("jwt expired") ||
        errorMsg.includes("token expired")
      ) {
        message = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
      } else {
        message = "Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.";
      }
    } else if (response.status === 403) {
      message = "Bạn không có quyền thực hiện hành động này.";
    } else if (response.status === 404) {
      message = "Không tìm thấy tài nguyên.";
    } else if (response.status === 500) {
      message = "Lỗi server. Vui lòng thử lại sau.";
    }

    throw new Error(message);
  }

  if (isRecord(data) && typeof data.success === "boolean" && "data" in data) {
    return (data as ApiEnvelope<T>).data as T;
  }

  return (data as T) ?? ({} as T);
}
