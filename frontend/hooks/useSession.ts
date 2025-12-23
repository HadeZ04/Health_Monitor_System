"use client";

import { useEffect, useState } from "react";
import type { SessionState } from "@/lib/session";
import { getSession, SESSION_EVENT_NAME } from "@/lib/session";

export const useSession = () => {
  const [session, setSession] = useState<SessionState | null>(null);

  useEffect(() => {
    setSession(getSession());

    const handleStorage = () => setSession(getSession());
    window.addEventListener("storage", handleStorage);
    window.addEventListener(SESSION_EVENT_NAME, handleStorage as EventListener);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(SESSION_EVENT_NAME, handleStorage as EventListener);
    };
  }, []);

  return session;
};


