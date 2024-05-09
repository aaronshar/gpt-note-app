/*
* Spring 2024 project
* Author: @positive235 (https://github.com/positive235)
* Reference: 
 - NextJS Docs(https://nextjs.org/docs)
 - TailwindCSS Docs(https://tailwindcss.com/docs/)
 - https://tailwindui.com/
*/


import React, { useState, useEffect } from 'react'

function myNotesPage() {
  const notesData: { 
    id: number;
    title: string;
    tags: string[];
    lastModified: string;
  }[] = [
    {id: 1, title: 'title-a', tags: ['a', 'b', 'c'], lastModified: '2024-05-01'},
    {id: 2, title: 'title-b', tags: ['d', 'e', 'f'], lastModified: '2024-05-02'},
    {id: 3, title: 'title-c', tags: ['a', 'b', 'c'], lastModified: '2024-05-05'},
    {id: 4, title: 'title-d', tags: ['d', 'e', 'f'], lastModified: '2024-05-07'},
    {id: 5, title: 'title-e', tags: ['a', 'b', 'c'], lastModified: '2024-05-10'},
    {id: 6, title: 'title-f', tags: ['d', 'e', 'f'], lastModified: '2024-05-12'},
    {id: 7, title: 'title-g', tags: ['a', 'b', 'c'], lastModified: '2024-05-15'},
    {id: 8, title: 'title-h', tags: ['d', 'e', 'f'], lastModified: '2024-05-17'},
    {id: 9, title: 'title-i', tags: ['a', 'b', 'c'], lastModified: '2024-05-19'},
    {id: 10, title: 'title-j', tags: ['d', 'e', 'f'], lastModified: '2024-05-20'}
  ]

  return (
    <>
    <div className="w-full h-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-12 sm:py-16 lg:max-w-none lg:py-16">
          <h2 className="text-2xl font-bold text-gray-900">My Notes</h2>

          <div className="mt-6 space-y-12 lg:grid lg:grid-cols-5 lg:gap-6 lg:space-y-0">
            {notesData ? (notesData.map((note) => (
              <div key={note.id} className="group relative">
                <a href={note.href}>
                <div className="border border-gray shadow hover:shadow-lg round-md text-center relative h-full w-full overflow-hidden sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                  <h3 className="mt-16 text-xl text-gray-800">
                    <span className="absolute inset-0" />
                      {note.title}
                  </h3>
                  <p className="text-base font-semibold text-gray-900">{note.tags.join(', ')}</p>
                  <p className="text-base font-semibold text-gray-900">{note.lastModified}</p>
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