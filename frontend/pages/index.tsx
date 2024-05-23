/*
* Spring 2024 project
* Author: @positive235 (https://github.com/positive235)
* Reference: 
 - NextJS Docs(https://nextjs.org/docs)
 - React Docs(https://react.dev/reference/react)
*/


/* Home Page */
import React, { useState, useRef } from 'react'
import Image from "next/image";

function index() {
  
  return (
    <>
      <div className="h-full w-full block">
        <Image
            src="/images/logo-notesguru.png"
            alt="Logo-NotesGuru"
            width={300}
            height={300}
            className="rounded-lg mx-auto mt-10"
        />

        <h2 className="mt-10 text-3xl text-center font-bold text-sky-600">A Notetaking Web Application using GPT</h2>

        <h3 className="ml-10 mt-10 text-2xl font-bold text-sky-600">Features</h3>
        <ul className="px-20 mt-10 font-medium list-disc">
          <li><span className="text-blue-600">"Record or Upload"</span>: Transcribe from voice-to-text: For this, we utilize OpenAI's Whisper</li>
          <ul className="ml-10 list-decimal">
            <li>Capture live audio during lectures and meetings</li>
            <li>Or, upload audio files to transcribe</li>
            <li>Or, notes can be uploaded directly in text form</li>
          </ul>
          <li><span className="text-blue-600">"My Notes"</span>: Summarize notes into key bullet points: For this, we use GPT 3.5 Turbo API by OpenAI</li>
          <li><span className="text-blue-600">"My Notes"</span>: Suggest tags: For this, we use GPT 3.5 Turbo API by OpenAI</li>
          <li><span className="text-blue-600">"My Notes"</span>: Allow advanced search features for users (Search by specific words/topics)</li>
          <li><span className="text-blue-600">"My Notes"</span>: Store user's notes via cloud storage services</li>
        </ul>

        <h3 className="ml-10 mt-10 text-2xl font-bold text-sky-600">Introduction</h3>
        <p className="font-medium py-10 px-20">This is a web application that can help users enhance productivity by streamlining their notetaking using OpenAI’s APIs. Our goal is to provide smarter tools for people to store, organize, and summarize their notes more intelligently, which will allow users to engage in their meetings, lectures, videos, etc. without having to take notes at the same time. This will help users better-absorb content without having to worry about taking notes at the same time. The application will provide personalized accounts for users to manage their stored notes.</p>
      </div>
    </>
  );
};

export default index