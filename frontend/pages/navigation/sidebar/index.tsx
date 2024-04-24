/*
* Spring 2024 project
* Author: @positive235 (https://github.com/positive235)
* Reference: 
  - NextJS Docs(https://nextjs.org/docs)
  - How to create a responsive navigation bar (https://medium.com/@a.pirus/how-to-create-a-responsive-navigation-bar-in-next-js-13-e5540789a017)
*/


import Link from "next/link";

const Sidebar = ({
    isOpen,
    toggle,
  }: {
    isOpen: boolean;
    toggle: () => void;
  }): JSX.Element => {
    return (
      <>
        <div
          className="sidebar-container fixed w-full h-full overflow-hidden justify-center bg-white grid pt-[120px] left-0 z-10"
          style={{
            opacity: `${isOpen ? "1" : "0"}`,
            top: ` ${isOpen ? "0" : "-100%"}`,
          }}
        >
          <button className="absolute right-0 p-5" onClick={toggle}>
          {/* Close icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"> 
              <path
                fill="currentColor"
                d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
              />
            </svg>
          </button>
  
          <ul className="sidebar-nav text-center leading-relaxed text-xl">
            <li>
              <Link href="/" onClick={(e) => { e.preventDefault(); toggle(); }}><p>Transcribe</p></Link>
            </li>
            <li>
              <Link href="/uploadPage" onClick={(e) => { e.preventDefault(); toggle(); }}><p>Upload</p></Link>
            </li>
            <li>
              <Link href="/myNotesPage" onClick={(e) => { e.preventDefault(); toggle(); }}><p>My Notes</p></Link>
            </li>
          </ul>
        </div>
      </>
    );
  };
  
  export default Sidebar;