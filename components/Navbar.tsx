"use client";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

const Navbar = () => {
  const { isSignedIn } = useUser();

  return (
    <nav className="border backdrop-blur-md lg:max-w-5xl md:max-w-2xl max-w-xs mx-auto md:p-4 p-2 rounded-full flex items-center justify-between">
      <span className="md:h-6 md:w-6 h-4 w-4 bg-green-600 rounded-full relative">
        <span className="md:h-6 md:w-6 h-4 w-4 bg-green-600 rounded-full absolute top-0 left-0 animate-ping" />
        <span className="md:h-6 md:w-6 h-4 w-4 bg-green-600 rounded-full relative top-0 left-0 animate-ping" />
      </span>

      <div className="md:space-x-8 space-x-4 md:text-base text-xs whitespace-nowrap hidden md:flex items-center justify-center">
        <Link href="/home">Home</Link>
        <Link href="/history"> History</Link>
        <Link href="/contact-us">Contact Us</Link>
      </div>

      <div className="flex justify-end items-center">
        {!isSignedIn ? (
          <div className="rounded-full border px-2 py-0.5 cursor-pointer">
            <SignInButton />
          </div>
        ) : (
          <div className="cursor-pointer flex items-center justify-center">
            <UserButton />
          </div>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
