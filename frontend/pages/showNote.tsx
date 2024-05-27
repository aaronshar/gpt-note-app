/*
* Spring 2024 project
* Author: @positive235 (https://github.com/positive235)
* Reference: 
 - NextJS Docs(https://nextjs.org/docs)
 - TailwindCSS Docs(https://tailwindcss.com/docs/)
 - https://tailwindui.com/
 - localeCompare (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare)
 - includes (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes)
*/


import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import jsPDF from 'jspdf';


interface selectedNote {
  note_id: string;
  title: string;
  tags: string[];
  last_modified: string;
  href: string;
  token: string;
  content: string;
  bulletpoints: string;
}

function ShowNotePage() {
  const { currentUser } = useAuth()
  
  const router = useRouter()
  const { note_id } = router.query; // get note_id
  const [selectedNote, setSelectedNote] = useState([])

  const [generatedTags, setGeneratedTags] = useState<{ [key: string]: string[] }>({});


  if (!currentUser){
    router.push("/signIn")
  }
  
  // fetch all notes for current user
  useEffect(() => {
    const fetchNote = async () => {
      let accessToken = null;

      // get user token
      await currentUser.getIdToken()
      .then((token) => {
        accessToken = token;
      });
      const response = await fetch(`http://127.0.0.1:8080/api/mynotes/${note_id}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          // 'Access-Control-Allow-Origin': '*',
          'Authorization': `Bearer ${accessToken}`
        }
      })
      
      const selectedNote = await response.json();
      
      selectedNote.tags = Array.isArray(selectedNote.tags) ? selectedNote.tags : []
      setSelectedNote(selectedNote)
      return selectedNote
    }
    fetchNote()
  },[])

  const deleteNote = async (note_id: string) => {
    let accessToken = await currentUser.getIdToken();
    try {
      const response = await fetch(`http://127.0.0.1:8080/api/mynotes/${note_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      router.push("/myNotesPage")
    } catch (error) {
      console.error("Failed to delete the note:", error.message);
    }
  }
  

  /* For exporting notes, we will use these functions */

  const exportAsTXT = (note) => {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(note, null, 2)], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    const title = note.title ? note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'untitled';
    element.download = `note_${title}_${note.note_id}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  /* Adding Export as PDF so the user can export the notes in pdf fpormat*/
  const exportAsPDF = (note: Note) => {
    const doc = new jsPDF();
    const lineHeight = 10;
    const margin = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxLineWidth = pageWidth - margin * 2;
    const title = note.title ? note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'untitled';
  
    let currentHeight = lineHeight;
  
    doc.text(`Title: ${note.title}`, margin, currentHeight);
    currentHeight += lineHeight;
  
    doc.text(`Tags: ${note.tags.join(', ')}`, margin, currentHeight);
    currentHeight += lineHeight;
  
    doc.text(`Last Modified: ${note.last_modified}`, margin, currentHeight);
    currentHeight += lineHeight;
  
    const splitContent = doc.splitTextToSize(note.content, maxLineWidth);
    doc.text(splitContent, margin, currentHeight);
    currentHeight += splitContent.length * lineHeight;
  
    const splitBulletPoints = doc.splitTextToSize(note.bulletpoints, maxLineWidth);
    doc.text(splitBulletPoints, margin, currentHeight);
    currentHeight += splitBulletPoints.length * lineHeight;
  
    doc.save(`note_${title}_${note.note_id}.pdf`);
  };
  
  

  const exportAsJSON = (note) => {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(note, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    const title = note.title ? note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'untitled';
    element.download = `note_${note.note_id}_${title}.json`;
    document.body.appendChild(element);
    element.click();
  };

  

  return (
    <>
    <div className="w-full h-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl px-4 py-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl auto font-bold text-gray-900 mb-2">Note Details</h1>
          
          <div className="w-full">
          {selectedNote ?
              <div key={note_id} className="">
                  <div className="h-80 px-3 border border-gray shadow hover:shadow-lg round-md text-center relative h-full w-full overflow-scroll">
                      <h3 className="mt-16 text-xl text-gray-800">
                        <span className="absolute inset-0" />
                        {selectedNote.title}
                      </h3>
                      <div className="mt-2 flex justify-center flex-wrap gap-2">
                            <p>Tags:</p>
                            {selectedNote.tags && selectedNote.tags.map((tag, index) => (
                                <span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    <p className="text-base font-semibold text-gray-900">Last Modified Date: {selectedNote.last_modified}</p>
                    <br />
                    <h2 className="font-semibold text-lg">Content:</h2>
                    <p className="text-base"> {selectedNote.content}</p>
                  </div>
                  <h2 className="font-semibold text-lg">Bullet Points:</h2> 
                  <ul className="list-disc ml-5 text-gray-600 mb-4">
                    {selectedNote?.bulletpoints ? 
                      selectedNote.bulletpoints.split('\n').map((item, index) => (
                        <li key={index}>{item}</li>
                      )) : null
                    }
                  </ul>

                  <div className="flex justify-between items-center mt-6">
                    <div>
                      <button onClick={() => exportAsPDF(selectedNote)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg mr-2">
                        Export as PDF
                      </button>
                      <button onClick={() => exportAsTXT(selectedNote)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
                        Export as TXT
                      </button>
                    </div>
                    <button onClick={deleteNote} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg">
                      Delete Note
                    </button>
                  </div>
              </div>
            : null}
          </div>
        </div>
      </div>

    </div>
    </>
  )
}

export default ShowNotePage