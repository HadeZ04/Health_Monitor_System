import { API_BASE_URL, DASHBOARD_URL } from "./config";
import type { SessionPayload } from "./session";

const handleResponse = async (response: Response) => {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.message ?? "Unable to reach authentication service.";
    throw new Error(message);
  }
  return payload as SessionPayload;
};

const postJson = (path: string, body: unknown) =>
  fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

export const loginUser = async (input: { email: string; password: string }) =>
  handleResponse(await postJson("/auth/login", input));

export const registerUser = async (input: {
  fullName: string;
  email: string;
  password: string;
  role: string;
  age?: number;
  gender?: string;
}) => handleResponse(await postJson("/auth/register", input));

export const redirectToDashboard = () => {
  if (typeof window === "undefined") return;
  window.location.href = DASHBOARD_URL;
};


