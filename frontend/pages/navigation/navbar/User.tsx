/*
* Spring 2024 project
* Author: @positive235 (https://github.com/positive235)
* Reference: 
  - NextJS Docs(https://nextjs.org/docs)
*/

import React, { useCallback, useContext, useState, useEffect} from 'react';
import Link from "next/link";
import { useAuth } from "../../../contexts/AuthContext";
import { useRouter } from 'next/router'

const User = () => {
  const { isSignedIn } = useAuth();
  const { signOut, currentUser } = useAuth();
  const [error, setError] = useState(''); // to set any errors
  const [loading, setLoading] = useState(false); // to disable button when creating user
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(isSignedIn)
  

  async function handleSignOut(e) {
    e.preventDefault()
    try {
      setError('');
      setLoading(true);
      await signOut;
      setIsAuthenticated(!isAuthenticated)
      router.push('/');
    } catch {
      setError('Failed to logout');
      console.log("error");
      alert("Failed to logout")
    }
    setLoading(false);
  } 
    
  return (
    <div>
      {isAuthenticated ? 
        <button 
          className="hover:bg-slate-100 h-12 rounded-lg bg-white font-bold px-5"
          onClick={handleSignOut}
          aria-label="Sign Out"
        >
          Sign Out
        </button>
      :
      <Link href="/signIn">
        <button 
          className="hover:bg-slate-100 h-12 rounded-lg bg-white font-bold px-5"
          aria-label="Sign In"
        >
          Sign In
        </button>
      </Link>}
    </div>
  );
};

export default User;