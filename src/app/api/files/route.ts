import openai from "@/lib/openai";
import { supabaseServer } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const { userId } = await auth();


    if (!userId) {
      console.log("not authorized you have to login first");
      return NextResponse.json({
        status: 401,
        message: "not authorized you have to login first",
      });
    }

    if (!file) {
      console.log("No file received");
      return NextResponse.json({
        status: 404,
        message: "No file received",
      });
    }

    const fileBuffer = new Blob([file]);
    const bucketName = "files" as string;
    const uploadPath = `public/${userId}/${file.name}`;

    // seving file in supabase storage
    const { data, error } = await supabaseServer.storage
      .from(bucketName)
      .upload(uploadPath, file, {
        contentType: file.type,
      });

    if (error) {
      console.error("Error uploading file to storage:", error);
      return NextResponse.json({
        status: 500,
        message: "Error uploading file to storage",
        toast: {
          title: "خطأ",
          description: "حدث خطأ اثناء رفع الملف",
          variant: "destructive",
        },
      });
    }

    // Save the file metadata in the database
    const { data: fileData, error: fileError } = await supabaseServer
      .from("files")
      .insert({
        file_name: file.name,
        file_path: data.fullPath,
        file_format: file.type,
        file_size: file.size,
        user_id: userId,
      })
      .select()
      .single();

    if (fileError) {
      console.error("Error saving file metadata:", fileError);
      return NextResponse.json({
        status: 500,
        message: "Error saving file metadata",
        toast: {
          title: "خطأ",
          description: "حدث خطأ اثناء رفع الملف",
          variant: "destructive",
        },
      });
    }

    const pdfLoader = new PDFLoader(fileBuffer);
    const documents = await pdfLoader.load();

    // Convert the text to embeddings (vectorize) using OpenAI
    const embeddings = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: documents.map((doc) => doc.pageContent),
    });

    const embeddingRecords = embeddings.data.map((embedding, index) => ({
      file_id: fileData.id,
      vector: embedding.embedding,
      content: documents[index].pageContent,
    }));

    // insert embeddings in db
    const { error: embedError } = await supabaseServer
      .from("embeddings")
      .insert(embeddingRecords);

    if (embedError) {
      console.error("Embedding save error:", embedError);
      return NextResponse.json({
        status: 500,
        message: "Failed to save embeddings",
      });
    }

    return NextResponse.json({
      status: 200,
      message: "File processed successfully",
      data: {
        fileId: fileData.id,
        pages: documents.length,
        embeddings: embeddingRecords.length,
      },
      toast: {
        title: "تم",
        description: "تم معالجة الملف بنجاح",
        variant: "default",
      },
    });
  } catch (error) {
    console.error("Error handling file upload:", error);
    return NextResponse.json({
      status: 500,
      message: "Error handling file upload",
      toast: {
        title: "خطأ",
        description: "حدث خطأ اثناء رفع الملف",
        variant: "destructive",
      },
    });
  }
};

export const GET = async (req: Request) => {
  const { userId } = await auth();

  console.log("User ID:", userId);

  if (!userId) {
    return NextResponse.json({
      status: 401,
      message: "not authorized you have to login first",
    });
  }

  const { data, error } = await supabaseServer
    .from("files")
    .select("*")
    .order("id", { ascending: false })
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching files:", error);
    return NextResponse.json({
      status: 500,
      message: "Error fetching files",
    });
  }

  console.log(data);

  return NextResponse.json({
    status: 200,
    message: "Files fetched successfully",
    data: data,
  });
};
