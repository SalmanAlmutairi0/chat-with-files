import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Plus, TrashIcon } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

export default function FileCard() {
  return (
    <Card className="w-4/5 ">
      <CardHeader>
        <CardTitle className="text-left">examples_Ch11 1.pdf</CardTitle>
      </CardHeader>
      <Separator />
      <CardFooter className="flex justify-between items-center mt-3">
        <CardDescription>
          <Badge variant="outline" className='bg-green-500'>Excel</Badge>
        </CardDescription>
        <CardDescription className="flex items-center">
          <Plus size={14} /> sep 12
        </CardDescription>
        <CardDescription><Button variant={'destructive'} className='p-3'> <TrashIcon /> </Button>  </CardDescription>
      </CardFooter>
    </Card>
  );
}
