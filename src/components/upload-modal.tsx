"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Upload } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "@/hooks/use-toast";
import { RedirectToSignIn, useAuth } from "@clerk/nextjs";

type UploadModalProps = {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function UploadModal({
  setIsLoading,
}: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { userId } = useAuth();
  const { toast } = useToast();

  if (!userId) {
    return <RedirectToSignIn />;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileValidation = (file: File) => {
    if (file.type !== "application/pdf") {
      toast({
        title: "خطأ",
        description: " الرجاء التاكد ان صيغة الملف PDF",
        variant: "destructive",
      });
      return false;
    }

    if (file.size > 4 * 1024 * 1024) {
      toast({
        title: "خطأ",
        description: "الرجاء التاكد من حجم الملف لا يتجاوز 4 ميجا",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: "خطأ",
        description: "الرجاء اختيار ملف",
        variant: "destructive",
      });
      return;
    }

    const isValid = handleFileValidation(file);

    if (!isValid) {
      console.log("file is not valid");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);

    console.log(formData.get("userId"));
    try {
      setIsLoading(true);
      setIsOpen(false);
      // Send the file to the server
      const res = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("حدث خطأ اثناء رفع الملف");
      }

      const data = await res.json();
      toast({
        title: data.toast.title,
        description: data.toast.description,
        variant: data.toast.variant,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "خطأ",
        description: "حدث خطأ اثناء رفع الملف",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setFile(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button>
          رفع ملف جديد <Upload />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-right mr-6">رفع الملف</DialogTitle>
        </DialogHeader>

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => handleFileUpload(e)}
        >
          <div>
            <Label>اختر ملف</Label>
            <Input
              type="file"
              placeholder="اختار ملف"
              onChange={(e) => handleFileChange(e)}
              className="text-right border border-gray-500"
            />
            <p className="text-[12px] mt-1 text-gray-500">
              * الرجاء التاكد ان صيغة الملف PDF
            </p>
            <p className="text-[12px] mt-1 text-gray-500">
              * الرجاء التاكد من حجم الملف لا يتجاوز 4 ميجا
            </p>
          </div>
          <Button type="submit">رفع</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
