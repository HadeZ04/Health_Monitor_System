"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function VoiceChatPanel() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");

  const handleVoiceToggle = () => {
    if (isListening) {
      setIsListening(false);
      setTranscript("What is my current heart rate status?");
      // Simulate AI response
      setTimeout(() => {
        setIsSpeaking(true);
        setTimeout(() => setIsSpeaking(false), 3000);
      }, 1000);
    } else {
      setIsListening(true);
      setTranscript("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Voice Chat</CardTitle>
        <CardDescription>Speech-to-text & text-to-speech</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleVoiceToggle}
            className={`flex h-20 w-20 items-center justify-center rounded-full text-4xl transition-all ${
              isListening 
                ? 'animate-pulse bg-red-500 hover:bg-red-600' 
                : 'bg-primary hover:bg-primary/90'
            }`}
          >
            {isListening ? '🎙️' : '🎤'}
          </button>
          
          <div className="text-center">
            {isListening && (
              <Badge className="bg-red-500 animate-pulse">Listening...</Badge>
            )}
            {isSpeaking && (
              <Badge className="bg-blue-500 animate-pulse">Speaking...</Badge>
            )}
            {!isListening && !isSpeaking && (
              <Badge variant="secondary">Ready</Badge>
            )}
          </div>
        </div>

        {transcript && (
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground mb-1">Transcript:</p>
            <p className="text-sm">{transcript}</p>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-xs font-semibold">Voice Features:</p>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>✓ Real-time speech recognition</li>
            <li>✓ Natural language understanding</li>
            <li>✓ Text-to-speech responses</li>
            <li>✓ Multi-language support (EN/VI)</li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm">🇺🇸 English</Button>
          <Button variant="outline" size="sm">🇻🇳 Tiếng Việt</Button>
        </div>

        <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-3">
          <p className="text-xs">
            <strong>Tip:</strong> Ask questions naturally like "What's my blood pressure?" or "Explain my ECG results"
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
