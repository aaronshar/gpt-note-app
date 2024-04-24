/*
* Spring 2024 project
* Author: @positive235 (https://github.com/positive235)
* Reference: 
  - NextJS Docs(https://nextjs.org/docs)
  - How to create a responsive navigation bar (https://medium.com/@a.pirus/how-to-create-a-responsive-navigation-bar-in-next-js-13-e5540789a017)
*/

"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import User from "./User";

const Logo = () => {
  // Update the size of the logo when the size of the screen changes
  const [width, setWidth] = useState(0);

  const updateWidth = () => {
    const newWidth = window.innerWidth;
    setWidth(newWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", updateWidth);
    updateWidth();
  }, []);

  // Change between the logo and the button when the user scrolls
  const [showButton, setShowButton] = useState(false);

  const changeNavButton = () => {
    if (window.scrollY >= 400 && window.innerWidth < 768) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeNavButton);
  }, []);

  return (
    <>
      <Link href="/" style={{ display: showButton ? "none" : "block" }}>
        <Image
          src="/images/logo-notesguru.png"
          alt="Logo-NotesGuru"
          width={width < 1024 ? "70" : "170"}
          height={width < 1024 ? "30" : "60"}
          className="relative"
        />
      </Link>
      <div
        style={{
          display: showButton ? "block" : "none",
        }}
      >
        <User />
      </div>
    </>
  );
};

export default Logo;