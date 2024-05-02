/*
* Spring 2024 project
* Author: @positive235 (https://github.com/positive235)
* Reference: 
 - NextJS Docs(https://nextjs.org/docs)
 - TailwindCSS Docs(https://tailwindcss.com/docs/)
 - https://tailwindui.com/
 - How to Create Horizontal line with text
 (https://cssf1.com/snippet/create-horizontal-rule-with-text-using-tailwindcss)
*/


import React from 'react'
import Link from "next/link"

function UploadPage() {
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-10 lg:px-8">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

        {/* Form 1 - Upload Audio File */}
        <form>
          <label htmlFor="audio-file" className="block text-sm font-bold leading-6 text-gray-900">
            Upload Audio File <span className="font-thin">below and see {' '}</span>
            <Link href="/myNotesPage" className="font-medium leading-6 text-blue-600 hover:text-blue-500">
              My Notes
            </Link> 
          </label>
          
          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
            <div className="text-center">
              <div className="mt-4 flex text-sm leading-6 text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
                >
                  <span>Upload an audio file</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                </label>
                  <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs leading-5 text-gray-600">
                mp3, mp4, mpeg, mpga, m4a, wav, webm up to 25MB
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-center gap-x-6">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Submit
            </button>
          </div>
        </form>

        <br />
        
        {/* Divide with a line */}
        <div className="flex items-center">
          <div className="grow border-b border-blue-600"></div>
            <span className="shrink px-1 pb-1 text-blue-600">OR</span>
          <div className="grow border-b border-blue-600"></div>
        </div>

        <br />

        {/* Form 2 - Upload Text File */}
        <form>
          <label htmlFor="audio-file" className="block text-sm font-bold leading-6 text-gray-900">
              Upload Text File <span className="font-thin">below and see {' '}</span>
              <Link href="/myNotesPage" className="font-medium leading-6 text-blue-600 hover:text-blue-500">
                My Notes
              </Link>
          </label>
          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
            <div className="text-center">
              <div className="mt-4 flex text-sm leading-6 text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
                >
                  <span>Upload a text file</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                </label>
                  <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs leading-5 text-gray-600">
                txt, *** up to **MB
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-center gap-x-6">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Submit
            </button>
          </div>
        </form>

      </div>
      </div>
    </>
  )
}

export default UploadPage