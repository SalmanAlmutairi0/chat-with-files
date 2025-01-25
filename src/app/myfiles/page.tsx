import { Button } from '@/components/ui/button';
import React from 'react'

export default function MyFiles() {
  return <div className='container mx-auto mt-10 '>
        <div className="flex items-center justify-between">
            <h1 className='text-3xl font-semibold '>مستنداتي</h1>
            <Button >إنشاء ملف جديد</Button>
        </div>

  </div>;
}
