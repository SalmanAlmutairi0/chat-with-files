import { Button } from '@/components/ui/button';
import UploadModal from '@/components/upload-modal';
import { Upload } from 'lucide-react';
import React from 'react'

export default function MyFiles() {

  return (
    <div className="container mx-auto mt-10 ">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold ">مستنداتي</h1>
        <UploadModal />
       
      </div>

 
    </div>
  );
}
