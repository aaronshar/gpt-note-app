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
      <nav className="w-full h-20 z-50 navbar sticky top-0">
        <div className="container mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <Logo />
            <ul className="md:flex gap-x-6 font-bold">
              <li className="hover:text-slate-600">
                <Link href="/">
                  <p>Home</p>
                </Link>
              </li>
              <li className="hover:text-slate-600">
                <Link href="/upload">
                  <p>Record & Upload</p>
                </Link>
              </li>
              <li className="hover:text-slate-600">
                <Link href="/signIn">
                  <p>My Notes</p>
                </Link>
              </li>
            </ul>
            <div className="md:block">
              <User />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
