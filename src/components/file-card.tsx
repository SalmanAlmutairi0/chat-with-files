import React from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import { Plus, TrashIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Files } from "./file-list";
import { formatedDate } from "@/lib/utils";

export default function FileCard({ props }: { props: Files }) {
  return (
    <Card className="w-4/5 ">
      <CardHeader>
        <CardTitle className="text-left">{props.file_name}</CardTitle>
      </CardHeader>
      <Separator />
      <CardFooter className="flex justify-between items-center mt-3">
        <CardDescription>
          <Badge variant="outline" className="bg-green-500">
            {props.file_format.split("/")[1]}
          </Badge>
        </CardDescription>
        <CardDescription className="flex items-center gap-1">
          <Plus size={14} /> {formatedDate(props.uploaded_at)}
        </CardDescription>
        <CardDescription>
          <Button variant={"destructive"} className="p-3">
            {" "}
            <TrashIcon />{" "}
          </Button>{" "}
        </CardDescription>
      </CardFooter>
    </Card>
  );
}
