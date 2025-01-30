import React from 'react'

export default function Message({message, isUserMessage}: {message: string, isUserMessage: boolean}) {
  return (
    <div
      className={`flex items-center  ${
        isUserMessage ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-xs md:max-w-sm lg:max-w-lg break-words text-white p-2 rounded-lg my-2 ${
          isUserMessage ? "bg-primary" : "bg-blue-500"
        }`}
      >
        <p className="text-sm  ">{message}</p>
      </div>
    </div>
  );
}
