"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useSession } from "@/hooks/useSession";
import { getSession, clearSession } from "@/lib/session";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  citations?: string[];
  confidence?: number;
  warning?: string | null;
}

export default function AiChatPage() {
  const router = useRouter();
  const session = useSession();

  // Mỗi chatSessionId tương ứng với một cuộc hội thoại độc lập trong inference server
  const [chatSessionId, setChatSessionId] = useState<string>(() => {
    const currentSession = getSession();
    const baseId = currentSession?.user?.id ? `user-${currentSession.user.id}` : "anonymous";
    return `${baseId}-${Date.now()}`;
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Xin chào! Tôi là trợ lý AI y tế. Tôi có thể giúp bạn trả lời các câu hỏi về sức khỏe. Hãy cho tôi biết bạn cần hỗ trợ gì?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Check session on mount
  useEffect(() => {
    const currentSession = getSession();
    if (!currentSession?.token) {
      router.push("/auth/login");
    }
  }, [router]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewChat = () => {
    const currentSession = getSession();
    const baseId = currentSession?.user?.id ? `user-${currentSession.user.id}` : "anonymous";
    const newSessionId = `${baseId}-${Date.now()}`;

    setChatSessionId(newSessionId);
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Đây là một cuộc trò chuyện mới. Hãy mô tả ngắn gọn tình trạng sức khỏe hoặc câu hỏi y khoa bạn đang quan tâm.",
        timestamp: new Date(),
      },
    ]);
    setInput("");
    setError(null);
  };

  const handleSend = async () => {
    const question = input.trim();
    if (!question || loading) return;

    // Check session before sending
    const currentSession = getSession();
    if (!currentSession?.token) {
      setError("Bạn cần đăng nhập để sử dụng tính năng này. Đang chuyển đến trang đăng nhập...");
      setTimeout(() => router.push("/auth/login"), 2000);
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: question,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    // Add loading message
    const loadingMessageId = `loading-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: loadingMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
      },
    ]);

    try {
      const response = await apiFetch<{
        success: boolean;
        reply: string;
        confidence?: number;
        intent?: string;
        action_taken?: string;
        sources?: string[];
        session_id?: string;
        data?: {
          db_results?: Array<Record<string, any>>;
          analysis?: string;
        };
        warning?: string | null;
        metadata?: {
          pii_removed?: boolean;
          db_accessed?: boolean;
          safety_level?: string;
          safety_triggered?: boolean;
        };
      }>("/chatbot/ask", {
        method: "POST",
        body: JSON.stringify({
          question,
          session_id: chatSessionId,
        }),
      });

      // Remove loading message and add response
      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg.id !== loadingMessageId);
        
        // Format the response message
        let displayContent = response.reply;
        
        // If there's database results, format them nicely
        if (response.data?.db_results && response.data.db_results.length > 0) {
          displayContent += "\n\n📊 **Kết quả từ hồ sơ của bạn:**\n";
          response.data.db_results.forEach((item, idx) => {
            displayContent += `\n${idx + 1}. ${JSON.stringify(item, null, 2)}`;
          });
        }
        
        // Add analysis if present
        if (response.data?.analysis) {
          displayContent += "\n\n💡 **Phân tích:**\n" + response.data.analysis;
        }
        
        return [
          ...filtered,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant" as const,
            content: displayContent,
            timestamp: new Date(),
            warning: response.warning,
            confidence: response.confidence,
          },
        ];
      });
    } catch (err) {
      let errorMessage = "Có lỗi xảy ra";
      let shouldRedirect = false;
      
      if (err instanceof Error) {
        errorMessage = err.message;
        
        // Handle token expired or invalid - apiFetch already cleared session
        if (errorMessage.includes("hết hạn") || errorMessage.includes("không hợp lệ") || 
            errorMessage.includes("expired") || errorMessage.includes("token")) {
          shouldRedirect = true;
          setError(errorMessage);
          // Redirect to login immediately
          setTimeout(() => {
            router.push("/auth/login");
          }, 1500);
        } else {
          setError(errorMessage);
        }
      } else {
        setError(errorMessage);
      }
      
      // Remove loading message
      setMessages((prev) => prev.filter((msg) => msg.id !== loadingMessageId));
      
      // Add error message only if not redirecting
      if (!shouldRedirect) {
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: "assistant",
            content: "Xin lỗi, tôi không thể trả lời câu hỏi này lúc này. Vui lòng thử lại sau.",
            timestamp: new Date(),
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative flex h-[calc(100vh-4rem)] w-full flex-row overflow-hidden bg-white font-body text-black">
      {/* Left Sidebar */}
      <aside className="flex flex-col items-center gap-6 py-6 px-3 bg-white border-r border-gray-100 hidden md:flex">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary-chat shadow-md">
          <span className="material-symbols-outlined text-3xl"> medical_services </span>
        </div>
        <nav className="flex flex-col items-center gap-4">
          <button className="flex h-11 w-11 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100">
            <span className="material-symbols-outlined"> home </span>
          </button>
          <button className="flex h-11 w-11 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100">
            <span className="material-symbols-outlined"> person_search </span>
          </button>
          <button className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-primary-chat transition-colors hover:bg-blue-200">
            <span className="material-symbols-outlined"> chat_bubble </span>
          </button>
          <button className="flex h-11 w-11 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100">
            <span className="material-symbols-outlined"> settings </span>
          </button>
        </nav>
        <div className="mt-auto">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAX2lWhRSywN04RfEdq9Zcyml2PH5spXao_cbEq0tA3HrcojWd70VdRDfUwSbKjYJ9JcXal1v8cz_FCB7mdXCx4cfLK1qoYxGpfiW-8VJDwkrsDrMnWIZo_xqXdE5FF-zKbHsqESlOEN_gLPfBBqSE80b3wGm005g6IZCsy3bAuEpUNry3tYLYxhECZBfuAMn8Yo355jsAllqGjD9OHe7X8NQmcMULEdVCmILQxL7W8h74TWfQl2avbdHRLCeOuRYY4nakFCfm95FM")',
            }}
          ></div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="relative flex flex-1 flex-col overflow-hidden rounded-3xl bg-white/60 backdrop-blur-xl border border-white/30 shadow-card m-4">
        <header className="flex flex-shrink-0 items-center justify-between whitespace-nowrap border-b border-white/50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-xl"> medical_services </span>
              </div>
              <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"></span>
            </div>
            <div className="flex flex-col">
              <h2 className="text-text-primary text-lg font-bold leading-tight text-black">
                Trợ lý AI Y tế
              </h2>
              <p className="text-xs text-gray-500">
                Mã phiên: <span className="font-mono">{chatSessionId}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleNewChat}
              className="hidden sm:inline-flex items-center gap-1 rounded-full border border-blue-100 bg-white/70 px-3 py-1.5 text-xs font-medium text-blue-700 shadow-sm hover:bg-white"
              disabled={loading}
            >
              <span className="material-symbols-outlined text-sm"> refresh </span>
              Cuộc trò chuyện mới
            </button>
            <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-white/50 text-text-secondary transition hover:bg-white">
              <span className="material-symbols-outlined text-xl"> more_horiz </span>
            </button>
          </div>
        </header>

        {/* Chat History */}
        <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-4 ${
                message.role === "user" ? "" : "justify-end"
              }`}
            >
              {message.role === "assistant" && (
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10 shrink-0 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-sm"> medical_services </span>
                </div>
              )}
              <div
                className={`flex flex-1 flex-col gap-2 ${
                  message.role === "user" ? "items-start" : "items-end"
                }`}
              >
                <p
                  className={`text-sm font-semibold leading-normal text-black ${
                    message.role === "user" ? "" : "text-right"
                  }`}
                >
                  {message.role === "user" ? "Bạn" : "Trợ lý AI"}
                </p>
                {message.warning && (
                  <div className="max-w-xl rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-2 text-sm text-yellow-800">
                    {message.warning}
                  </div>
                )}
                <div
                  className={`max-w-xl rounded-2xl px-5 py-4 shadow-lg ${
                    message.role === "user"
                      ? "bg-cyan-50 text-gray-800"
                      : "bg-gradient-to-br from-blue-400 to-blue-500 text-white shadow-blue-500/20"
                  }`}
                >
                  {message.content ? (
                    <p className="text-sm font-normal leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span
                        className="h-2 w-2 animate-pulse rounded-full bg-white"
                        style={{ animationDelay: "0s" }}
                      ></span>
                      <span
                        className="h-2 w-2 animate-pulse rounded-full bg-white"
                        style={{ animationDelay: "0.2s" }}
                      ></span>
                      <span
                        className="h-2 w-2 animate-pulse rounded-full bg-white"
                        style={{ animationDelay: "0.4s" }}
                      ></span>
                    </div>
                  )}
                </div>
                {message.citations && message.citations.length > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    Tài liệu tham khảo: {message.citations.join(", ")}
                  </div>
                )}
                {message.confidence && (
                  <div className="text-xs text-gray-500">
                    Độ tin cậy: {(message.confidence * 100).toFixed(1)}%
                  </div>
                )}
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  {message.timestamp.toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {message.role === "user" && (
                <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-semibold">
                  {session?.user?.fullName?.[0] || "U"}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="mt-auto flex flex-shrink-0 flex-col border-t border-white/50 px-6 py-4">
          {error && (
            <div className="mb-2 rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-800">
              {error}
            </div>
          )}
          <div className="relative">
            <textarea
              ref={textareaRef}
              className="form-textarea w-full resize-none rounded-full border-none bg-white py-3 pl-6 pr-36 text-sm text-black shadow-subtle placeholder:text-gray-500 focus:ring-2 focus:ring-blue-300/50"
              placeholder="Nhập câu hỏi về sức khỏe của bạn..."
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError(null);
              }}
              onKeyPress={handleKeyPress}
              disabled={loading}
            ></textarea>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 z-10">
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-chat text-white transition-colors hover:bg-primary-chat/80 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="material-symbols-outlined text-xl animate-spin"> refresh </span>
                ) : (
                  <span className="material-symbols-outlined text-xl"> send </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Right Info Sidebar */}
      <aside className="hidden w-96 flex-shrink-0 flex-col gap-6 pr-6 py-6 xl:flex">
        <div className="flex flex-col gap-6 rounded-3xl bg-white/60 p-6 backdrop-blur-xl border border-white/30 shadow-card">
          <h3 className="font-bold text-lg text-black">Thông tin</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              <strong className="font-medium text-black">Trợ lý AI Y tế</strong>
            </p>
            <p className="text-xs text-gray-500">
              Tôi có thể giúp bạn trả lời các câu hỏi về sức khỏe dựa trên kiến thức y khoa và tài
              liệu từ PubMed.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-6 rounded-3xl bg-white/60 p-6 backdrop-blur-xl border border-white/30 shadow-card">
          <h3 className="font-bold text-lg text-black">Lưu ý</h3>
          <div className="text-xs text-gray-600 space-y-2">
            <p>• Thông tin chỉ mang tính tham khảo</p>
            <p>• Không thay thế tư vấn y tế chuyên nghiệp</p>
            <p>• Trong trường hợp khẩn cấp, hãy gọi 115</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
