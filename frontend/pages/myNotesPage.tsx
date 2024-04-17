import React from 'react'
import Link from 'next/link';

function myNotesPage() {
  return (
    <><div className="logo-usermenu">
      <div className="logo"><Link href="/">Logo</Link></div>
      <div className="usermenu"><Link href="/userPage">User1</Link></div>
    </div>
    <div className="main">
    <div className="main-menu">
        <div className="transcribe"><Link href="/">Transcribe</Link></div>
        <div className="upload"><Link href="/uploadPage">Upload</Link></div>
        <div className="my-notes"><Link href="/myNotesPage">My Notes</Link></div>
    </div>
    <div className="my-notes-page">
      My Notes Page
    </div>
    </div>
    </>
  )
}

export default myNotesPage