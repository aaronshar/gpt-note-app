/*
* Spring 2024 project
* Author: @positive235 (https://github.com/positive235)
* Reference: 
 - NextJS Docs(https://nextjs.org/docs)
 - TailwindCSS Docs(https://tailwindcss.com/docs/)
 - https://tailwindui.com/
*/


import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';

function myNotesPage() {
  const { currentUser } = useAuth()
  const router = useRouter()
  const [notesData, setNotesData] = useState();

  if (!currentUser){
    router.push("/signIn")
  }
  
  // fetch all notes for current user
  // let notesData = null;
  useEffect(() => {
    const fetchNotes = async () => {
      let accessToken = null;
      // let notesData = null;

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
      setNotesData(notesData)

      return notesData
    }
    fetchNotes()
  },[])


  return (
    <>
    <div className="w-full h-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-12 sm:py-16 lg:max-w-none lg:py-16">
          <h2 className="text-2xl font-bold text-gray-900">My Notes</h2>

          <div className="mt-6 space-y-12 lg:grid lg:grid-cols-5 lg:gap-6 lg:space-y-0">
            {notesData ? (notesData.map((note) => (
              <div key={note.note_id} className="group relative">
                <a href={note.href}>
                <div className="border border-gray shadow hover:shadow-lg round-md text-center relative h-full w-full overflow-hidden sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                  <h3 className="mt-16 text-xl text-gray-800">
                    <span className="absolute inset-0" />
                      {note["title"]}
                  </h3>
                  <p className="text-base font-semibold text-gray-900">{note.tags.join(', ')}</p>
                  <p className="text-base font-semibold text-gray-900">{note.last_modified}</p>
                </div> 
                </a>
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