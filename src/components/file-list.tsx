"use client";

import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import FileCard from "./file-card";
import Link from "next/link";
import LoadingCard from "./loading-cards";

export type Files = {
  id: string;
  file_name: string;
  file_path: string;
  file_format: string;
  file_size: number;
  user_id: string;
  uploaded_at: string;
  deleted_at: string | null;
};

type FileRes = {
  status: number;
  message: string;
  data: Files[] | [];
};

export default function FileList({
  newFileUploaded,
}: {
  newFileUploaded: boolean;
}) {
  const [files, setFiles] = useState<Files[]>([]);
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();
  const { toast } = useToast();
  console.log(userId);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/files?userID=${userId?.trim()}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("حدث خطأ اثناء جلب الملفات");
        }

        const data: FileRes = await res.json();
        setFiles(() => data.data);

        toast({
          title: "تم",
          description: "تم جلب الملفات بنجاح",
          variant: "default",
        });
      } catch (error) {
        console.error(error);
        toast({
          title: "خطأ",
          description: "حدث خطأ اثناء جلب الملفات",
          variant: "destructive",
        });
      }finally {
        setLoading(false);  
      }
    };

    fetchFiles();
  }, [userId, newFileUploaded]);

  return (
    <>
      {loading && <LoadingCard />}

      {files.length === 0 && !newFileUploaded && !loading && (
        <div className="absolute space-y-3 text-center">
          <h1 className="text-4xl font-bold"> ماعندك ملفات حالياً 📂</h1>
          <p className="text-gray-500">⬆️ ارفع ملف وابدا تواصل معه الان 📄</p>
        </div>
      )}
      {files.map((file) => (
        <Link
          href={`/myfiles/${file.id}`}
          key={file.id}
          className="w-full transition duration-300 ease-in-out transform  hover:-translate-y-2"
        >
          <FileCard key={file.id} props={file} />
        </Link>
      ))}
    </>
  );
}
