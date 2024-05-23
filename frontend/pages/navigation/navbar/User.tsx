/*
* Spring 2024 project
* Author: @positive235 (https://github.com/positive235)
* Reference: 
  - NextJS Docs(https://nextjs.org/docs)
*/

import React, { useCallback, useContext, useState, useEffect} from 'react';
import { useAuth } from "../../../contexts/AuthContext";
import { useRouter } from 'next/router'
import Link from "next/link";


const User = () => {
  const { logOut, currentUser } = useAuth();
  const [error, setError] = useState(''); // to set any errors
  const [loading, setLoading] = useState(false); // to disable button when creating user
  const router = useRouter();

  async function handleSignOut(e) {
    e.preventDefault()
    try {
      setError('');
      setLoading(true);
      await logOut();
      router.push('/signIn');
    } catch {
      setError('Failed to logout');
      console.log("error");
      alert("Failed to logout")
    }
    setLoading(false);
  } 

  
    
  return (
    <div>
      {currentUser ? 
        <button 
          className="hover:bg-slate-100 h-12 rounded-lg bg-white font-bold px-5"
          onClick={handleSignOut}
          aria-label="Sign Out"
        >
          Sign Out
        </button>
      :
      <button 
        className="hover:bg-slate-100 h-12 rounded-lg bg-white font-bold px-5"
        aria-label="Sign In"
      >
        <Link href='/signIn'>
          Sign In
        </Link>
      </button>}
    </div>
  );
};

export default User;