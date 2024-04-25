# NotesGuru [In progress]
**A Notetaking Web Application using GPT**

## Introduction
This is a web application that can help users enhance productivity by streamlining their notetaking using OpenAI’s APIs. 
Our goal is to provide smarter tools for people to store, organize, and summarize their notes more intelligently, 
which will allow users to engage in their meetings, lectures, videos, etc. without having to take notes at the same time.
This will help users better-absorb content without having to worry about taking notes at the same time. 
The application will provide personalized accounts for users to manage their stored notes.

## Features
- Transcribe from voice-to-text: For this, we utilize OpenAI's Whisper
  - Capture live audio during lectures and meetings
  - Or, upload audio files to transcribe
  - Or, notes can be uploaded directly in text form
- Summarize notes into key bullet points: For this, we use GPT 3.5 Turbo API by OpenAI
- Suggest tags: For this, we use GPT 3.5 Turbo API by OpenAI
  - Or, tags can also be added by users
- Allow advanced search features for users
  - Search by specific words/topics
- Store user's notes via cloud storage services

## Technologies we use
- For our main features(Transcription, Generating tags, Summarization, and Advanced Search): OpenAI’s GPT API and OpenAI’s Whisper API
- Backend: Flask (Python)
- Audio Recording: Pyaudio and Wave from Python library
- Storage and Hosting: Google Cloud Platform
- Frontend Development: NextJS, ReactJS, TailwindCSS, and TypeScript
- Authentication: OAuth
  
## Authors and Roles
- Author 1: Hae Ji Park
  - Email: positive235@gmail.com / School email: parkhaej@oregonstate.edu
  - GitHub: https://github.com/positive235
  - Role: Frontend Lead & Frontend Coding & Frontend Design
- Author 2: Aaron Shar
  - Email: / School email: shara@oregonstate.edu
  - GitHub: https://github.com/aaronshar
  - Role: Backend - Store notes, Browse notes, Cloud deployment, etc.
- Author 3: Sayhee Kim
  - Email: / School email: kimsay@oregonstate.edu
  - GitHub: https://github.com/sayheekim
  - Role: Backend - Transcription, Summarization, Note export, GPT Search, etc.
- Author 4: Khalid Chaudhari
  - Email: / School email: chaudhkh@oregonstate.edu
  - GitHub: https://github.com/Chaudhari998
  - Role: Backend - Authentication, Generating tags, etc.

## Try it out!
[Our future website address]

## How to run locally
### Frontend
1. ```cd gpt-note-app```
2. ```cd frontend```
3. ```npm i```
4. ```npm run dev```
5. Go to http://localhost:3000

