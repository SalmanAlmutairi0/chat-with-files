import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";

export type ChatMessage = {
  id: number;
  message: string;
  is_user_message: boolean;
};

export function useChat(fileID: string) {
  const { userId } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState<string>("");
  const [isFetchingMessages, setIsFetchingMessages] = useState(false);
  const [sendMessageLoading, setSendMessageLoading] = useState(false);
  const [isAiMessageLoading, setIsAiMessageLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const getUserMessages = async () => {
      setIsFetchingMessages(true);
      try {
        const res = await fetch(`/api/chat/messages?fileId=${fileID}`);
        if (!res.ok) throw new Error("Error fetching messages");

        const data = await res.json();
        console.log(data);
        setMessages(data.data);
      } catch (e) {
        console.error(e);
        
        
      } finally {
        setIsFetchingMessages(false);
      }
    };

    getUserMessages();
  }, [fileID]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() === "") return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), message, is_user_message: true },
    ]);
    setMessage("");

    try {
      setSendMessageLoading(true);
      setIsAiMessageLoading(true);

      const res = await fetch("/api/chat/messages", {
        method: "POST",
        body: JSON.stringify({ userId, fileID, userMessage: message }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to send message");

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          message: data.data.message,
          is_user_message: data.data.is_user_message,
        },
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setSendMessageLoading(false);
      setIsAiMessageLoading(false);
    }
  };

  return {
    messages,
    message,
    textareaRef,
    isFetchingMessages,
    sendMessageLoading,
    isAiMessageLoading,
    handleInputChange,
    handleSendMessage,
  };
}
