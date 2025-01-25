import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="font-semibold border-b border-gray-200">
      <div className="container mx-auto p-4 flex items-center justify-between">
        <Link href="/">
          <h1>مستنداتي الذكية</h1>
        </Link>
        <Button className="bg-violet-800 hover:bg-violet-900">مستنداتي</Button>
      </div>
    </nav>
  );
}
