import Link from "next/link";
import React from "react";

export default function Fotter() {
  return (
    <div className="border-t py-6 mt-5 w-full ">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        <p className=" text-sm">
          © {new Date().getFullYear()} جميع الحقوق محفوظة.
        </p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          {/* LinkedIn Icon */}
          <Link href={"#"}>
            <svg
              className="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.762 2.239 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.25c-.966 0-1.75-.79-1.75-1.75s.784-1.75 1.75-1.75 1.75.79 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.25h-3v-5.5c0-1.311-.027-3-1.828-3-1.83 0-2.112 1.428-2.112 2.903v5.597h-3v-10h2.88v1.367h.041c.402-.762 1.383-1.563 2.846-1.563 3.041 0 3.602 2.001 3.602 4.604v5.592z" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
