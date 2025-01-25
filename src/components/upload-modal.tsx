"use clint";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Upload } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function UploadModal() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>
          رفع ملف جديد <Upload />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-right mr-6">رفع الملف</DialogTitle>
          {/* <DialogDescription className='text-right mr-6'>
            اسحب الملفات هنا أو اضغط لتحميلها
          </DialogDescription> */}
        </DialogHeader>

        <form className="flex flex-col gap-4">
          <div>
            <Label>اختر ملف</Label>
            <Input type="file" placeholder="اختار ملف" />
            <p className="text-[12px] mt-1 text-gray-500">
              * الرجاء التاكد ان صيغة الملف PDF
            </p>
          </div>
          <Button type="submit">رفع</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
