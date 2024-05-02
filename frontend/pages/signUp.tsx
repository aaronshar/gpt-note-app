/*
* Spring 2024 project
* Author: @positive235 (https://github.com/positive235)
* Reference: 
 - TailwindCSS Docs(https://tailwindcss.com/docs/)
 - https://tailwindui.com/
*/

import React from 'react'
import Link from "next/link"

function SignUp() {
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form action="#" method="POST">
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
          />
        </div>
        <br />
        {/* password */}
        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
          <span className="after:content-['*Required'] after:ml-0.5 after:text-red-500">Password</span>
        </label>
        <div className="relative mt-2 rounded-md shadow-sm">
          <input
            type="password"
            name="password"
            id="password"
            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            placeholder="Password"
            required
          />
        </div>

      <div className="mt-6 flex items-center justify-center gap-x-6">
        <button 
            type="button" 
            className="text-sm font-semibold leading-6 text-gray-900">
          <Link href="/">
            Cancel
          </Link>
        </button>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <Link href="/signIn">
            Sign Up
          </Link>
        </button>
      </div>
      </form>
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