/*
* Spring 2024 project
* Author: @positive235 (https://github.com/positive235)
* Reference: 
 - NextJS Docs(https://nextjs.org/docs)
 - TailwindCSS Docs(https://tailwindcss.com/docs/)
*/


import React from 'react'

function SignIn() {
  return (
    <>
    <div className="flex justify-center my-8">
      <form>
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
            className="block w-full rounded-md border-0 py-1.5 pl-5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Password"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-8 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Sign in
        </button>
      </form>
    </div>
    </>
  )
}

export default SignIn