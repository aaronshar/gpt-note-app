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

  const [sortedNotes, setSortedNotes] = useState(notesData)
  const [sortOrder, setSortOrder] = useState('asc')
  const [priorityTag, setPriorityTag] = useState('')

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const order = event.target.value
    setSortOrder(order)
    sortNotes(order, priorityTag)
  }

  const handleTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const tag = event.target.value;
    setPriorityTag(tag);
    sortNotes(sortOrder, tag);
  }

  const sortNotes = (order: string, tag: string) => {
    const sorted = [...notesData].sort((a, b) => {
      const aHasTag = a.tags.includes(tag) ? 1 : 0;
      const bHasTag = b.tags.includes(tag) ? 1 : 0;

      if (aHasTag !== bHasTag) {
        // Prioritize notes with a tag
        return bHasTag - aHasTag;
      }

      if (order === 'asc') {
        // Sort by alphabetical order
        return a.title.localeCompare(b.title)
      } else if (order == 'desc') {
        // Sort by reversed alphabetical order
        return b.title.localeCompare(a.title)
      } else if (order == 'new') {
        // Sort by last modified dates by new to old
        return a.lastModified.localeCompare(b.lastModified)
      } else if (order == 'old') {
        // Sort by last modified dates by old to new
        return b.lastModified.localeCompare(a.lastModified)
      }
    });
    setSortedNotes(sorted)
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