export interface SessionUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  age?: number;
  gender?: string;
  createdAt?: string;
}

export interface SessionState {
  token: string;
  user: SessionUser;
}

export const SESSION_STORAGE_KEY = "hm.session";
export const SESSION_EVENT_NAME = "hm-session-change";

const isBrowser = () => typeof window !== "undefined";

export const saveSession = (session: SessionState) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(SESSION_EVENT_NAME));
};

export const clearSession = () => {
  if (!isBrowser()) return;
  window.localStorage.removeItem(SESSION_STORAGE_KEY);
  window.dispatchEvent(new Event(SESSION_EVENT_NAME));
};

export const getSession = (): SessionState | null => {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionState;
  } catch {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
};


