import Chat from "@/components/chat";
import PdfViewer from "@/components/pdf-viewer";
import React from "react";

export default async function File({
  params,
}: {
  params: Promise<{ fileID: string }>;
}) {

    const { fileID } = await params;


  return (
    <div className="container flex justify-between mx-auto gap-4 mt-2 min-h-[80vh] max-h-[90vh]">
      <Chat fileID={fileID} />
      <PdfViewer fileID={fileID} />
    </div>
  );
}
