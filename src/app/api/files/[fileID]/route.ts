import { supabaseServer } from "@/lib/supabase";
import { NextResponse } from "next/server";

type fileMetaData = {
  id: string;
  file_name: string;
  file_path: string;
  file_format: string;
  file_size: number;
  user_id: string;
  uploaded_at: string;
  deleted_at: string | null;
};
export async function GET(
  request: Request,
  { params }: { params: { fileID: string } }
) {
  const { fileID } = await params;
  const url = new URL(request.url);
  const userID = url.searchParams.get("userID");

  try {
    if (!fileID) {
      throw new Error("fileID is required");
    }

    if (!userID) {
      throw new Error("not authorized, you have to login first");
    }

    const { data, error }: { data: fileMetaData | null; error: any } =
      await supabaseServer
        .from("files")
        .select("*")
        .eq("id", fileID)
        .eq("user_id", userID)
        .single();

    if (error) {
      console.error("Error fetching file:", error);
      throw new Error("Error geting file metadata");
    }

    if (!data?.file_path) {
      throw new Error("File path is missing");
    }

    // geting the file url from the storage
    const { data: fileData } = supabaseServer.storage
      .from("files")
      .getPublicUrl(data.file_path);

    const fileDetails = {
      id: data.id,
      file_name: data.file_name,
      file_url: fileData.publicUrl,
    };

    return NextResponse.json({
      status: 200,
      message: `File with ID ${fileID} fetched successfully`,
      data: fileDetails,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      message: (error as Error).message,
    });
  }
}
