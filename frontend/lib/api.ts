import { getSession, clearSession } from "./session";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function apiFetch<T = unknown>(path: string, options?: RequestInit): Promise<T> {
  const session = typeof window !== "undefined" ? getSession() : null;
  const token = session?.token;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string> || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = (await response.json().catch(() => null)) as T | { message?: string } | null;

  if (!response.ok) {
    let message = (data as { message?: string } | null)?.message ?? `API error ${response.status}`;
    
    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
      // Clear expired session
      if (typeof window !== "undefined") {
        clearSession();
      }
      
      // Check if error message indicates expired token
      const errorMsg = message.toLowerCase();
      if (errorMsg.includes("expired") || errorMsg.includes("jwt expired") || errorMsg.includes("token expired")) {
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

  return (data as T) ?? ({} as T);
}
