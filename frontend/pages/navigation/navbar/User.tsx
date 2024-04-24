/*
* Spring 2024 project
* Author: @positive235 (https://github.com/positive235)
* Reference: 
  - NextJS Docs(https://nextjs.org/docs)
*/

import Link from "next/link";

const User = () => {
    return (
      <Link href="/signIn"><button className="hover:bg-slate-100 h-12 rounded-lg bg-white font-bold px-5">Sign In</button></Link>
    );
  };
  export default User;