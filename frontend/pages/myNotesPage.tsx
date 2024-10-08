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
import Link from "next/link";
import jsPDF from 'jspdf';


const HOST_URL = "http://127.0.0.1:8000/api"
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

function MyNotesPage() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [notesData, setNotesData] = useState<Note[]>([]);
  const [sortedNotes, setSortedNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [priorityTag, setPriorityTag] = useState<string>('');
  const [generatedTags, setGeneratedTags] = useState<{ [key: string]: string[] }>({});
  const [filteredTags, setFilteredTags] = useState<string[]>([]);

  
  // Fetch all notes for current user
  useEffect(() => {
    if (!currentUser) {
      router.push("/signIn");
      return
    }
    const fetchNotes = async () => {
      let accessToken = null;

      // Get user token
      await currentUser.getIdToken()
        .then((token) => {
          accessToken = token;
        });

      const response = await fetch(HOST_URL + "/mynotes", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const notesData = await response.json();
      notesData.forEach(note => {
        note.tags = Array.isArray(note.tags) ? note.tags : [];
      });
      setSortedNotes(notesData);
      setNotesData(notesData);
      setFilteredNotes(notesData);

      return notesData;
    }
    fetchNotes();
  }, [currentUser]);

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const order = event.target.value;
    setSortOrder(order);
    sortNotes(order);
  }

  const handleNewTag = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const tag = priorityTag;
    if (tag.length < 1) {
      return;
    }
    setPriorityTag("");
    const updatedTags = [...filteredTags, tag];
    filterNotesByTags(updatedTags);
    setFilteredTags(updatedTags);
  }

  const handleRemoveTag = (index: number) => {
    let tags = [...filteredTags];
    tags.splice(index, 1);
    filterNotesByTags(tags);
    setFilteredTags(tags);
  }

  const filterNotesByTags = (filter: string[], newlySortedNotes?: Note[]) => {
    let notes = newlySortedNotes || [...sortedNotes];
    const filteredNotes = notes.filter((note) => {
      const tags = note.tags;
      for (let i = 0; i < filter.length; i++) {
        if (!(tags.includes(filter[i]) || tags.includes(" " + filter[i]))) {
          return false;
        }
      }
      return true;
    });
    setFilteredNotes(filteredNotes);
  }

  const sortNotes = (order: string) => {
    const sorted = [...notesData].sort((a, b) => {
      const dateA = new Date(a.last_modified);
      const dateB = new Date(b.last_modified);

      if (order === 'asc') {
        return a.title.localeCompare(b.title);
      } else if (order === 'desc') {
        return b.title.localeCompare(a.title);
      } else if (order === 'new') {
        return dateB.getTime() - dateA.getTime();
      } else if (order === 'old') {
        return dateA.getTime() - dateB.getTime();
      } else {
        return 0;
      }
    });
    setSortedNotes(sorted);
    filterNotesByTags(filteredTags, sorted);
  }

  return (
    <>
      <div className="w-full h-full">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl py-12 sm:py-16 lg:max-w-none lg:py-16">
            <h2 className="text-2xl font-bold text-gray-900">My Notes</h2>
            <div className='space-y-2'>
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
                <form onSubmit={handleNewTag}>
                  <label htmlFor="tagInput">Filter by Tag:</label>
                  <input
                    className="rounded-md border border-black pl-1.5 text-gray-900"
                    type="text"
                    id="tagInput"
                    placeholder="Enter a tag"
                    value={priorityTag}
                    onChange={(e) => setPriorityTag(e.currentTarget.value)}
                  />
                </form>
              </div>
              <div className="flex flex-wrap gap-1 items-center mb-2">
                {filteredTags.map((tag, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-2 rounded dark:bg-blue-200 dark:text-blue-800">
                    <input className="mr-1" type="image" src="/images/x.svg" width="12" onClick={() => handleRemoveTag(index)} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-6 space-y-12 lg:grid lg:grid-cols-5 lg:gap-6 lg:space-y-0">
              {filteredNotes ? (filteredNotes.map((note) => (
                <div key={note.note_id} className="group relative">
                  <Link href={`/showNote?note_id=${note.note_id}`} passHref>
                    <div className="border-2 border-blue-500 shadow hover:shadow-lg rounded-lg text-center relative h-full w-full overflow-hidden sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64 bg-white">
                      <h3 className="mt-4 text-xl text-gray-800 px-3">{note.title}</h3>
                      <div className="px-3 py-2">
                        <div className="flex flex-wrap gap-1 justify-center items-center mb-2">
                          {note.tags.map((tag, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <p className="text-sm font-semibold text-gray-600">{note.last_modified}</p>
                      </div>
                    </div>
                  </Link>
                  <div className="generatedTags"> {/* Display generated tags */}
                    {Array.isArray(generatedTags[note.note_id]) && (
                      <p className="generatedTags">
                        Tags: {generatedTags[note.note_id].join(', ')}
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
  );
}

export default MyNotesPage;
