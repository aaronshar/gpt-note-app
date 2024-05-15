/*
* Spring 2024 project
* Author: @positive235 (https://github.com/positive235), @kimsay (https://github.com/kimsay)
* Reference:
 - NextJS Docs(https://nextjs.org/docs)
 - TailwindCSS Docs(https://tailwindcss.com/docs/)
 - https://tailwindui.com/
 - How to Create Horizontal line with text
 (https://cssf1.com/snippet/create-horizontal-rule-with-text-using-tailwindcss)
*/

import React from "react";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

const mimeType = "audio/webm";

function UploadPageSayhee() {
    const mediaRecorder = useRef(null);
    const [permission, setPermission] = useState(false);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [stream, setStream] = useState(null);
    const [audio, setAudio] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [selectedAudioFile, setSelectedAudioFile] = useState(null);
    const [selectedTextFile, setSelectedTextFile] = useState(null);
    const [responseData, setResponseData] = useState(null);
    const [isWaitingForData, setIsWaitingForData] = useState(false);
    const [keywords, setKeywords] = useState(""); // ex. "  ZenithNex, DynaPulse Max, SonicBlast X, CyberLink X7, Vectronix V9, NebulaLink Alpha, QuantumPulse Matrix, FUSION, RAZE, BOLT, QUBE, FLARE  "

    const handleAudioFileChange = (event) => {
        console.log("selected a file");
        setSelectedAudioFile(event.target.files[0]);
    };

    const handleTextFileChange = (event) => {
        console.log("selected a file");
        setSelectedTextFile(event.target.files[0]);
    };

    const handleKeywordChange = (event) => {
        setKeywords(event.target.value);
    };

    const handleUploadAudio = async (event) => {
        event.preventDefault();
        if (selectedAudioFile) {
            // console.log("CLICKED! REQUESTING NOTES FROM AUDIO");

            const formData = new FormData();
            formData.append("file", selectedAudioFile);

            if (keywords) {
                formData.append("keywords", keywords);
            }

            try {
                const response = await axios.post(
                    "http://localhost:8000/api/uploadAudio",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                console.log(response.data.message);
                setResponseData(response.data);
                setIsWaitingForData(true);
            } catch (error) {
                console.error("Error uploading file:", error);
                setResponseData(null);
                setIsWaitingForData(false);
            }
        } else {
            alert("No file selected.");
        }
    };

    const handleUploadText = async (event) => {
        event.preventDefault();
        // console.log("CLICKED");
        if (selectedTextFile) {
            console.log("CLICKED! REQUESTING NOTES FROM TEXT");

            const formData = new FormData();
            formData.append("file", selectedTextFile);

            try {
                const response = await axios.post(
                    "http://localhost:8000/api/uploadText",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                console.log(response.data.message);
                setResponseData(response.data);
                setIsWaitingForData(true);
            } catch (error) {
                console.error("Error uploading file:", error);
                setResponseData(null);
                setIsWaitingForData(false);
            }
        } else {
            alert("No file selected.");
        }
    };

    const getMicrophonePermission = async () => {
        if ("MediaRecorder" in window) {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false,
                });
                setPermission(true);
                setStream(mediaStream);
            } catch (err) {
                alert(err.message);
            }
        } else {
            alert("The MediaRecorder API is not supported in your browser.");
        }
    };

    const startRecording = async () => {
        setRecordingStatus("recording");
        const media = new MediaRecorder(stream, { type: mimeType });

        mediaRecorder.current = media;

        mediaRecorder.current.start();

        let localAudioChunks = [];

        mediaRecorder.current.ondataavailable = (event) => {
            if (typeof event.data === "undefined") return;
            if (event.data.size === 0) return;
            localAudioChunks.push(event.data);
        };

        setAudioChunks(localAudioChunks);
    };

    const stopRecording = () => {
        setRecordingStatus("inactive");
        mediaRecorder.current.stop();

        mediaRecorder.current.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: mimeType });
            const audioUrl = URL.createObjectURL(audioBlob);

            setAudio(audioUrl);

            setAudioChunks([]);
        };
    };

    useEffect(() => {
        getMicrophonePermission();
        console.log("Got permission");
    }, []);

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-10 lg:px-8">
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <div className="block text-sm font-bold leading-6 text-gray-900">
                        Record live lecture or meeting
                    </div>

                    <div className="audio-controls">
                        {!permission ? (
                            <button
                                onClick={getMicrophonePermission}
                                type="button"
                                style={{
                                    border: "1px solid black",
                                    padding: "10px",
                                }}
                            >
                                Get Microphone
                            </button>
                        ) : null}

                        {permission && recordingStatus === "inactive" ? (
                            <button
                                onClick={startRecording}
                                type="button"
                                className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                            >
                                Start Recording
                            </button>
                        ) : null}

                        {recordingStatus === "recording" ? (
                            <div>
                                <button
                                    onClick={stopRecording}
                                    type="button"
                                    className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                >
                                    Stop Recording
                                </button>
                                <p>Recording In Progress...</p>
                            </div>
                        ) : null}
                    </div>
                    {audio ? (
                        <div className="audio-player">
                            <audio
                                src={audio}
                                style={{
                                    margin: "10px 0px",
                                    padding: "2px",
                                }}
                                controls
                            ></audio>
                            <a
                                download
                                href={audio}
                                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            >
                                Download Recording
                            </a>
                        </div>
                    ) : null}
                </div>
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    {/* Form 1 - Upload Audio File */}
                    <form>
                        <label
                            htmlFor="audio-file"
                            className="block text-sm font-bold leading-6 text-gray-900"
                        >
                            Upload Audio File{" "}
                            <span className="font-thin">below and see </span>
                            <Link
                                href="/signIn"
                                className="font-medium leading-6 text-blue-600 hover:text-blue-500"
                            >
                                My Notes
                            </Link>
                        </label>

                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                            <div className="text-center">
                                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                    <label
                                        htmlFor="audiofile-upload"
                                        className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
                                    >
                                        <span>Upload an audio file</span>
                                        <input
                                            onClick={() => {
                                                console.log("CLICKED2");
                                            }}
                                            onChange={handleAudioFileChange}
                                            id="audiofile-upload"
                                            name="file-upload"
                                            type="file"
                                            className="sr-only"
                                        />
                                    </label>
                                    {/* <p className="pl-1">or drag and drop</p> */}
                                </div>
                                <p className="text-xs leading-5 text-gray-600">
                                    mp3, mp4, mpeg, mpga, m4a, wav, webm
                                </p>
                            </div>
                        </div>
                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                            <div className="text-center">
                                <div className="flex text-sm leading-6 text-gray-600">
                                    <label
                                        htmlFor="keywords-input"
                                        className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
                                    >
                                        <span>Enter keywords: </span>
                                        <input
                                            onClick={() => {
                                                console.log("CLICKED3");
                                            }}
                                            onChange={handleKeywordChange}
                                            id="keywords-input"
                                            type="text"
                                            style={{
                                                outline: "blue",
                                                display: "block",
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-center gap-x-6">
                            <button
                                onClick={handleUploadAudio}
                                // type="submit"
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
                        <span className="shrink px-1 pb-1 text-blue-600">
                            OR
                        </span>
                        <div className="grow border-b border-blue-600"></div>
                    </div>

                    <br />

                    {/* Form 2 - Upload Text File */}
                    <form>
                        <label
                            htmlFor="audio-file"
                            className="block text-sm font-bold leading-6 text-gray-900"
                        >
                            Upload Text File{" "}
                            <span className="font-thin">below and see </span>
                            <Link
                                href="/signIn"
                                className="font-medium leading-6 text-blue-600 hover:text-blue-500"
                            >
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
                                        <input
                                            onChange={handleTextFileChange}
                                            onClick={() => {
                                                console.log("CLICKED");
                                            }}
                                            id="file-upload"
                                            name="file-upload"
                                            type="file"
                                            className="sr-only"
                                        />
                                    </label>
                                    {/* <p className="pl-1">or drag and drop</p> */}
                                </div>
                                <p className="text-xs leading-5 text-gray-600">
                                    txt, *** up to **MB
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-center gap-x-6">
                            <button
                                onClick={handleUploadText}
                                // type="submit"
                                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semßibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
                <div className="mt-6 flex items-center justify-center gap-x-6">
                    <h1>HTTP Response</h1>
                    {responseData && responseData.transcript && (
                        <div>
                            <h3>Transcript:</h3>
                            {responseData.transcript}
                        </div>
                    )}
                    {responseData && responseData.note && (
                        <div className="text-center">
                            <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                <h3>Note:</h3>
                                {responseData.note}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default UploadPageSayhee;
