import Message from "@/components/message";
import openai from "@/lib/openai";
import { supabaseServer } from "@/lib/supabase";
import { NextResponse } from "next/server";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export const POST = async (req: Request) => {
  const { userId, fileID, userMessage } = await req.json();
  try {
    if (!userId) {
      return NextResponse.json({
        status: 401,
        message: "unauthorized",
      });
    }

    if (!userMessage.trim()) {
      return NextResponse.json({
        status: 400,
        message: "user message is required",
      });
    }

    if (!fileID) {
      return NextResponse.json({
        status: 400,
        message: "fileID is required",
      });
    }

    // embed user message
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: userMessage,
    });

    const embeddedUserMessage = embeddingResponse.data[0].embedding;

    // search user embeded message in all embded file pages for similarity
    const { data: contextData, error: vectorError } = await supabaseServer.rpc(
      "match_embeddings",
      {
        query_embedding: embeddedUserMessage,
        match_threshold: 0.3,
        match_count: 5,
        file_id: fileID,
      }
    );

    console.log("vector error", vectorError);

    if (vectorError) throw new Error("Vector search failed", vectorError);

    const context = contextData
      ?.map(
        (item: { id: number; content: string; similarity: number }) =>
          item.content
      )
      ?.join("\n---\n");

    // get the previous messages from db to send them to the openai as a context
    const { data: prevMessages, error: prevMessagesError } =
      await supabaseServer
        .from("messages")
        .select("id, message, is_user_message")
        .eq("file_id", fileID);

    if (prevMessagesError) {
      console.error("Error fetching previous messages:", prevMessagesError);
      throw new Error("Error fetching previous messages");
    }

    // Format the previous messages and the new one to send to OpenAI
    const formattedPrevMessages: ChatMessage[] = [
      ...prevMessages.map(
        (msg): ChatMessage => ({
          role: msg.is_user_message ? "user" : "assistant",
          content: msg.message,
        })
      ),
    ];

    // sending the request to OpenAi 
    const res = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.",
        },
        {
          role: "user",
          content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.

          \n----------------\n

          PREVIOUS CONVERSATION:
          ${formattedPrevMessages.map((message) => {
            if (message.role === "user") return `User: ${message.content}\n`;
            return `Assistant: ${message.content}\n`;
          })}

          \n----------------\n

          CONTEXT:
          ${context}

          USER MESSAGE: ${userMessage}`,
        },
      ],
    });

//     const res = await openai.chat.completions.create({
//       model: "gpt-4o",
//       messages: [
//         {
//           role: "system",
//           content: `You are an AI assistant that responds using semantic HTML with Tailwind CSS classes for styling. Follow these rules:
//           1. Use HTML markup with Tailwind utility classes for layout and formatting
//           2. Never add color classes (text-, bg-, border- colors) - colors are handled by CSS variables
//           3. Use proper semantic elements (article, section, ul/ol for lists)
//           4. Create tables using Tailwind table classes when presenting structured data
//           5. Maintain clean typography using text-size classes (text-base, text-lg)
//           6. Use space-y-* classes for vertical spacing between elements
//           7. Format code snippets with <code> tags and monospace font class
//           8. Never use inline styles or <style> tags`,
//         },
//         {
//           role: "user",
//           content: `Answer the question using HTML with Tailwind classes (NO COLOR CLASSES). Rules:
//         - Text formatting: Use classes like font-bold, italic, underline
//         - Lists: Use ul/ol with list-disc/list-decimal and space-y-2
//         - Tables: Use table, table-auto, thead, tr, th/td with border classes
//         - Code: Wrap in <code class="font-mono">
//         - Sections: Use space-y-4 between sections
//         - Links: Use underline class only

//          PREVIOUS CONVERSATION:
//            ${formattedPrevMessages.map((message) => {
//              if (message.role === "user") return `User: ${message.content}\n`;
//              return `Assistant: ${message.content}\n`;
//            })}

//           Context:
//           ${context}

//           Question: ${userMessage}

// `,
//         },
//       ],
//     });

    const aiResponse = res.choices[0].message.content
    if(!aiResponse){
      throw new Error("something went wrong, Please try again")
    }

    const { error: insertMessagesError } = await supabaseServer
      .from("messages")
      .insert([
        { file_id: fileID, message: userMessage, is_user_message: true },
        { file_id: fileID, message: aiResponse, is_user_message: false },
      ]);

      if(insertMessagesError){
        throw new Error("something went wrong, Please try again");
      }

    return NextResponse.json({
      status: 200,
      model: res.model,
      data: {
        message: res.choices[0].message.content,
      },
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      userId: userId,
      fileID: fileID,
      message: (error as Error).message
        ? (error as Error).message
        : "internal server error",
    });
  }
};
