"use client";

import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type file = {
  id: number;
  file_name: string;
  file_url: string;
};

export default function PdfViewer({ fileID }: { fileID: string }) {
  const { userId } = useAuth();
  const router = useRouter();
  const [file, setFile] = useState<file | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFile = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/files/${fileID}`);

        if (!res.ok) {
          throw new Error("Error fetching file");
        }

        const data = await res.json();

        if (data.status !== 200) {
          toast({
            title: "خطأ",
            description: data.message,
            variant: "destructive",
          });
          router.replace("/myfiles");
        }

        setFile(() => data.data);
        console.log(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFile();
  }, [userId]);

  return (
    <div className="flex-1 border rounded-lg">
      <div className="h-full flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg text-left font-semibold">{file?.file_name}</h2>
        </div>

        <div className="flex-1 p-2 flex justify-center items-center">
          {loading || !file?.file_url ? (
            <div className="absolute ">
              {" "}
              <Loader2 size={60} className="animate-spin" />{" "}
            </div>
          ) : (
            <iframe
              src={`${file?.file_url}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-full rounded-lg border"
            />
          )}
        </div>
      </div>
    </div>
  );
}
