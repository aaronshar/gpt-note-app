/*
* Spring 2024 project
* Author: @positive235 (https://github.com/positive235)
* Reference: 
 - NextJS Docs(https://nextjs.org/docs)
 - React Docs(https://react.dev/reference/react)
*/


/* Home Page */
import React, { useState } from 'react'
import SpeechRecog from './speechRecognition'

function index() {
  const [result, setResult] = useState('');

  return (
    <>
      <div className="h-full w-full">
        <div className="text-center mt-10">
          <SpeechRecog onTranscript={(transcript: any) => setResult(transcript)} />
        </div>
        <p 
        className="min-h-96 mt-10 mx-20 rounded-md bg-sky-300 px-3 py-2 font-bold text-black text-xl"
        >
          Recognized Text:
          <br />
          <span className="px-10 rounded-md font-semibold">
            {result}
          </span>
        </p>
        <div className="flex justify-center text-l block w-full mt-2  rounded-md shadow-sm">
          <input
            type="text"
            name="title"
            id="title"
            className="w-4/5 rounded-md border-0 py-1.5 pl-5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            placeholder="Enter Title"
            required
          />
          <button
          type="submit"
          className="rounded-md bg-blue-600 ml-5 px-7 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default index