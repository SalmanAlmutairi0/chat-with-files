"use client";
import FileList from "@/components/file-list";
import SkeletonCard from "@/components/skeleton-card";
import UploadModal from "@/components/upload-modal";
import React, { useState } from "react";

export default function MyFiles() {
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  return (
    <div className="container mx-auto flex flex-col space-y-24 mt-10 min-h-svh ">
      <div className="flex items-center justify-between px-2 md:px-4">
        <h1 className="text-3xl font-semibold ">مستنداتي</h1>
        <UploadModal
          setIsLoading={setIsUploadLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
        {isUploadLoading && <SkeletonCard />}
        <FileList newFileUploaded={isUploadLoading} />
      </div>
    </div>
  );
}
