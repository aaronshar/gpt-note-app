/*
* Spring 2024 project
* Author: @positive235 (https://github.com/positive235)
* Reference: 
  - NextJS Docs(https://nextjs.org/docs)
  - How to create a responsive navigation bar (https://medium.com/@a.pirus/how-to-create-a-responsive-navigation-bar-in-next-js-13-e5540789a017)
*/


"use client";
import { useState } from "react";
import Navbar from "./navbar";
import Sidebar from "./sidebar";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Sidebar isOpen={isOpen} toggle={toggle} />
      <Navbar toggle={toggle}/>
    </>
  );
};

export default Navigation;