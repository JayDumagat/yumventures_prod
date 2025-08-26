import { useState, useRef, useEffect } from "react";
import useAuthStore from "../stores/useAuthStore";
import { Link } from "react-router-dom";

export default function SidebarFooter() {
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div>
      <footer className="mt-auto p-2 border-t border-gray-200 dark:border-neutral-700">
        <div className="[--strategy:absolute] [--auto-close:inside] relative w-full inline-flex">
          <button
            type="button"
            className="w-full inline-flex shrink-0 items-center gap-x-2 p-2 text-start text-sm text-gray-800 rounded-md hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            onClick={toggleDropdown}
          >
            <div>
              <img src={
                user?.profileImage
                    ? `${import.meta.env.VITE_API_URL}${user.profileImage}`
                    : "https://preline.co/assets/img/160x160/img1.jpg"
              } alt="Profile" className="shrink-0 w-10 h-10 rounded-full"/>
            </div>
            {user?.firstName} {user?.lastName}
            <svg
              className="shrink-0 size-3.5 ms-auto"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m7 15 5 5 5-5" />
              <path d="m7 9 5-5 5 5" />
            </svg>
          </button>

          {isOpen && (
            <div
              ref={dropdownRef}
              className="opacity-100 bottom-20 w-60 transition-[opacity,margin] duration fixed z-20 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-neutral-900 dark:border-neutral-700"
            >
              <div className="p-1">
                <Link
                  className="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                  to="/profile"
                >
                  Profile
                </Link>
                <button
                  className="w-full flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                  onClick={logout}
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
