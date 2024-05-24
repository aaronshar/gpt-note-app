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
import Link from "next/link";

interface Note {
  note_id: string;
  title: string;
  tags: string[];
  last_modified: string;
  href: string;
  token: string;
  content: string;
  bulletpoints: string;
}

function myNotesPage() {
  const { currentUser } = useAuth()
  const router = useRouter()
  const [notesData, setNotesData] = useState([])
  const [sortedNotes, setSortedNotes] = useState([])
  const [sortOrder, setSortOrder] = useState('asc')
  const [priorityTag, setPriorityTag] = useState('')
  const [generatedTags, setGeneratedTags] = useState<{ [key: string]: string[] }>({});


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
      
      const notesData = await response.json();
      notesData.forEach(note => {
        note.tags = Array.isArray(note.tags) ? note.tags : [];
      });
      setSortedNotes(notesData);
      setNotesData(notesData);


      // Generate tags automatically for each note
    //for (const note of notesData) {
      //generateTags(note);
    //}

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

      const dateA = new Date(a.last_modified) // to sort by last modified dates
      const dateB = new Date(b.last_modified) // to sort by last modified dates

      if (order === 'asc') {
        // Sort by alphabetical order
        return a.title.localeCompare(b.title)
      } else if (order == 'desc') {
        // Sort by reversed alphabetical order
        return b.title.localeCompare(a.title)
      } else if (order == 'new') {
        // Sort by last modified dates by new to old
        return dateB - dateA
      } else if (order == 'old') {
        // Sort by last modified dates by old to new
        return dateA - dateB
      }
    })
    setSortedNotes(sorted)
  }
  
  const generateTags = async (note: Note) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/generate-tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: note.content }), 
      });

      const data = await response.json();
      if (Array.isArray(data.tags)) {
        setGeneratedTags((prevTags) => ({ ...prevTags, [note.note_id]: data.tags }));
      } else {
        setGeneratedTags((prevTags) => ({ ...prevTags, [note.note_id]: [] }));
      }
    } catch (error) {
      console.error('Error generating tags:', error);
    }
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
                <Link href={`/showNote?note_id=${note.note_id}`} passHref>
                  <div className="border border-gray shadow hover:shadow-lg round-md text-center relative h-full w-full overflow-hidden sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                      <h3 className="mt-16 text-xl text-gray-800">
                        <span className="absolute inset-0" />
                        {note.title}
                        </h3>
                    <p className="text-base font-semibold text-gray-900">{note.tags.join(', ')}</p>
                    <p className="text-base font-semibold text-gray-900">{note.last_modified}</p>
                  </div> 
                </Link>
                <div className="generatedTags">
                  {generatedTags[note.note_id] && Array.isArray(generatedTags[note.note_id]) && (
                    <p className="generatedTags">
                      Tags: <p className="text-base font-semibold text-gray-900">{Array.isArray(note.tags) ? note.tags.join(', ') : ''}</p>
                    </p>
                  )}
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