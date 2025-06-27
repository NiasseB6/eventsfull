"use client";

import Link from "next/link"; 
import Image from "next/image";
import logo from "../public/logo.png";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
} from "@clerk/clerk-react";
import SearchBar from "./SearchBar";


function Header() {
  return (
    // le Header 
    <div className="border-b justify-center">
      <div className=" flex flex-col lg:flex-row items-center gap-4 p-4">
        <div className="flex items-center justify-between w-full lg:w-auto">
          <Link href="/" className="font-bold shrink-0">
            <Image
              src={logo}
              width={100}
              height={100}
              alt="Logo"
              priority // optionnel : pour précharger
              className="w-24 lg:w-28"
            />
          </Link>
          <div className="lg:hidden">
            <SignedIn>
              <UserButton />
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-gray-100 text-emerald-900 px-4 py-1.5 text-sm rounded-lg hover:bg-gray-200 transition border border-gray-300 cursor-pointer">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>

        {/* la barr ede recherche */}
        <div className="w-full lg:max-w-2xl">
          <SearchBar />
        </div>


        {/* Ecran pour PC */}
        <div className="hidden lg:block ml-auto">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-gray-100 text-[#184C99] px-4 py-1.5 text-sm rounded-lg hover:bg-gray-200 transition border border-gray-300 cursor-pointer">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center gap-3">
              <Link href="/vendeurs">
                <button
                  className="bg-[#184C99] text-white px-3 py-1.5 text-sm rounded-lg hover:bg-blue-700
              trasition"
                >
                  Vendeurs
                </button>
              </Link>
              <Link href="/tickets">
                <button
                  className="bg-[#F37021] text-gray-800 px-3 py-1.5 text-sm
              rounded-lg hover:bg-gray-200 transition border border-gray-300"
                >
                  Tickets
                </button>
              </Link>
              <UserButton />
            </div>
          </SignedIn>
        </div>

        {/* Ecran pour mobile */}
        <div className="lg:hidden w-full flex justify-center gap-3">
          <SignedIn>
              <Link href="/vendeurs" className="flex-1">
                <button
                  className=" w-full bg-[#184C99] text-white px-3 py-1.5 text-sm rounded-lg hover:bg-blue-700 transition"
                >
                  Vendeurs
                </button>
              </Link>
              <Link href="/tickets" className="flex-1">
                <button
                  className=" w-full bg-[#F37021] text-gray-800 px-3 py-1.5 text-sm
              rounded-lg hover:bg-gray-200 transition border border-gray-300"
                >
                  Tickets
                </button>
              </Link>
          </SignedIn>
        </div>
      </div>
    </div>
  );
}

export default Header;
