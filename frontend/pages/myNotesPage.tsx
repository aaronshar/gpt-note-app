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

function myNotesPage() {
  const { currentUser } = useAuth()
  const router = useRouter()
  const [notesData, setNotesData] = useState([])
  const [sortedNotes, setSortedNotes] = useState([])
  const [sortOrder, setSortOrder] = useState('asc')
  const [priorityTag, setPriorityTag] = useState('')

  if (!currentUser){
    router.push("/signIn")
  }
  
  // fetch all notes for current user
  useEffect(() => {
    const fetchNotes = async () => {
      let accessToken = null;

      // get user token
      await currentUser.getIdToken()
      .then((token) => {
        accessToken = token;
      });

      const response = await fetch("http://127.0.0.1:8080/api/mynotes", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          // 'Access-Control-Allow-Origin': '*',
          'Authorization': `Bearer ${accessToken}`
        }
      })
      
      let notesData = await response.json();
      setSortedNotes(notesData)
      setNotesData(notesData)

      return notesData
    }
    fetchNotes()
  },[])


  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const order = event.target.value
    setSortOrder(order)
    sortNotes(order, priorityTag)
  }

  const handleTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const tag = event.target.value;
    setPriorityTag(tag)
    sortNotes(sortOrder, tag)
  }

  const sortNotes = (order: string, tag: string) => {
    const sorted = [...notesData].sort((a, b) => {
      const aHasTag = a.tags.includes(tag) ? 1 : 0
      const bHasTag = b.tags.includes(tag) ? 1 : 0

      if (aHasTag !== bHasTag) {
        // Prioritize notes with a tag
        return bHasTag - aHasTag
      }

      if (order === 'asc') {
        // Sort by alphabetical order
        return a.title.localeCompare(b.title)
      } else if (order == 'desc') {
        // Sort by reversed alphabetical order
        return b.title.localeCompare(a.title)
      } else if (order == 'new') {
        // Sort by last modified dates by new to old
        return a.last_modified.localeCompare(b.last_modified)
      } else if (order == 'old') {
        // Sort by last modified dates by old to new
        return b.last_modified.localeCompare(a.last_modified)
      }
    })
    setSortedNotes(sorted)
  }
  /* For exporting notes, we will use these functions */

  const exportAsTXT = (note) => {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(note, null, 2)], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    const title = note.title ? note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'untitled';
    element.download = `note_${note.note_id}_${title}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  /* Adding Export as PDF so the user can export the notes in pdf fpormat*/
  const exportAsPDF = (note) => {
    const doc = new jsPDF();
    doc.text(`Title: ${note.title}`, 10, 10);
    doc.text(`Tags: ${note.tags.join(', ')}`, 10, 20);
    doc.text(`Last Modified: ${note.last_modified}`, 10, 30);
    const title = note.title ? note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'untitled';
    doc.save(`note_${note.note_id}_${title}.pdf`);
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
        <div className="mx-auto max-w-2xl py-12 sm:py-16 lg:max-w-none lg:py-16">
          <h2 className="text-2xl font-bold text-gray-900">My Notes</h2>
          <div className="sortNotes">
            <label htmlFor="sortOptions">Sort by: </label>
            <select id="sortOptions" value={sortOrder} onChange={handleSortChange}>
              <option value="asc">Title (A-Z)</option>
              <option value="desc">Title (Z-A)</option>
              <option value="new">Last Modified (new to old)</option>
              <option value="old">Last Modified (old to new)</option>
            </select>
          </div>
          <div className="tagInput">
            <label htmlFor="tagInput">Sort by Tag:</label>
            <input
              className="rounded-md border border-black pl-1.5 text-gray-900"
              type="text"
              id="tagInput"
              placeholder="Enter a tag"
              value={priorityTag}
              onChange={handleTagChange}
            />
          </div>
          <div className="mt-6 space-y-12 lg:grid lg:grid-cols-5 lg:gap-6 lg:space-y-0">
          {sortedNotes ? (sortedNotes.map((note) => (
              <div key={note.note_id} className="group relative">
                <a href={note.href}>
                  <div className="border border-gray shadow hover:shadow-lg round-md text-center relative h-full w-full overflow-hidden sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                      <h3 className="mt-16 text-xl text-gray-800">
                        <span className="absolute inset-0" />
                        {note.title}
                        </h3>
                    <p className="text-base font-semibold text-gray-900">{note.tags.join(', ')}</p>
                    <p className="text-base font-semibold text-gray-900">{note.last_modified}</p>
                  </div> 
                </a>
                <div className="exportButtons">
                  <button onClick={() => exportAsTXT(note)}>Export as TXT</button>
                  <button onClick={() => exportAsPDF(note)}>Export as PDF</button>
                  <button onClick={() => exportAsJSON(note)}>Export as JSON</button>
                </div>
              </div>
            ))) : null}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default myNotesPage