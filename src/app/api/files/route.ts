import { supabaseServer } from "@/lib/supabase";
import { CloudLightning } from "lucide-react";
import { NextResponse } from "next/server";

export const POST = async (req: Request, res: Response) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const userid = formData.get("userId") as string;
    console.log("User ID:", userid);

    if (!userid) {
      console.log("not authorized you have to login first");
      return NextResponse.json({
        status: 401,
        message: "not authorized you have to login first",
        toast: {
          title: "خطأ",
          description: "يجب تسجيل الدخول اولا",
          variant: "destructive",
        },
      });
    }

    if (!file) {
      console.log("No file received");
      return NextResponse.json({
        status: 404,
        message: "No file received",
        toast: {
          title: "خطأ",
          description: "الرجاء اختيار ملف",
          variant: "destructive",
        },
      });
    }

    const fileBuffer = await file.arrayBuffer();
    const bucketName = "files" as string;
    const uploadPath = `public/${userid}/${file.name}`;

    // seving file in supabase storage
    const { data, error } = await supabaseServer.storage
      .from(bucketName)
      .upload(uploadPath, fileBuffer, {
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
        user_id: userid,
      })
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

    return NextResponse.json({
      status: 200,
      message: "File uploaded successfully",
      data: fileData,
      toast: {
        title: "تم",
        description: "تم رفع الملف بنجاح",
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
  const { searchParams } = new URL(req.url);
  const userID = searchParams.get("userID");
  console.log("User ID:", userID);

  if (!userID) {
    return NextResponse.json({
      status: 401,
      message: "not authorized you have to login first",
    });
  }

  const { data, error} = await supabaseServer
  .from("files")
  .select("*")
  .eq("user_id", userID);


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
