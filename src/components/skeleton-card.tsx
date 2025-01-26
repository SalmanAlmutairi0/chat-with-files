import React from "react";
import { Skeleton } from "./ui/skeleton";
import { Separator } from "./ui/separator";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function SkeletonCard() {
  return (
    <Card className="w-4/5 ">
      <CardHeader>
        <CardTitle className="text-left">
          {" "}
          <Skeleton className="h-4" />{" "}
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardFooter className="flex justify-between items-center mt-3">
        <CardDescription>
          <Skeleton className="h-6 w-20" />
        </CardDescription>
        <CardDescription className="flex items-center">
          {/* <Skeleton className="h-4 w-4 rounded-full" /> */}
          <Skeleton className="h-4 w-16" />
        </CardDescription>
        <CardDescription>
          <Skeleton className="h-8 w-8 rounded-full" />
        </CardDescription>
      </CardFooter>
    </Card>
  );
}
