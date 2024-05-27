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
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';

const mimeType = "audio/webm";

function UploadPage() {
    const mediaRecorder = useRef(null);
    const [permission, setPermission] = useState(false);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [stream, setStream] = useState(null);
    const [audio, setAudio] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [audioTitle, setAudioTitle] = useState(""); 
    const [textTitle, setTextTitle] = useState("");
    const [selectedAudioFile, setSelectedAudioFile] = useState(null);
    const [selectedTextFile, setSelectedTextFile] = useState(null);
    const [responseData, setResponseData] = useState(null);
    const [isWaitingForData, setIsWaitingForData] = useState(false);
    const [keywords, setKeywords] = useState(""); 
    const [tags, setTags] = useState([]);
    const [dragging, setDragging] = useState(false);

    const audioDropRef = useRef(null);
    const textDropRef = useRef(null);
    
    /* for Adding notes ** start **/
    const { currentUser } = useAuth();
    /* for Adding notes ** end **/

    const router = useRouter(); 
    
    const handleAudioTitleChange = (event) => {
        setAudioTitle(event.target.value);
    };

    const handleTextTitleChange = (event) => {
        setTextTitle(event.target.value);
    };

    const handleAudioFileChange = (event) => {
        setSelectedAudioFile(event.target.files[0]);
    };

    const handleTextFileChange = (event) => {
        setSelectedTextFile(event.target.files[0]);
    };

    const handleKeywordChange = (event) => {
        setKeywords(event.target.value);
    };

    const generateTags = async (text) => {
        try {
            const response = await axios.post("http://127.0.0.1:5000/generate-tags", { text });
            return response.data.tags;
        } catch (error) {
            console.error("Error generating tags:", error);
            return [];
        }
    };

    const handleUploadAudio = async (event) => {
        event.preventDefault();
    
        if (!audioTitle) {
            alert("Please provide a title for the audio file.");
            return;
        }
    
        if (currentUser && selectedAudioFile) {
            const formData = new FormData();
            formData.append("file", selectedAudioFile);
            formData.append("title", audioTitle); 
    
            if (keywords) {
                formData.append("keywords", keywords);
            }
    
            try {
                setIsWaitingForData(true);
                setResponseData(null);
                setTags([]);
    
                const response = await axios.post(
                    "http://localhost:8000/api/uploadAudio",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                setResponseData(response.data);
        
                const generatedTags = await generateTags(response.data.transcript);
                setTags(generatedTags);
                
                let accessToken = null;
                await currentUser.getIdToken()
                .then((token) => {
                accessToken = token;
                });
    
                const addedNotes = await fetch("http://127.0.0.1:8080/api/mynotes", {
                method: "POST",
                body: JSON.stringify({
                    "title": audioTitle,
                    "content": response.data.transcript,
                    "tags": generatedTags,
                    "bulletpoints": response.data.note
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
                })
            } catch (error) {
                console.log(error);
                
                alert(`Error: ${error.response.data.error}`);
                setResponseData(null);
                setTags([]);
                setIsWaitingForData(false);
            } finally {
                setIsWaitingForData(false);
                router.push("/myNotesPage") 
            }
        } else {
            if (!selectedAudioFile) {
                alert("No file selected.");
            }
    
            if (!currentUser) {
                alert("Please Sign In first.")
                router.push("/signIn")
            }
        }
    };
    

    const handleUploadText = async (event) => {
        event.preventDefault();

        if (!textTitle) {
            alert("Please provide a title for the text file.");
            return;
        }
        if (currentUser && selectedTextFile) {
            const formData = new FormData();
            formData.append("file", selectedTextFile);
            formData.append("title", textTitle); 

            try {
                setResponseData(null);
                setTags([]);
                setIsWaitingForData(true);

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

                const generatedTags = await generateTags(response.data.transcript);
                setTags(generatedTags);
                
                let accessToken = null;
                await currentUser.getIdToken()
                .then((token) => {
                accessToken = token;
                });

                const addedNotes = await fetch("http://127.0.0.1:8080/api/mynotes", {
                method: "POST",
                body: JSON.stringify({
                    "title": textTitle, 
                    "content": response.data.transcript, 
                    "tags": generatedTags, 
                    "bulletpoints": response.data.note
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
                })
            } catch (error) {
                console.log(error);
                alert(`${error.response.data.error}`);
                setResponseData(null);
                setIsWaitingForData(false);
            } finally {
                setIsWaitingForData(false);
                router.push("/myNotesPage") 
            }
        } else {
            if (!selectedTextFile) {
                alert("No file selected.");
            } else if (!textTitle) {
                alert("Please provide a title for the text file.");
            }

            if (!currentUser) {
                alert("Please Sign In first.")
                router.push("/signIn")
            }
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
            alert(
                "The MediaRecorder API is not supported in your browser.  The recording feature will be disabled."
            );
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

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'copy';
    };

    const handleDrop = (e, type) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
    
        const files = e.dataTransfer.files;
        if (files.length) {
            handleFiles(files, type);
        }
    };
    

    const handleFiles = (files, type) => {
        const file = files[0];
        console.log(`File type detected: ${file.type}`);
        const supportedAudioTypes = [
            'audio/mp3', 'audio/mp4', 'audio/mpeg', 'audio/mpga', 'audio/m4a', 'audio/wav', 'audio/webm', 'video/webm', 'video/mp4'
        ];
        if (type === 'audio' && supportedAudioTypes.includes(file.type)) {
            setSelectedAudioFile(file);
        } else {
            alert('Unsupported file type!');
        }
    };
    
    

    useEffect(() => {
        const audioDiv = audioDropRef.current;
        const textDiv = textDropRef.current;
        if (audioDiv && textDiv) {
            audioDiv.addEventListener('dragenter', handleDragEnter);
            audioDiv.addEventListener('dragleave', handleDragLeave);
            audioDiv.addEventListener('dragover', handleDragOver);
            audioDiv.addEventListener('drop', (e) => handleDrop(e, 'audio'));
    
            textDiv.addEventListener('dragenter', handleDragEnter);
            textDiv.addEventListener('dragleave', handleDragLeave);
            textDiv.addEventListener('dragover', handleDragOver);
            textDiv.addEventListener('drop', (e) => handleDrop(e, 'text'));
        }
    
        return () => {
            if (audioDiv && textDiv) {
                audioDiv.removeEventListener('dragenter', handleDragEnter);
                audioDiv.removeEventListener('dragleave', handleDragLeave);
                audioDiv.removeEventListener('dragover', handleDragOver);
                audioDiv.removeEventListener('drop', (e) => handleDrop(e, 'audio'));
    
                textDiv.removeEventListener('dragenter', handleDragEnter);
                textDiv.removeEventListener('dragleave', handleDragLeave);
                textDiv.removeEventListener('dragover', handleDragOver);
                textDiv.removeEventListener('drop', (e) => handleDrop(e, 'text'));
            }
        };
    }, []);
    

    useEffect(() => {
        getMicrophonePermission();
        console.log("Got permission");
    }, []);

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-10 lg:px-8">
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <div className="block text-sm font-bold leading-6 text-gray-900">
                        Record & Download to Upload
                    </div>

                    <div className="audio-controls flex justify-center">
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
                                className="w-48 rounded-md bg-blue-600 mt-10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                            >
                                Start Recording
                            </button>
                        ) : null}

                        {recordingStatus === "recording" ? (
                            <div>
                                <button
                                    onClick={stopRecording}
                                    type="button"
                                    className="w-48 rounded-md bg-red-600 mt-10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                >
                                    Stop Recording
                                </button>
                                <p className="w-48 mt-5 text-sm font-semibold">
                                    Recording In Progress...
                                </p>
                            </div>
                        ) : null}
                    </div>
                    {audio ? (
                        <div className="audio-player text-center">
                            <audio
                                src={audio}
                                style={{
                                    margin: "10px 20px",
                                    padding: "10px",
                                }}
                                controls
                            ></audio>
                            <a
                                download
                                href={audio}
                                className="w-48 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
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
                            Upload Audio File
                        </label>

                        <div 
                            className={`mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 ${dragging ? 'bg-gray-100' : ''}`}
                            ref={audioDropRef}
                        >
                            <div className="text-center">
                                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                    <label
                                        htmlFor="audiofile-upload"
                                        className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
                                    >
                                        <span>Upload an Audio file</span>
                                        <input
                                            onChange={handleAudioFileChange}
                                            id="audiofile-upload"
                                            name="file-upload"
                                            type="file"
                                            accept="audio/mp3, audio/mp4, audio/mpeg, audio/mpga, audio/x-m4a, audio/wav, audio/webm, video/webm, video/mp4"
                                            className="sr-only"
                                        />
                                       
                                    </label>
            
                                </div>
                                <p className="text-xs leading-5 text-gray-600">
                                    mp3, mp4, mpeg, mpga, m4a, wav, webm
                                </p>

                                {selectedAudioFile && (
                                    <p>
                                        <b>{selectedAudioFile.name}</b>
                                    </p>
                                )}
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="keywords-input" className="block text-sm font-bold leading-6 text-gray-900">
                                Enter keywords <span className="text-xs text-black">of your audio file</span>:
                            </label>
                            <input
                                id="keywords-input"
                                type="text"
                                onClick={() => {
                                    console.log("CLICKED3");
                                }}
                                onChange={handleKeywordChange}
                                className="pl-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                placeholder="Enter Keywords here"
                            />
                        </div>                        

                        <div>
                            <label htmlFor="audio-title" className="block text-sm font-bold leading-6 text-gray-900">
                                Title:
                            </label>
                            <input
                                id="audio-title"
                                type="text"
                                value={audioTitle}
                                onChange={handleAudioTitleChange}
                                className="pl-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                placeholder="Enter Title here"
                            />
                        </div>

                        <div className="mt-6 flex items-center justify-center gap-x-6">
                        {selectedAudioFile && isWaitingForData ? 
                            <button
                            disabled
                            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            >
                            Loading..
                            </button>:
                            <button
                                onClick={handleUploadAudio}
                                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            >
                                Submit
                            </button>}
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
                            Upload Text File
                        </label>
                        <div 
                            className={`mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 ${dragging ? 'bg-gray-100' : ''}`}
                            ref={textDropRef}
                        >
                            <div className="text-center">
                                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                    <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
                                    >
                                        <span>Upload a Text file</span>
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
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs leading-5 text-gray-600">
                                    txt
                                </p>
                                {selectedTextFile && (
                                    <p>
                                        <b>{selectedTextFile.name}</b>
                                    </p>
                                )}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="text-title" className="block text-sm font-bold leading-6 text-gray-900">
                                Title:
                            </label>
                            <input
                                id="text-title"
                                type="text"
                                value={textTitle}
                                onChange={handleTextTitleChange}
                                className="pl-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                placeholder="Enter title here"
                            />
                        </div>
                        <div className="mt-6 flex items-center justify-center gap-x-6">
                        {selectedTextFile && isWaitingForData ? 
                            <button
                                disabled
                                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            >
                                Loading..
                            </button>:
                            <button
                                onClick={handleUploadText}
                                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            >
                                Submit
                            </button>}
                        </div>
                    </form>
                </div>
            </div>

            <style jsx>{`
              .dropzone {
                border: 2px dashed #ccc;
                border-radius: 10px;
                padding: 20px;
                text-align: center;
                transition: background-color 0.2s ease;
              }
              .dropzone.dragging {
                background-color: #eee;
              }
            `}</style>
        </>
    );
}

export default UploadPage;
