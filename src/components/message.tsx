import React from 'react'
import ReactMarkdown from "react-markdown";


export default function Message({
  message,
  is_user_message,
}: {
  message: string;
  is_user_message: boolean;
}) {
  return (
    <div
      className={`flex items-center  ${
        is_user_message ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-xs md:max-w-sm lg:max-w-lg break-words text-white p-2 rounded-lg my-2 ${
          is_user_message ? "bg-primary" : "bg-blue-500"
        }`}
      >
        <ReactMarkdown >
          {message}
        </ReactMarkdown>
      </div>
    </div>
  );
}
