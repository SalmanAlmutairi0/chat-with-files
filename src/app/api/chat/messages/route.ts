import openai from "@/lib/openai";
import { supabaseServer } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export const GET = async (req: Request) => {
  const url = new URL(req.url);
  const fileId = url.searchParams.get("fileId");
  const { userId } = await auth();

  if(!userId){
    return NextResponse.json({
      status: 401,
      message:"unauthorized"
    })
  }

  if (!fileId) {
    return NextResponse.json({
      status: 400,
      message: "fileID is required",
    });
  }

  const { data, error } = await supabaseServer
    .from("messages")
    .select("id, message, is_user_message")
    .eq("file_id", fileId);

  if (error) {
    console.log("error geting user messages");
    return NextResponse.json({
      status: 500,
      message: "Error geting user messages",
    });
  }

  console.log(data);

  return NextResponse.json({
    status: 200,
    message: "Messages retrieved successfully",
    data: data,
  });
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

    const aiResponse = res.choices[0].message.content;
    if (!aiResponse) {
      throw new Error("something went wrong, Please try again");
    }

    const { error: insertMessagesError } = await supabaseServer
      .from("messages")
      .insert([
        { file_id: fileID, message: userMessage, is_user_message: true },
        { file_id: fileID, message: aiResponse, is_user_message: false },
      ]);

    if (insertMessagesError) {
      throw new Error("something went wrong, Please try again");
    }

    return NextResponse.json({
      status: 200,
      model: res.model,
      data: {
        message: res.choices[0].message.content,
        is_user_message: false,
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
