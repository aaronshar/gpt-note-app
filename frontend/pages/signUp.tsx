/*
* Spring 2024 project
* Author: @positive235 (https://github.com/positive235)
* Reference: 
 - TailwindCSS Docs(https://tailwindcss.com/docs/)
 - https://tailwindui.com/
 - https://fontawesome.com/icons/
 - https://docs.fontawesome.com/
 - How to put a icon into input in the front
 (https://stackoverflow.com/questions/67960681/trying-to-put-a-tailwindcss-icon-into-input)
*/

import React, { useRef, useState } from 'react'
import Link from "next/link"
import { useAuth } from "../contexts/AuthContext"
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons'

function SignUp() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const onShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const onPassword = (e: any) => {
    setPassword(e.target.value)
  }

  const onConfirmPassword = (e: any) => {
    setConfirmPassword(e.target.value)
  }
  
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordConfirmRef = useRef(null); // to use when password confirm field is implemented
  const { signUp, currentUser } = useAuth();
  const [error, setError] = useState(''); // to set any errors
  const [loading, setLoading] = useState(false); // to disable button when creating user
  const router = useRouter();

  if (currentUser) {
    router.push("/myNotesPage");
  }

  async function handleSubmit(e) {
    e.preventDefault()
    // TODO: Email and password validation
    try {
      setError('')
      setLoading(true)
      await signUp(emailRef.current.value, passwordRef.current.value)
      router.push("/myNotesPage")
    } catch {
      setError('Failed to create an account')
      console.log("error")
    }
    setLoading(false)
  
  }
  
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form onSubmit={handleSubmit}>
        <h1 className="text-center text-3xl font-bold">Sign Up</h1><br/>
        {/* email */}
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
          <span className="after:content-['*Required'] after:ml-0.5 after:text-red-500">Email</span>
        </label>
        <div className="block w-full mt-2 rounded-md shadow-sm">
          <input
            type="email"
            name="email"
            id="email"
            autoComplete="email"
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
          <i className="absolute p-1.5 ml-[350px]">
            <FontAwesomeIcon 
              icon={showPassword ? faEye : faEyeSlash}
              onClick={onShowPassword}
            />
          </i>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            placeholder="Password"
            minLength={6}
            value={password}
            onChange={onConfirmPassword}
            required
            ref={passwordRef}
          />
        </div>
        
        <br />
        {/* Confirm password */}
        <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">
          <span className="after:content-['*Required'] after:ml-0.5 after:text-red-500">Confirm Password</span>
        </label>
        <div className="relative mt-2">
          {/* Icon - Show Password or Hide Password */}
          <i className="absolute p-1.5 ml-[350px]">
            {
             <FontAwesomeIcon 
             icon={showPassword ? faEye : faEyeSlash}
             onClick={onShowPassword}
              /> 
            }
          </i>
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            id="confirmPassword"
            className="block w-full rounded-md shadow-sm border-0 py-1.5 pl-7 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            placeholder="Re-enter Password"
            value={confirmPassword}
            onChange={onConfirmPassword}
            required
          />
          
          {/* Check if passwords match. Otherwise, display the text "Passwords do not match" */}
          {(password != confirmPassword)? <p className="text-red-500 m-0.5">Passwords do not match</p>: ''}
        </div>
      {/* Buttons */}
      <div className="mt-6 flex items-center justify-center gap-x-6">
        {/* Cancel Button */}
        <button 
            type="button" 
            className="text-sm font-semibold leading-6 text-gray-900">
          <Link href="/">
            Cancel
          </Link>
        </button>
        {/* Submit button */}
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          disabled={loading} // button disabled why waiting to create user
        >
          Sign Up
        </button>
      </div>
      </form>
      {/* Ask user - Already a member? Sign In */}
      <p className="mt-10 text-center text-sm text-gray-500">
        Already a member?{' '}
        <Link href="/signIn" className="font-semibold leading-6 text-blue-600 hover:text-blue-500">
          Sign In
        </Link>
      </p>

      </div>
      </div>
    </>
  )
}

export default SignUp