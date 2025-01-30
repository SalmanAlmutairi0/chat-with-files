"use client";
import React, { useEffect, useRef, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { Textarea } from "./ui/textarea";
import MessagesList from "./messages-list";
import { useAuth } from "@clerk/nextjs";

export type ChatMessage = {
  id: number;
  message: string;
  is_user_message: boolean;
};

export default function Chat({ fileID }: { fileID: string }) {
  const { userId } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[] | []>([]);
  const [message, setMessage] = useState<string>("");
  const [sednMessageLoading, setSendMessageLoading] = useState(false);
  const [isAiMessageLoading, setisAiMessageLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const getUserMessages = async () => {
      try {
        const res = await fetch(`/api/chat/messages?fileId=${fileID}`)

        if(!res.ok){
          console.log("something went wrong");
          throw new Error("something went wrong")
        }

        const data = await res.json()
        setMessages(data.data)
        console.log(data);

      } catch (e) {
        console.log(e);
      }
    };

    getUserMessages();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(() => e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (message.trim() === "") {
      return;
    }

    // add user message to the array
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        message: message,
        is_user_message: true,
      },
    ]);
    setMessage("");

    try {
      setSendMessageLoading(true);
      setisAiMessageLoading(true);
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        body: JSON.stringify({ userId, fileID, userMessage: message }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("حدث خطأ اثناء ارسال الرسالة");
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          message: data.data.message,
          is_user_message: data.data.is_user_message,
        },
      ]);

      console.log("user message", data.message);
    } catch (error) {
      console.log(error);
    } finally {
      setSendMessageLoading(false);
      setisAiMessageLoading(false);
    }
  };

  return (
    <div className="w-1/2 border rounded-lg flex flex-col justify-between">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">مرحبا بك في المحادثة 😊</h2>
      </div>

      <ScrollArea className="p-4 text-right flex-1">
        <MessagesList messages={messages}  />
        {isAiMessageLoading ? (
          <p className="flex justify-start text-secondary animate-bounce">
            {" "}
            الذكاء الاصطناعي يفكر...{" "}
          </p>
        ) : null}
      </ScrollArea>

      <form
        className="flex justify-between items-center p-3 gap-2 float-end "
        onSubmit={(e) => handleSendMessage(e)}
      >
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleInputChange}
          placeholder="ابدا اسال الذكاء الاصطناعي 🤩"
          className="resize-none max-h-[300px] overflow-auto rounded-lg"
          rows={1}
        />
        <Button
          className="px-4 py-5 h-12"
          type="submit"
          disabled={sednMessageLoading}
        >
          <Send size={24} />
        </Button>
      </form>
    </div>
  );
}
