"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Send,
  Paperclip,
  Image as ImageIcon,
  User,
  Search,
  Phone,
  Video,
  MoreVertical,
} from "lucide-react";

export default function PatientChatPage() {
  const [selectedChat, setSelectedChat] = useState<number | null>(1);
  const [message, setMessage] = useState("");

  const conversations = [
    {
      id: 1,
      doctor: "BS. Trần Thị B",
      specialty: "Tim mạch",
      lastMessage: "Bạn cần uống thuốc đúng giờ nhé",
      lastMessageTime: "10 phút trước",
      unread: 2,
      online: true,
    },
    {
      id: 2,
      doctor: "BS. Lê Văn C",
      specialty: "Nội tiết",
      lastMessage: "Kết quả xét nghiệm đã có",
      lastMessageTime: "2 giờ trước",
      unread: 0,
      online: false,
    },
    {
      id: 3,
      doctor: "BS. Nguyễn Văn D",
      specialty: "Nội tổng quát",
      lastMessage: "Hẹn gặp bạn vào tuần sau",
      lastMessageTime: "1 ngày trước",
      unread: 0,
      online: false,
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "doctor",
      content: "Chào bạn, hôm nay cảm thấy thế nào?",
      time: "09:00",
      date: "Hôm nay",
    },
    {
      id: 2,
      sender: "patient",
      content: "Chào bác sĩ. Em cảm thấy khá hơn nhiều ạ.",
      time: "09:05",
      date: "Hôm nay",
    },
    {
      id: 3,
      sender: "doctor",
      content: "Tốt lắm. Huyết áp có ổn định không?",
      time: "09:06",
      date: "Hôm nay",
    },
    {
      id: 4,
      sender: "patient",
      content: "Em đo sáng nay là 120/80 ạ.",
      time: "09:08",
      date: "Hôm nay",
    },
    {
      id: 5,
      sender: "doctor",
      content: "Rất tốt! Tiếp tục duy trì nhé. Nhớ uống thuốc đúng giờ.",
      time: "09:10",
      date: "Hôm nay",
    },
    {
      id: 6,
      sender: "patient",
      content: "Dạ em cảm ơn bác sĩ ạ!",
      time: "09:12",
      date: "Hôm nay",
    },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // API call to send message
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const selectedConversation = conversations.find((c) => c.id === selectedChat);

  return (
    <div className="h-[calc(100vh-100px)] p-6">
      <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <Card className="lg:col-span-1 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary-600" />
              Tin nhắn
            </CardTitle>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Tìm bác sĩ..." className="pl-9" />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            <div className="space-y-2">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedChat(conv.id)}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    selectedChat === conv.id
                      ? "bg-primary-50 border-2 border-primary-300"
                      : "bg-slate-50 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-bold">
                        {conv.doctor.split(" ").pop()?.charAt(0)}
                      </div>
                      {conv.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-success-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-slate-900 truncate">
                          {conv.doctor}
                        </h4>
                        {conv.unread > 0 && (
                          <Badge variant="default" className="ml-2">
                            {conv.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mb-1">{conv.specialty}</p>
                      <p className="text-sm text-slate-600 truncate">
                        {conv.lastMessage}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {conv.lastMessageTime}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-2 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-bold">
                        {selectedConversation.doctor.split(" ").pop()?.charAt(0)}
                      </div>
                      {selectedConversation.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-success-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">
                        {selectedConversation.doctor}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {selectedConversation.specialty}
                      </p>
                      {selectedConversation.online && (
                        <p className="text-xs text-success-600">● Đang hoạt động</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === "patient" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] ${
                          msg.sender === "patient"
                            ? "bg-primary-500 text-white"
                            : "bg-slate-100 text-slate-900"
                        } rounded-lg p-3`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.sender === "patient" ? "text-primary-100" : "text-slate-500"
                          }`}
                        >
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <ImageIcon className="w-5 h-5" />
                  </Button>
                  <Input
                    placeholder="Nhập tin nhắn..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="w-4 h-4 mr-2" />
                    Gửi
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center text-slate-400">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Chọn một cuộc trò chuyện để bắt đầu</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
