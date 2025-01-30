"use client";
import React, { useState } from "react";
import Message from "./message";
import { ChatMessage } from "./chat";


export default function MessagesList({ messages }: { messages: ChatMessage[] }) {
  if (messages.length === 0 || !messages) {
    return (
      <div className="absolute flex flex-col justify-center mx-auto w-full h-full text-center space-y-4">
        <h1 className="text-sm text-gray-400">
          💬 الحين، ابدأ بطرح أسئلتك علشان اساعدك بالملف.
        </h1>
        <p className="text-2xl text-gray-300">🤖 ! اسأل أي شيء</p>
      </div>
    );
  }

  return (
    <>
      {messages?.map((message) => (
        <Message
          key={message.id}
          message={message.message}
          is_user_message={message.is_user_message}
        />
      ))}
    </>
  );
}
