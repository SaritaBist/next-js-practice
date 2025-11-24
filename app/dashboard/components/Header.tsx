"use client";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const { data: session, status } = useSession();
   console.log("Session data in Header:", session?.user);

  const handleLogout = () => {
    signOut({ callbackUrl: "/sign-in" });
  };

  return (
    <header className="bg-white shadow flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">Welcome</h1>
        {status === "loading" ? (
          <span className="text-gray-500">Loading...</span>
        ) : session?.user ? (
          <span className="font-medium text-blue-600">{session.user.name}</span>
        ) : (
          <span className="text-gray-500">Guest</span>
        )}
      </div>
      <div className="relative">
        <button
          className="flex items-center gap-2 focus:outline-none"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          <span className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 14a4 4 0 100-8 4 4 0 000 8z" />
            </svg>
          </span>
        </button>
        {showMenu && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}