/*
* Spring 2024 project
* Author: @positive235 (https://github.com/positive235)
* Reference: 
  - NextJS Docs(https://nextjs.org/docs)
  - How to create a responsive navigation bar (https://medium.com/@a.pirus/how-to-create-a-responsive-navigation-bar-in-next-js-13-e5540789a017)
*/

"use client";
import React from "react";
import Link from "next/link";
import Logo from "./Logo";
import User from "./User";

const Navbar = () => {
  return (
    <>
      <div className="w-full h-20 navbar sticky top-0">
        <div className="container mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <Logo />
            <ul className="md:flex gap-x-6 font-bold">
              <li className="menu">
                <Link href="/">
                  <p>Transcribe</p>
                </Link>
              </li>
              <li className="menu">
                <Link href="/uploadPage">
                  <p>Upload</p>
                </Link>
              </li>
              <li className="menu">
                <Link href="/myNotesPage">
                  <p>My Notes</p>
                </Link>
              </li>
            </ul>
            <div className="md:block">
              <User />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;