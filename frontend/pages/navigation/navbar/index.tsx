/*
* Spring 2024 project
* Author: @positive235 (https://github.com/positive235)
* Reference: 
  - NextJS Docs(https://nextjs.org/docs)
  - How to create a responsive navigation bar (https://medium.com/@a.pirus/how-to-create-a-responsive-navigation-bar-in-next-js-13-e5540789a017)
*/

import React, { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import User from "./User";
import Sidebar from "../sidebar"

const Navbar = ({ toggle }: { toggle: () => void }) => {
  return (
    <>
      <div className="w-full h-20 navbar sticky top-0">
        <div className="container mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <Logo />
            <button
              type="button"
              className="inline-flex items-center md:hidden"
              onClick={toggle}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <Sidebar toggle={toggle}/>
            <ul className="hidden md:flex gap-x-6 font-bold">
              <li>
                <Link href="/">
                  <p>Transcribe</p>
                </Link>
              </li>
              <li>
                <Link href="/uploadPage">
                  <p>Upload</p>
                </Link>
              </li>
              <li>
                <Link href="/myNotesPage">
                  <p>My Notes</p>
                </Link>
              </li>
            </ul>
            <div className="hidden md:block">
              <User />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
