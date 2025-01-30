"use client";
import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { Textarea } from "./ui/textarea";
import MessagesList from "./messages-list";
import { useChat } from "@/hooks/use-chat";


export default function Chat({ fileID }: { fileID: string }) {
    const {
      messages,
      message,
      textareaRef,
      sendMessageLoading,
      isAiMessageLoading,
      handleInputChange,
      handleSendMessage,
    } = useChat(fileID);
 
  return (
    <div className="w-1/2 border rounded-lg flex flex-col justify-between">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">مرحبا بك في المحادثة 😊</h2>
      </div>

      <ScrollArea className="p-4 text-right flex-1">
        <MessagesList messages={messages} />
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
          disabled={sendMessageLoading}
        >
          <Send size={24} />
        </Button>
      </form>
    </div>
  );
}
