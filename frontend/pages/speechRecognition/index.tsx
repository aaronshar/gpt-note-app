/*
* Spring 2024 project
* Author: @positive235 (https://github.com/positive235)
* Reference: 
 - NextJS Docs(https://nextjs.org/docs)
 - https://github.com/sambowenhughes/voice-recording-with-nextjs/blob/main/app/views/HomeView.tsx
*/

"use client";
import React, { useEffect, useState, useRef } from 'react';

// Declare a global interface to add the webkitSpeechRecognition property to the Window object
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

const SpeechRecog = ({ onTranscript }: any) => {
    const [listening, setListening] = useState(false);
    const [listeningComplete, setListeningComplete] = useState(false);
    const recognitionRef = useRef<any>(null);
   
    useEffect(() => {
        const SpeechRecognition = window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.onresult = (event: any) => {
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    const transcript = event.results[i][0].transcript;
                    onTranscript(transcript);
                }
            }
        };
    }, [onTranscript]);

    const toggleListening = () => {
        if (listening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
        setListening(!listening);
    };

    return (
        <button 
        onClick={toggleListening}
        className="text-xl rounded-full bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
            {listening ? 'Stop Listening' : 'Start Listening'}
        </button>
    );
};

export default SpeechRecog;