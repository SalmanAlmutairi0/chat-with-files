import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { ModeToggle } from "./ui/mode-toggle";
import { SignedIn, SignedOut, SignIn, SignInButton, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="font-semibold border-b border-gray-200">
      <div className="container mx-auto p-4 flex items-center justify-between">
        <Link href="/">
          <h1>مستنداتي الذكية</h1>
        </Link>

        <div className="flex items-center gap-4">
          <ModeToggle />
          
          <SignedIn>
            <Link href="/myfiles">
              <Button>مستنداتي</Button>
            </Link>
            <UserButton />
          </SignedIn>

          <SignedOut>
           <SignInButton>
            <Button>تسجيل الدخول</Button>
           </SignInButton>
          </SignedOut>

        </div>
      </div>
    </nav>
  );
}
