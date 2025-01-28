"use client";

import { useAuth } from "@clerk/nextjs";
import { CloudFog, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

type file = {
  id: number;
  file_name: string;
  file_url: string;
};

export default function PdfViewer({ fileID }: { fileID: string }) {
  const { userId } = useAuth();
  const [file, setFile] = useState<file | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFile = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/files/${fileID}?userID=${userId}`, {
        });

        if (!res.ok) {
          throw new Error("Error fetching file");
        }

        const data = await res.json();
        setFile(() => data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFile();
  }, [fileID, userId]);


 
  return (
    <div className="flex-1 border rounded-lg">
      <div className="h-full flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg text-left font-semibold">file_example.pdf</h2>
        </div>

        <div className="flex-1 p-2 flex justify-center items-center">
          {loading ? (
            <div className="absolute ">
              {" "}
              <Loader2 size={60} className="animate-spin" />{" "}
            </div>
          ) : null}

          <iframe
            src={file?.file_url}
            className="w-full h-full rounded-lg border"
          />
        </div>
      </div>
    </div>
  );
}
