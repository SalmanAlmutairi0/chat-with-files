"use client";

import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import SkeletonCard from "./skeleton-card";
import FileCard from "./file-card";

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

export default function FileList({ newFileUploaded }: { newFileUploaded: boolean }) {
  const [files, setFiles] = useState<Files[]>([]);
  const { userId } = useAuth();
  const { toast } = useToast();
  console.log(userId);

  useEffect(() => {
    const fetchFiles = async () => {
      const res = await fetch(`/api/files?userID=${userId?.trim()}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        toast({
          title: "خطأ",
          description: "حدث خطأ اثناء جلب الملفات",
          variant: "destructive",
        });
        return;
      }

      const data: FileRes = await res.json();
      setFiles(() => data.data);

      toast({
        title: "تم",
        description: "تم جلب الملفات بنجاح",
        variant: "default",
      });

      console.log(data);
    };

    fetchFiles();
  }, [userId, newFileUploaded]);

  return (
    <>
      {files.map((file) => (
          <FileCard
            key={file.id}
            props={file}
            />
      ))}
    </>
  );
}
