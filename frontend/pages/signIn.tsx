/*
* Spring 2024 project
* Author: @positive235 (https://github.com/positive235)
* Reference: 
 - NextJS Docs(https://nextjs.org/docs)
 - TailwindCSS Docs(https://tailwindcss.com/docs/)
 - https://tailwindui.com/
 - https://fontawesome.com/icons/
 - https://docs.fontawesome.com/
 - How to put a icon into input in the front
 (https://stackoverflow.com/questions/67960681/trying-to-put-a-tailwindcss-icon-into-input)
*/


import React, { useRef, useState, useEffect} from 'react';
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons'

function SignIn() {
  const [showPassword, setShowPassword] = useState(false)
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const { signIn, currentUser } = useAuth();
  const [error, setError] = useState(''); // to set any errors
  const [loading, setLoading] = useState(false); // to disable button when creating user
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push("/myNotesPage");
    } 
  }, [currentUser, router]);
  

  const onShowPassword = () => {
    setShowPassword(!showPassword);
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setError('');
      setLoading(true);
      await signIn(emailRef.current.value, passwordRef.current.value);
      router.push('/myNotesPage');
    } catch {
      setError('Failed to login');
      console.log("error");
      alert("email or password are incorrect")
    }
    setLoading(false);
  }
  
  
  return (
    <>
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form onSubmit={handleSubmit}>
        <h1 className="text-center text-3xl font-bold">Sign In</h1><br/>
        {/* email */}
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
          <span className="after:content-['*Required'] after:ml-0.5 after:text-red-500">Email</span>
        </label>
        <div className="block w-full mt-2 rounded-md shadow-sm">
          <input
            type="email"
            name="email"
            id="email"
            className="block w-full rounded-md border-0 py-1.5 pl-5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            placeholder="you@example.com"
            required
            ref={emailRef}
          />
        </div>
        <br />
        {/* password */}
        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
          <span className="after:content-['*Required'] after:ml-0.5 after:text-red-500">Password</span>
        </label>
        <div className="relative mt-2 rounded-md shadow-sm">
          {/* Icon - Show Password or Hide Password */}
          <i className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
          <FontAwesomeIcon 
            icon={showPassword ? faEye : faEyeSlash}
            onClick={onShowPassword}
            aria-label={showPassword ? "Hide password" : "Show password"}
          />

          </i>

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            placeholder="Password"
            required
            ref={passwordRef}
          />
        </div>
        <button
        type="submit"
        className="mt-8 flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Sign in
        </button>
      </form>
      <p className="mt-10 text-center text-sm text-gray-500">
        Not a member?{' '}
        <Link href="/signUp" className="font-semibold leading-6 text-blue-600 hover:text-blue-500">
          Sign Up
        </Link>
      </p>
    </div>
    </div>
    </>
  )
}

export default SignIn