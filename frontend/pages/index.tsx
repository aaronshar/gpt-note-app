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
      </div>
    </>
  );
};

export default index