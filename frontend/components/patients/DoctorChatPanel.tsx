"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { doctorMessages } from "@/lib/data";

export function DoctorChatPanel() {
  const [messages, setMessages] = useState(doctorMessages);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input) return;
    setMessages((prev) => [...prev, { id: `new-${Date.now()}`, author: "Doctor", content: input, timestamp: "Now" }]);
    setInput("");
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border bg-card/80 p-4">
      <div className="flex-1 space-y-3 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className={`rounded-2xl px-3 py-2 text-sm ${message.author === "Doctor" ? "bg-primary/10 text-primary" : "bg-muted"}`}>
            <p className="font-semibold text-xs">{message.author}</p>
            <p>{message.content}</p>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{message.timestamp}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        <Textarea rows={3} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Message patient" />
        <Button onClick={sendMessage} type="button">
          Send
        </Button>
      </div>
    </div>
  );
}
