"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  User,
  Clock,
  CheckCheck,
  Circle,
} from "lucide-react";

export default function DoctorMessagesPage() {
  const [selectedChat, setSelectedChat] = useState(1);
  const [messageText, setMessageText] = useState("");

  const conversations = [
    {
      id: 1,
      patient: "Nguyễn Văn An",
      code: "BN001234",
      avatar: "/api/placeholder/40/40",
      lastMessage: "Cảm ơn bác sĩ, con đã uống thuốc đúng giờ ạ",
      lastTime: "5 phút trước",
      unread: 0,
      online: true,
      priority: "normal",
    },
    {
      id: 2,
      patient: "Trần Thị Bình",
      code: "BN001235",
      avatar: "/api/placeholder/40/40",
      lastMessage: "Bác sĩ ơi, em thấy hơi khó thở...",
      lastTime: "15 phút trước",
      unread: 2,
      online: true,
      priority: "high",
    },
    {
      id: 3,
      patient: "Lê Văn Công",
      code: "BN001236",
      avatar: "/api/placeholder/40/40",
      lastMessage: "Kết quả xét nghiệm của em đã ra chưa ạ?",
      lastTime: "1 giờ trước",
      unread: 1,
      online: false,
      priority: "normal",
    },
    {
      id: 4,
      patient: "Phạm Thị Dung",
      code: "BN001237",
      avatar: "/api/placeholder/40/40",
      lastMessage: "Bác sĩ đã nhận được ảnh chưa ạ?",
      lastTime: "2 giờ trước",
      unread: 0,
      online: false,
      priority: "normal",
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "patient",
      text: "Chào bác sĩ, hôm nay em đo huyết áp được 125/82 ạ",
      time: "10:30",
      status: "read",
    },
    {
      id: 2,
      sender: "doctor",
      text: "Chào em, kết quả rất tốt đấy. Em đang tuân thủ tốt việc uống thuốc phải không?",
      time: "10:32",
      status: "read",
    },
    {
      id: 3,
      sender: "patient",
      text: "Dạ vâng, em uống đều đặn ạ. Nhưng em có hơi đau đầu nhẹ vào buổi sáng",
      time: "10:33",
      status: "read",
    },
    {
      id: 4,
      sender: "doctor",
      text: "Đau đầu có thể là tác dụng phụ của thuốc. Nếu tình trạng kéo dài, em đến khám để bác sĩ điều chỉnh liều nhé.",
      time: "10:35",
      status: "read",
    },
    {
      id: 5,
      sender: "patient",
      text: "Cảm ơn bác sĩ, con đã uống thuốc đúng giờ ạ",
      time: "14:25",
      status: "read",
    },
  ];

  const currentConversation = conversations.find((c) => c.id === selectedChat);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Handle send message logic
      console.log("Sending:", messageText);
      setMessageText("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Tin nhắn</h1>
        <p className="text-slate-600">Trao đổi và tư vấn với bệnh nhân</p>
      </div>

      {/* Chat Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Conversations List */}
        <Card className="lg:col-span-1 border-slate-200 shadow-lg">
          <CardHeader className="border-b border-slate-200 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Tìm bệnh nhân..."
                className="pl-10 bg-slate-50"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedChat(conv.id)}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedChat === conv.id
                      ? "bg-primary-50 border-l-4 border-primary-500"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar with Online Status */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-teal-400 rounded-full flex items-center justify-center text-white font-bold">
                        {conv.patient.charAt(0)}
                      </div>
                      <div
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                          conv.online ? "bg-success-500" : "bg-slate-300"
                        }`}
                      ></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-slate-800 truncate">
                          {conv.patient}
                        </p>
                        {conv.unread > 0 && (
                          <Badge className="bg-danger-500 text-white text-xs">
                            {conv.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mb-1">{conv.code}</p>
                      <p className="text-sm text-slate-600 truncate">{conv.lastMessage}</p>
                      <p className="text-xs text-slate-500 mt-1">{conv.lastTime}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right: Chat Window */}
        <Card className="lg:col-span-2 border-slate-200 shadow-lg">
          {currentConversation ? (
            <>
              {/* Chat Header */}
              <CardHeader className="border-b border-slate-200 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-teal-400 rounded-full flex items-center justify-center text-white text-lg font-bold">
                        {currentConversation.patient.charAt(0)}
                      </div>
                      {currentConversation.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-success-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">
                        {currentConversation.patient}
                      </p>
                      <p className="text-sm text-slate-600">
                        {currentConversation.code} •{" "}
                        <span
                          className={
                            currentConversation.online
                              ? "text-success-600"
                              : "text-slate-500"
                          }
                        >
                          {currentConversation.online ? "Đang online" : "Offline"}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages Area */}
              <CardContent className="p-0">
                <div className="h-[450px] overflow-y-auto p-6 bg-slate-50">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.sender === "doctor" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] ${
                            msg.sender === "doctor"
                              ? "bg-gradient-to-r from-primary-500 to-teal-500 text-white"
                              : "bg-white border border-slate-200 text-slate-800"
                          } rounded-2xl px-4 py-3 shadow-sm`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <div className="flex items-center justify-end gap-1 mt-2">
                            <span
                              className={`text-xs ${
                                msg.sender === "doctor"
                                  ? "text-white/70"
                                  : "text-slate-500"
                              }`}
                            >
                              {msg.time}
                            </span>
                            {msg.sender === "doctor" && (
                              <CheckCheck
                                className={`w-4 h-4 ${
                                  msg.status === "read"
                                    ? "text-white"
                                    : "text-white/50"
                                }`}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-slate-200 bg-white">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Input
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="Nhập tin nhắn..."
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="bg-gradient-to-r from-primary-500 to-teal-500 hover:from-primary-600 hover:to-teal-600 text-white"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Gửi
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    💡 Sử dụng tin nhắn để tư vấn nhanh. Với các vấn đề nghiêm trọng, vui lòng đặt lịch khám trực tiếp.
                  </p>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="p-12 text-center">
              <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Chọn cuộc trò chuyện
              </h3>
              <p className="text-slate-600">
                Chọn một bệnh nhân từ danh sách để bắt đầu trao đổi
              </p>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Quick Response Templates */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="border-b border-slate-200">
          <CardTitle className="text-lg text-slate-800">
            Mẫu tin nhắn nhanh
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              "Hãy uống thuốc đúng giờ và theo dõi chỉ số nhé",
              "Kết quả xét nghiệm của bạn rất tốt",
              "Vui lòng đặt lịch tái khám trong tuần tới",
              "Hãy theo dõi huyết áp mỗi ngày",
              "Nhớ kiêng ăn mặn và tập thể dục đều đặn",
              "Nếu có triệu chứng bất thường, hãy liên hệ ngay",
            ].map((template, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-left justify-start h-auto py-2 text-xs"
                onClick={() => setMessageText(template)}
              >
                {template}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
