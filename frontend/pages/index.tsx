import Link from 'next/link';
import React, { useEffect, useState } from 'react'

function index() {
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
    <div className="transcribe-page">
      <div className="trans-note">A note for transcription</div>
    </div>
    </div>
    </>
  );
};

export default index